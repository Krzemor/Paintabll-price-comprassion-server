import puppeteer from 'puppeteer';
import ProductPsPuppeteer from '../../../models/puppeteer-models/productPsPuppeteer';

export const scrapeMarkerPs = async (): Promise<void> => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseUrl = 'https://paintball.sklep.pl/pl/c/Markery-paintballowe/26';

    for (let i = 3; i <= 6; i++) {
        const url = i === 1 ? baseUrl : `${baseUrl}/${i}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('.product.product_view-extended')).map(product => {
                const name = product.querySelector('.prodname .productname')?.textContent?.trim() || 'Unknown';
                const price = product.querySelector('.price em')?.textContent?.trim().replace(/\s/g, '') || 'Unknown';
                const availability = 'Brak informacji o dostępności';
                let url = product.querySelector('.prodimage')?.getAttribute('href') || '';
                let imageUrl = product.querySelector('.img-wrap img')?.getAttribute('src');

                if (!imageUrl || imageUrl.startsWith('data:image')) {
                    imageUrl = product.querySelector('.img-wrap img')?.getAttribute('data-src');
                }

                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = `https://paintball.sklep.pl${imageUrl}`;
                }

                if (!url.startsWith('http')) {
                    url = `https://paintball.sklep.pl${url}`;
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
            const existingProduct = await ProductPsPuppeteer.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductPsPuppeteer(productData);
                await product.save();
            }
        }
    }

    await browser.close();
};
