import { firefox } from 'playwright';
import ProductVpPlaywright from '../../../models/playwright-models/productVpPaintball';

export const scrapeMaskVp = async (): Promise<void> => {
    const browser = await firefox.launch();
    const page = await browser.newPage();

    const urls = [
        'https://victorypaintball.pl/kategoria/maski/dye/',
        'https://victorypaintball.pl/kategoria/maski/virtue/',
        'https://victorypaintball.pl/kategoria/maski/v-force/'
    ];

    for (const url of urls) {
        await page.goto(url, { waitUntil: 'networkidle' });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.products.columns-4 > li')).map(product => {
                const name = product.querySelector('.woocommerce-loop-product__title')?.textContent?.trim() || 'Unknown';
                const price = product.querySelector('.price .woocommerce-Price-amount')?.textContent?.trim().replace(/\s/g, '').replace(/,/g, '') || 'Unknown';
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
                    category: 'Mask',
                };
            });
        });

        for (const productData of products) {
            const existingProduct = await ProductVpPlaywright.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductVpPlaywright(productData);
                await product.save();
            }
        }
    }

    await browser.close();
};
