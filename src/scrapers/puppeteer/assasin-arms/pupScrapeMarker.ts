import puppeteer from 'puppeteer';
import ProductAsPuppeteer from '../../../models/puppeteer-models/productPuppeteer';  // Używamy odpowiedniego modelu

export const scrapeMarker = async (): Promise<void> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseUrl = 'https://assassins-arms.com/pol_m_Sprzet_Markery-166.html';

    for (let i = 0; i <= 3; i++) {
        const url = i === 1 ? baseUrl : `${baseUrl}?counter=${i}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

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
                    price = priceMatch[0].replace(/\s/g, '');  // Usunięcie spacji z ceny
                } else {
                    price = 'Unknown';  // W razie problemu, przypisz Unknown
                }

                return {
                    name,
                    price,
                    availability,
                    url,
                    imageUrl: `https://assassins-arms.com${imageUrl}`,
                    category: 'Marker'
                };
            });
        });

        for (const productData of products) {
            const existingProduct = await ProductAsPuppeteer.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductAsPuppeteer(productData);
                await product.save();
            }
        }
    }

    await browser.close();
};
