import mongoose, { Schema, Document } from 'mongoose';

interface ProductPsPuppeteerDocument extends Document {
    name: string;
    price: string;
    availability: string;
    url: string;
    imageUrl: string;
    category: string;
}

const ProductPsPuppeteerSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
});

const ProductPsPuppeteer = mongoose.model<ProductPsPuppeteerDocument>('ProductPsPuppeteer', ProductPsPuppeteerSchema);

export default ProductPsPuppeteer;
