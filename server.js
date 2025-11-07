const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve CSS files
app.use('/css', express.static(path.join(__dirname, 'css')));

// Serve source files
app.use('/src', express.static(path.join(__dirname, 'src')));

// Inject API_BASE_URL into index.html
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Replace API_BASE_URL placeholder with environment variable or default
  const apiBaseUrl = process.env.API_BASE_URL || '';
  html = html.replace(
    /window\.API_BASE_URL = window\.API_BASE_URL \|\| '';/,
    `window.API_BASE_URL = '${apiBaseUrl}';`
  );
  
  res.send(html);
});

// Handle all other routes and serve index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
  if (process.env.API_BASE_URL) {
    console.log(`API Base URL: ${process.env.API_BASE_URL}`);
  }
});

