const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (req, res) => {
  try {
    const { category, preferences } = req.body;
    
    if (!category || !preferences?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `As a beauty consultant, recommend 5 ${category} products for: ${preferences.join(', ')}. 
      Return ONLY a JSON array with this exact format:
      [{
        "name": "Product Name",
        "brand": "Brand Name",
        "price": "XX.XX",
        "description": "Key benefits and features (max 2 sentences)",
        "whyRecommend": "Why this matches user preferences (1 sentence)"
      }]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse JSON
    const cleanJSON = text
      .replace(/```json|```/g, '')
      .replace(/^[^[{]*/, '')
      .replace(/[^}\]]*$/, '')
      .trim();

    const products = JSON.parse(cleanJSON);

    // Validate response
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Invalid response format');
    }

    res.json(products);

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
};

module.exports = { getRecommendations };