import mongoose, { Schema, Document } from 'mongoose';

interface ProductVPDocument extends Document {
    name: string;
    price: string;
    availability: string;
    url: string;
    imageUrl: string;
    category: string;
}

const ProductVPSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    availability: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
});

const ProductVP = mongoose.model<ProductVPDocument>('ProductVP', ProductVPSchema);

export default ProductVP;
