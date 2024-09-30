import express, { Request, Response } from 'express';
import Product from '../models/cheerio-models/product';
import ProductSP from '../models/cheerio-models/productSklep';
import ProductVP from '../models/cheerio-models/productVP';
import ProductAsPuppeteer from '../models/puppeteer-models/productPuppeteer';
import ProductPsPuppeteer from '../models/puppeteer-models/productPsPuppeteer';
import ProductVpPuppeteer from '../models/puppeteer-models/productVpPuppeteer';
import ProductAsPlaywright from '../models/playwright-models/productPlaywright';
import ProductPsPlaywright from '../models/playwright-models/productPsPlaywright';
import ProductVpPlaywright from '../models/playwright-models/productVpPaintball';

interface Product {
    name: string;
    price: string;
    availability: string;
    url: string;
    imageUrl: string;
}

const router = express.Router();

router.get('/products/search', async (req: Request, res: Response) => {
    try {
        const searchQuery = req.query.q as string;
        const category = req.query.category as string;
        const source = req.query.source as string || 'cheerio';  // Domyślnie cheerio

        let products: Product[] = [];
        let productsSP: Product[] = [];
        let productsVP: Product[] = [];

        if (source === 'puppeteer') {
            products = await ProductAsPuppeteer.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsSP = await ProductPsPuppeteer.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsVP = await ProductVpPuppeteer.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

        } else if (source === 'playwright') {
            products = await ProductAsPlaywright.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsSP = await ProductPsPlaywright.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsVP = await ProductVpPlaywright.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

        } else {
            products = await Product.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsSP = await ProductSP.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];

            productsVP = await ProductVP.find({
                name: { $regex: searchQuery, $options: 'i' },
                category: category,
            }) as Product[];
        }

        res.json({ products, productsSP, productsVP });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products from the database.' });
    }
});

export default router;
