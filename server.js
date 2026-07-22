import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// OCR now runs entirely client-side via @paddleocr/paddleocr-js (loaded from esm.sh in the browser),
// so this server only needs to serve the static frontend.
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
