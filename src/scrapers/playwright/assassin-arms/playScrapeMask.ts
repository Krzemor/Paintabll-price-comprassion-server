import { firefox } from 'playwright';
import ProductAsPlaywright from '../../../models/playwright-models/productPlaywright';

export const scrapeMask = async (): Promise<void> => {
    const browser = await firefox.launch();
    const page = await browser.newPage();

    const baseUrl = 'https://assassins-arms.com/pol_m_Sprzet_Maski-162.html';

    for (let i = 0; i <= 4; i++) {
        const url = i === 1 ? baseUrl : `${baseUrl}?counter=${i}`;
        await page.goto(url, { waitUntil: 'networkidle' });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.product')).map(product => {
                const name = product.querySelector('.product__name')?.textContent?.trim() || 'Unknown';
                let price = product.querySelector('.price.--main')?.textContent?.trim() || 'Unknown';
                const availability = product.querySelector('.label.--disable')?.textContent?.trim() || 'Dostępny';
                let url = product.querySelector('.product__name')?.getAttribute('href') || '';
                const imageUrl = product.querySelector('picture img')?.getAttribute('src') || '';

                if (!url.startsWith('http')) {
                    url = `https://assassins-arms.com${url}`;
                }

                const priceMatch = price.match(/[\d\s,]+ zł/);
                if (priceMatch) {
                    price = priceMatch[0].replace(/\s/g, '');
                } else {
                    price = 'Unknown';
                }

                return {
                    name,
                    price,
                    availability,
                    url,
                    imageUrl: `https://assassins-arms.com${imageUrl}`,
                    category: 'Mask',
                };
            });
        });

        for (const productData of products) {
            const existingProduct = await ProductAsPlaywright.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductAsPlaywright(productData);
                await product.save();
            }
        }
    }

    await browser.close();
};
