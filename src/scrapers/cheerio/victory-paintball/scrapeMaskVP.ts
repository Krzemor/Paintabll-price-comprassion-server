import axios from 'axios';
import * as cheerio from 'cheerio';
import ProductVP from '../../../models/cheerio-models/productVP';

export const scrapeMaskVP = async (): Promise<void> => {
    const urls = [
        'https://victorypaintball.pl/kategoria/maski/dye/',
        'https://victorypaintball.pl/kategoria/maski/virtue/',
        'https://victorypaintball.pl/kategoria/maski/v-force/'
    ];

    for (const url of urls) {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $('.products.columns-4 > li').each(async (_, element) => {
            const name = $(element).find('.woocommerce-loop-product__title').text().trim();
            const price = $(element).find('.price .woocommerce-Price-amount').text().trim().replace(/\s/g, '').replace(',', '');
            const availability = $(element).find('.ast-shop-product-out-of-stock').length > 0 ? 'Brak w magazynie' : 'Dostępny';
            let url = $(element).find('.woocommerce-LoopProduct-link').attr('href') || '';
            let imageUrl = $(element).find('.astra-shop-thumbnail-wrap img').attr('src') || '';

            if (url && !url.startsWith('http')) {
                url = `https://victorypaintball.pl${url}`;
            }
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https://victorypaintball.pl${imageUrl}`;
            }

            const productData = {
                name,
                price,
                availability,
                url,
                imageUrl,
                category: 'Mask',
            };

            const existingProduct = await ProductVP.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductVP(productData);
                await product.save();
            }
        });
    }
};
