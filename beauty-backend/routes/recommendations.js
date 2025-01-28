const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/geminiController');

router.post('/', getRecommendations);

module.exports = router;