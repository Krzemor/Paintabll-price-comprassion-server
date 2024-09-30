import puppeteer from 'puppeteer';
import ProductVpPuppeteer from '../../../models/puppeteer-models/productVpPuppeteer';

export const scrapeMarkerVp = async (): Promise<void> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const urls = [
        'https://victorypaintball.pl/kategoria/markery-paintballowe/planet-eclipse/',
        'https://victorypaintball.pl/kategoria/markery-paintballowe/tippmann/',
        'https://victorypaintball.pl/kategoria/markery-paintballowe/bt-markery-paintballowe/',
    ];

    for (const url of urls) {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.products.columns-4 > li')).map(product => {
                const name = product.querySelector('.woocommerce-loop-product__title')?.textContent?.trim() || 'Unknown';
                const price = product.querySelector('.price .woocommerce-Price-amount')?.textContent
                    ?.trim()
                    .replace(/\./g, '')   // Usuwa kropki (jeśli są używane jako separator tysięcy)
                    .replace(/,/g, '.')   // Zamienia przecinek na kropkę (przecinek jako separator dziesiętny)
                    .replace('zł', '')    // Usuwa jednostkę "zł"
                    .trim() || 'Unknown'; // Usuwa białe znaki na końcu
                const availability = product.querySelector('.ast-shop-product-out-of-stock') ? 'Brak w magazynie' : 'Dostępny';

                let url = product.querySelector('.woocommerce-LoopProduct-link')?.getAttribute('href') || '';
                let imageUrl = product.querySelector('.astra-shop-thumbnail-wrap img')?.getAttribute('src') || '';

                // Upewnij się, że URL-e są kompletne
                if (url && !url.startsWith('http')) {
                    url = `https://victorypaintball.pl${url}`;
                }
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `https://victorypaintball.pl${imageUrl}`;
                }

                return {
                    name,
                    price,
                    availability,
                    url,
                    imageUrl,
                    category: 'Marker',
                };
            });
        });

        for (const productData of products) {
            const existingProduct = await ProductVpPuppeteer.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductVpPuppeteer(productData);
                await product.save();
            }
        }
    }

    await browser.close();
};
