import express, { Request, Response } from 'express';
import { scrapeLoader } from "../scrapers/playwright/assassin-arms/playScrapeLoader";
import { scrapeMarker } from '../scrapers/playwright/assassin-arms/playScrapeMarker';
import { scrapeMask } from '../scrapers/playwright/assassin-arms/playScrapeMask';
import { scrapeLoaderPs } from '../scrapers/playwright/paintball-sklep/playScrapeLoaderPs';
import { scrapeMarkerPs } from '../scrapers/playwright/paintball-sklep/playScrapeMarkerPs';
import { scrapeMaskPs } from '../scrapers/playwright/paintball-sklep/playScrapeMaskPs';
import { scrapeLoaderVp } from '../scrapers/playwright/victory-paintball/playScrapeLoaderVp';
import { scrapeMarkerVp } from '../scrapers/playwright/victory-paintball/playScrapeMarkerVp';
import { scrapeMaskVp } from '../scrapers/playwright/victory-paintball/playScrapeMaskVp';

const router = express.Router();

router.get('/scrape-playwright', async (req: Request, res: Response) => {
    try {
        await Promise.all([
            scrapeLoader(),
            scrapeMarker(),
            scrapeMask(),
            scrapeLoaderPs(),
            scrapeMarkerPs(),
            scrapeMaskPs(),
            scrapeLoaderVp(),
            scrapeMarkerVp(),
            scrapeMaskVp(),
        ]);
        res.send('Scraping completed using Playwright for all links');
    } catch (error) {
        console.error(error)
        res.status(500).send('Error occurred during scraping');
    }
});

export default router;