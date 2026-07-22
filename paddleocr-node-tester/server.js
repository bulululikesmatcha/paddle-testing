import express from 'express';
import multer from 'multer';
import { PaddleOcrService } from 'ppu-paddle-ocr';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Multer handles incoming multipart form-data (image uploads)
const upload = multer({ dest: 'uploads/' });

// Initialize the OCR Service
let ocrService;
async function initOcr() {
    ocrService = new PaddleOcrService();
    await ocrService.initialize();
    console.log("✅ PaddleOCR models loaded and ready on backend.");
}
initOcr();

// Serve the frontend HTML
app.use(express.static(path.join(__dirname, 'public')));

// OCR API Endpoint
app.post('/api/recognize', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }
        
        console.log(`Processing image: ${req.file.path}`);
        
        // Pass the file path to PaddleOCR
        const result = await ocrService.recognize(req.file.path);
        
        // Clean up the temporary uploaded image
        fs.unlinkSync(req.file.path);
        
        res.json({ 
            success: true, 
            text: result.text 
        });
    } catch (error) {
        console.error("OCR Error:", error);
        // Ensure cleanup even if OCR fails
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});