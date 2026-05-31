const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const contentFile = path.join(__dirname, 'data', 'content.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const loadContent = () => {
  try {
    return JSON.parse(fs.readFileSync(contentFile, 'utf8'));
  } catch (error) {
    console.error('Unable to load content.json:', error);
    return {};
  }
};

const saveContent = (data) => {
  fs.writeFileSync(contentFile, JSON.stringify(data, null, 2));
};

let content = loadContent();

const requireAdmin = (req, res, next) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    return next();
  }

  const providedKey = req.headers['x-admin-key'] || req.query.admin_key;
  if (providedKey !== adminKey) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  next();
};

app.get(['/admin', '/admin.html'], requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/pages', requireAdmin, (req, res) => {
  res.json(Object.keys(content));
});

app.get('/api/content/:page', (req, res) => {
  const page = req.params.page;
  if (!content[page]) {
    return res.status(404).json({ error: 'Page content not found' });
  }
  res.json(content[page]);
});

app.put('/api/content/:page', (req, res) => {
  const page = req.params.page;
  const pageContent = req.body;

  if (!pageContent || typeof pageContent !== 'object') {
    return res.status(400).json({ status: 'error', message: 'Invalid content payload' });
  }

  content[page] = pageContent;
  try {
    saveContent(content);
    return res.json({ status: 'success', message: `Saved ${page}.` });
  } catch (error) {
    console.error('Failed to save content:', error);
    return res.status(500).json({ status: 'error', message: 'Unable to save content' });
  }
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }
  console.log('Newsletter signup:', email);
  res.json({ status: 'success', message: 'Thanks for signing up!' });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
