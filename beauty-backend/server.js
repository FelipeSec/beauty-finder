require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recommendationsRouter = require('./routes/recommendations');
const scrapeRoute = require('./routes/scrape');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // Update with your frontend URL
}));
app.use(express.json());

// Routes
app.use('/api/recommendations', recommendationsRouter);
app.use('/api', scrapeRoute);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Recommendations API: http://localhost:${PORT}/api/recommendations`);
  console.log(`- Scraping API: http://localhost:${PORT}/api/scrape`);
});