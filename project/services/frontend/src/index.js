import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files (HTML, CSS, JS) from the public folder
// In production (EKS), this service would be behind Nginx Ingress as well.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend Server running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});
