import axios from 'axios';
import * as cheerio from 'cheerio';
import Product from '../../../models/cheerio-models/product';

export const scrapeMask = async (): Promise<void> => {
    const baseUrl = 'https://assassins-arms.com/pol_m_Sprzet_Maski-162.html';

    for (let i = 0; i <= 4; i++) {
        const url = `${baseUrl}?counter=${i}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const products = $('#search .product').toArray();

        for (const element of products) {
            const name = $(element).find('.product__name').text().trim() || 'Unknown';
            let price = $(element).find('.price.--main').text().trim() || 'Unknown';
            const availability = $(element).find('.label.--disable').text().trim() || 'Dostępny';
            const url = $(element).find('a.product__name').attr('href') || '';
            const imageUrl = $(element).find('picture img').attr('src') || '';

            const priceMatch = price.match(/[\d\s,]+ zł/);
            if (priceMatch) {
                price = priceMatch[0].replace(/\s/g, '');
            } else {
                price = 'Unknown';
            }

            const productData = {
                name,
                price,
                availability,
                url: `https://assassins-arms.com${url}`,
                imageUrl: `https://assassins-arms.com${imageUrl}`,
                category: 'Mask',
            };

            const existingProduct = await Product.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new Product(productData);
                await product.save();
            }
        }
    }
};
