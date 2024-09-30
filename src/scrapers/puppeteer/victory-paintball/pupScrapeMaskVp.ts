import puppeteer from 'puppeteer';
import ProductVpPuppeteer from '../../../models/puppeteer-models/productVpPuppeteer';

export const scrapeMaskVp = async (): Promise<void> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const urls = [
        'https://victorypaintball.pl/kategoria/maski/dye/',
        'https://victorypaintball.pl/kategoria/maski/virtue/',
        'https://victorypaintball.pl/kategoria/maski/v-force/'
    ];

    for (const url of urls) {
        await page.goto(url, { waitUntil: 'networkidle2' });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.products.columns-4 > li')).map(product => {
                const name = product.querySelector('.woocommerce-loop-product__title')?.textContent?.trim() || 'Unknown';
                const price = product.querySelector('.price .woocommerce-Price-amount')?.textContent?.trim().replace(/\s/g, '').replace(/,/g, '') || 'Unknown';
                const availability = product.querySelector('.ast-shop-product-out-of-stock') ? 'Brak w magazynie' : 'Dostępny';
                let url = product.querySelector('.woocommerce-LoopProduct-link')?.getAttribute('href') || '';
                let imageUrl = product.querySelector('.astra-shop-thumbnail-wrap img')?.getAttribute('src') || '';

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
                    category: 'Mask',
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
