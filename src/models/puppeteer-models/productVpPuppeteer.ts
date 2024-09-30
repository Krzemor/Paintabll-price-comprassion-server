import mongoose, { Schema, Document } from 'mongoose';

interface ProductVpPuppeteerDocument extends Document {
    name: string;
    price: string;
    availability: string;
    url: string;
    imageUrl: string;
    category: string;
}

const ProductVpPuppeteerSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
});

const ProductVpPuppeteer = mongoose.model<ProductVpPuppeteerDocument>('ProductVpPuppeteer', ProductVpPuppeteerSchema);

export default ProductVpPuppeteer;
