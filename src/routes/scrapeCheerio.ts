import express, { Request, Response } from 'express';
import { scrapeLoader } from '../scrapers/cheerio/assasin-arms/scrapeLoader';
import { scrapeMarker } from '../scrapers/cheerio/assasin-arms/scrapeMarker';
import { scrapeMask } from '../scrapers/cheerio/assasin-arms/scrapeMask';
import { scrapeMarkerSP } from '../scrapers/cheerio/paintball-sklep/scrapeMarkerSP';
import { scrapeMaskSP } from '../scrapers/cheerio/paintball-sklep/scrapeMaskSP';
import { scrapeLoaderSP } from '../scrapers/cheerio/paintball-sklep/scrapeLoaderSP';
import { scrapeMaskVP } from '../scrapers/cheerio/victory-paintball/scrapeMaskVP';
import { scrapeMarkerVP } from '../scrapers/cheerio/victory-paintball/scrapeMarkerVP';
import { scrapeLoaderVP } from '../scrapers/cheerio/victory-paintball/scrapeLoaderVP';

const router = express.Router();

router.get('/scrape-cheerio', async (req: Request, res: Response) => {
    try {
        await Promise.all([
            scrapeLoader(),
            scrapeMarker(),
            scrapeMask(),
            scrapeMarkerSP(),
            scrapeMaskSP(),
            scrapeLoaderSP(),
            scrapeMaskVP(),
            scrapeMarkerVP(),
            scrapeLoaderVP()
        ]);
        res.send('Scraping completed using Cheerio for all links');
    } catch (error) {
        console.error(error)
        res.status(500).send('Error occurred during scraping');
    }
});

export default router;


