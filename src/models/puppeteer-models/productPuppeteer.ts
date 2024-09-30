import mongoose, { Schema, Document } from 'mongoose';

interface ProductAsPuppeteerDocument extends Document {
    name: string;
    price: string;
    availability: string;
    url: string;
    imageUrl: string;
    category: string;
}

const ProductAsPuppeteerSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
});

const ProductAsPuppeteer = mongoose.model<ProductAsPuppeteerDocument>('ProductAsPuppeteer', ProductAsPuppeteerSchema);

export default ProductAsPuppeteer;
