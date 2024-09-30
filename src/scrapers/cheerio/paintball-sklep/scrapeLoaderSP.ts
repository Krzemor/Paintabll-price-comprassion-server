import axios from 'axios';
import * as cheerio from 'cheerio';
import ProductSP from '../../../models/cheerio-models/productSklep';

export const scrapeLoaderSP = async (): Promise<void> => {
    const baseUrl = 'https://paintball.sklep.pl/pl/c/loadery-hoppery/61';

    for (let i = 1; i <= 3; i++) {
        const url = `${baseUrl}/${i}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $('.product.product_view-extended').each(async (_, element) => {
            const name = $(element).find('.prodname .productname').text().trim();
            const price = $(element).find('.price em').text().trim().replace(/\s/g, '');
            const availability = 'Brak informacji o dostępności';
            const url = `https://paintball.sklep.pl${$(element).find('.prodimage').attr('href')}`;
            let imageUrl = $(element).find('.img-wrap img').attr('src');

            if (!imageUrl || imageUrl.startsWith('data:image')) {
                imageUrl = $(element).find('.img-wrap img').attr('data-src');
            }

            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `https://paintball.sklep.pl${imageUrl}`;
            }

            const productData = {
                name,
                price,
                availability,
                url,
                imageUrl,
                category: 'Loader',
            };

            const existingProduct = await ProductSP.findOne({ url: productData.url });
            if (!existingProduct) {
                const product = new ProductSP(productData);
                await product.save();
            }
        });
    }
};
