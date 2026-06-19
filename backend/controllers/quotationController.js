import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateQuotation } from '../services/quotationCalculationService.js';
import { generatePdf } from '../services/pdfService.js';
import { generateWhatsAppUrl } from '../services/shareService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/quotations.json');

/**
 * Read the database array
 */
const readDatabase = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

/**
 * Write to the database array
 */
const writeDatabase = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

/**
 * Action: POST /api/quotation/generate
 */
export const generate = async (req, res) => {
  try {
    const { distance, vehicleRate, driverCharge, tollCharge, parkingCharge, gstPercent } = req.body;
    
    const calculations = calculateQuotation(
      distance,
      vehicleRate,
      driverCharge,
      tollCharge,
      parkingCharge,
      gstPercent
    );

    return res.json({ calculations });
  } catch (error) {
    console.error('Error generating calculations:', error);
    return res.status(500).json({ error: 'Failed to compute quotation' });
  }
};

/**
 * Action: POST /api/quotation/save
 */
export const save = async (req, res) => {
  try {
    const { customer, trip, vehicle, cost } = req.body;

    if (!customer?.name || !customer?.mobile) {
      return res.status(400).json({ error: 'Customer name and mobile number are required.' });
    }
    if (parseFloat(trip?.distance) <= 0 || parseFloat(trip?.duration) <= 0) {
      return res.status(400).json({ error: 'Distance and duration must be greater than 0.' });
    }

    // Recompute calculations to ensure data integrity
    const calculations = calculateQuotation(
      trip.distance,
      vehicle.rate,
      cost.driverCharge,
      cost.tollCharge,
      cost.parkingCharge,
      cost.gstPercent
    );

    const db = await readDatabase();
    
    // Generate a beautiful Quotation ID: QTN-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.getFullYear().toString() + 
                    (today.getMonth() + 1).toString().padStart(2, '0') + 
                    today.getDate().toString().padStart(2, '0');
    const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
    const quoteId = `QTN-${dateStr}-${randomStr}`;

    const newQuotation = {
      id: quoteId,
      customer,
      trip,
      vehicle,
      cost,
      calculations,
      createdAt: new Date().toISOString()
    };

    db.push(newQuotation);
    await writeDatabase(db);

    return res.status(201).json(newQuotation);
  } catch (error) {
    console.error('Error saving quotation:', error);
    return res.status(500).json({ error: 'Failed to save quotation' });
  }
};

/**
 * Action: GET /api/quotation/history
 */
export const history = async (req, res) => {
  try {
    const db = await readDatabase();
    // Sort by createdAt descending
    const sorted = db.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(sorted);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({ error: 'Failed to retrieve quotation history' });
  }
};

/**
 * Action: GET /api/quotation/pdf/:id
 */
export const pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDatabase();
    const quotation = db.find(q => q.id === id);

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const pdfBuffer = generatePdf(quotation);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${quotation.id}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ error: 'Failed to generate PDF' });
  }
};

/**
 * Action: GET /api/quotation/share/:id
 */
export const share = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDatabase();
    const quotation = db.find(q => q.id === id);

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const whatsappUrl = generateWhatsAppUrl(quotation, req.query.mobile);
    return res.json({ whatsappUrl });
  } catch (error) {
    console.error('Error sharing quotation:', error);
    return res.status(500).json({ error: 'Failed to create share link' });
  }
};
