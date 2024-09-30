import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import scrapeRoutes from './routes/scrapeCheerio';
import productsRoutes from './routes/products';
import scrapeRoutesPuppeteer from './routes/scrapePuppeteer';
import scrapeRoutesPlaywright from './routes/scrapePlaywright';

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/paintball')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


app.use(cors());
app.use(express.json());

app.use('/api', scrapeRoutes);
app.use('/api', productsRoutes);
app.use('/api', scrapeRoutesPuppeteer);
app.use('/api', scrapeRoutesPlaywright);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
