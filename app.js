const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000; 

const spoonacularApiKey = 'c69613fec1914093b5aae817fafaf289'; 
const spoonacularApiUrl = 'https://api.spoonacular.com/recipes/complexSearch';

app.use(express.json());

app.get('/recipes', async (req, res) => {
  const query = req.query.query || ''; 

  try {
    const response = await axios.get(`${spoonacularApiUrl}?apiKey=${spoonacularApiKey}&query=${query}`);
    
    if (response.data.results.length > 0) {
      const recipes = response.data.results.map(recipe => ({
        title: recipe.title,
      }));

      
      const htmlPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recipes</title>
        </head>
        <body>
          <h1>Recipes</h1>
          <ul>
            ${recipes.map(recipe => `<li>${recipe.title}</li>`).join('')}
          </ul>
        </body>
        </html>
      `;

      res.send(htmlPage);
    } else {
      res.status(404).json({ error: 'No recipes found for the ingredient' });
    }
  } catch (error) {
    console.error('Error', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//http://localhost:3000/recipes?query='ingredient'