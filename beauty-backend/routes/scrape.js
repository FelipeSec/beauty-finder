// beauty-backend/routes/scrape.js
const express = require('express');
const router = express.Router();
const { ApifyClient } = require('apify');
require('dotenv').config();

const { APIFY_TOKEN } = process.env;

if (!APIFY_TOKEN) {
  console.error('APIFY_TOKEN is not defined. Please set it in your environment.');
  process.exit(1);
}

const client = new ApifyClient({
  token: APIFY_TOKEN,
});

router.get('/scrape', async (req, res) => {
  try {
    const productQuery = req.query.product;
    console.log('Product Query:', productQuery);
    
    if (!productQuery) {
      return res.status(400).json({ error: 'Product query is required' });
    }
    
    // Run Apify actor
    const run = await client.actor("apify/web-scraper").call({
      startUrls: [{
        url: `https://duckduckgo.com/?q=${encodeURIComponent(productQuery)}+price`,
      }],
      pageFunction: async ({ page }) => {
        try {
          await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(productQuery)}+price`, { 
            waitUntil: 'networkidle2' 
          });
          
          await page.waitForSelector('.result__body', { timeout: 10000 });

          return page.evaluate(() => {
            const results = [];
            document.querySelectorAll('.result__body').forEach((item) => {
              const title = item.querySelector('.result__title')?.textContent;
              const url = item.querySelector('.result__url')?.href;
              const snippet = item.querySelector('.result__snippet')?.textContent;

              if (title && url) {
                results.push({
                  title,
                  url,
                  snippet,
                });
              }
            });
            return results;
          });
        } catch (error) {
          console.error('Error in page function:', error);
          return [];
        }
      },
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    res.json(items);
    
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape product deals' });
  }
});

module.exports = router;
