import express, { Request, Response } from 'express';
import { scrapeMarker } from '../scrapers/puppeteer/assasin-arms/pupScrapeMarker';
import { scrapeLoader } from '../scrapers/puppeteer/assasin-arms/pupScrapeLoader';
import { scrapeMask } from '../scrapers/puppeteer/assasin-arms/pupScrapeMask';
import { scrapeLoaderPs } from '../scrapers/puppeteer/paintball-sklep/pupScrapeLoaderPs';
import { scrapeMarkerPs } from '../scrapers/puppeteer/paintball-sklep/pupScrapeMarkerPs';
import { scrapeMaskPs } from '../scrapers/puppeteer/paintball-sklep/pupScrapeMaskPs';
import { scrapeLoaderVp } from '../scrapers/puppeteer/victory-paintball/pupScrapeLoaderVp';
import { scrapeMarkerVp } from '../scrapers/puppeteer/victory-paintball/pupScrapeMarkerVp';
import { scrapeMaskVp } from '../scrapers/puppeteer/victory-paintball/pupScrapeMaskVp';

const router = express.Router();

router.get('/scrape-puppeteer', async (req: Request, res: Response) => {
    try {
        await Promise.all([
            scrapeMarker(),
            scrapeLoader(),
            scrapeMask(),
            scrapeLoaderPs(),
            scrapeMarkerPs(),
            scrapeMaskPs(),
            scrapeLoaderVp(),
            scrapeMarkerVp(),
            scrapeMaskVp()
        ]);
        res.send('Scraping completed using Puppeteer for all links');
    } catch (error) {
        res.status(500).send('Error occurred during Puppeteer scraping');
    }
});

export default router;
