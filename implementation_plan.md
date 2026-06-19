# Implementation Plan - Trip Quotation Generator

This plan outlines the design, architecture, and implementation steps for building the **Trip Quotation Generator** web application. It is a single-page application (SPA) with a Node.js/Express backend and a React/Vite/Tailwind CSS frontend, using `quotations.json` for persistence and `jsPDF` for PDF generation.

---

## User Review Required

> [!IMPORTANT]
> - **PDF Generation**: We will use `jsPDF` on both the client side and the backend. On the backend, we will use `jspdf` (via Node.js) to generate the PDF buffer dynamically for `GET /api/quotation/pdf/:id`.
> - **Port Configuration**: The backend will run on port `5000` (or `PORT` environment variable), and the frontend Vite dev server will run on port `5173`. We will configure Vite proxy to direct `/api` requests to the Express backend.
> - **Project Directory**: The root directory is `c:\Users\SATYA DEV\Desktop\Trip_Quotation_Generator`. We will initialize Vite in the current directory and place the Express backend inside a `backend` subfolder to keep it clean and deployment-ready.

---

## Proposed Changes

### Project Structure

We will arrange the project as follows:
- **Frontend** in the root directory (React + Vite + Tailwind CSS).
- **Backend** in the `./backend/` directory (Node.js + Express.js).

```
c:\Users\SATYA DEV\Desktop\Trip_Quotation_Generator\
├── package.json (Frontend and overall tooling)
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── CustomerInfo.jsx
│   │   ├── TripInfo.jsx
│   │   ├── VehicleSelector.jsx
│   │   ├── CostComponents.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── QuotePreview.jsx
│   │   ├── ActionButtons.jsx
│   │   └── QuoteHistory.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── utils/
│   │   └── calculator.js
│   └── services/
│       └── quotationApi.js
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── data/
│   │   └── quotations.json
│   ├── controllers/
│   │   └── quotationController.js
│   ├── services/
│   │   ├── quotationCalculationService.js
│   │   ├── pdfService.js
│   │   └── shareService.js
│   └── routes/
│       └── quotationRoutes.js
```

---

### Backend Components

#### [NEW] [server.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/server.js)
Express server entry point. Configures middleware (CORS, body-parser, static files) and routes.

#### [NEW] [quotations.json](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/data/quotations.json)
Simple JSON array file containing all saved quotations.

#### [NEW] [quotationCalculationService.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/services/quotationCalculationService.js)
Contains the exact formulas:
- `baseFare = distance * vehicleRate`
- `subtotal = baseFare + driverCharge + tollCharge + parkingCharge`
- `gstAmount = subtotal * (gstPercentage / 100)`
- `totalPayable = subtotal + gstAmount`

#### [NEW] [pdfService.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/services/pdfService.js)
Generates a highly professional PDF document using `jspdf` with layout grids, headers, vehicle details, cost breakdown table, terms and conditions, and footer.

#### [NEW] [shareService.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/services/shareService.js)
Formats the trip quotation details into a user-friendly plain-text template and returns a URL encoded string starting with `https://wa.me/?text=`.

#### [NEW] [quotationController.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/controllers/quotationController.js)
Handles API requests:
- `generate`: Calls calculator and returns breakdown.
- `save`: Computes calculations, assigns quotation ID (e.g. `QTN-YYYYMMDD-XXXX`), appends to `quotations.json`, and returns saved entity.
- `history`: Reads and returns array sorted by latest.
- `pdf`: Resolves quotation by ID, uses `pdfService` to generate PDF, and streams the binary data to the response.
- `share`: Returns the WhatsApp link for a specific quotation.

#### [NEW] [quotationRoutes.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/backend/routes/quotationRoutes.js)
Maps endpoints to controller actions.

---

### Frontend Components

#### [MODIFY] [tailwind.config.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/tailwind.config.js)
Configure the primary, secondary, success, background, and text colors:
- Primary: `#2563EB` (Blue)
- Secondary: `#4F46E5` (Indigo)
- Success: `#10B981` (Emerald)
- Background: `#F8FAFC` (Slate)
- Text: `#0F172A` (Dark Slate)

#### [NEW] [calculator.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/utils/calculator.js)
Client-side calculation logic matches backend, supporting real-time preview updates before saving.

#### [NEW] [quotationApi.js](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/services/quotationApi.js)
Axios API service methods for interacting with backend routes.

#### [NEW] [CustomerInfo.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/CustomerInfo.jsx)
Card with fields for Customer Name, Mobile, Email, and Company Name. Handles change events and validation states.

#### [NEW] [TripInfo.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/TripInfo.jsx)
Card with input fields for Pickup, Drop, Date, Return Date, Distance (KM), and Rental Duration (Days).

#### [NEW] [VehicleSelector.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/VehicleSelector.jsx)
A grid of beautiful cards showcasing vehicle types: Sedan (₹12/km), SUV (₹16/km), Innova Crysta (₹20/km), Tempo Traveller (₹28/km), Luxury Car (₹55/km), Mini Bus (₹42/km). Highlights active card.

#### [NEW] [CostComponents.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/CostComponents.jsx)
Fields for Vehicle Rate (read-only or overrideable), Driver Charge, Toll Charge, Parking Charge, and GST %.

#### [NEW] [AIAssistant.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/AIAssistant.jsx)
Section containing rule-based AI action buttons:
1. **Recommend Vehicle**: Selects Sedan, SUV, or Innova/Traveller based on distance.
2. **Generate Quote Notes**: Generates customer-facing remarks like "Driver charges inclusive of night stay. Tolls will be charged as per actuals."
3. **Generate Follow-up Message**: Formats a message like "Hi [Customer], following up on our quotation for your trip from [Source] to [Dest]..."
4. **Generate Trip Summary**: Produces a neat, friendly overview of the travel itinerary.

#### [NEW] [QuotePreview.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/QuotePreview.jsx)
Stunning live receipt showing real-time updates of customer info, trip parameters, and calculated fare breakdown.

#### [NEW] [ActionButtons.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/ActionButtons.jsx)
Buttons to Generate Quotation, Save, Download PDF, and Share via WhatsApp.

#### [NEW] [QuoteHistory.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/components/QuoteHistory.jsx)
Bottom table displaying saved quotes from history and triggering PDF download.

#### [NEW] [Home.jsx](file:///c:/Users/SATYA%20DEV/Desktop/Trip_Quotation_Generator/src/pages/Home.jsx)
Main dashboard container orchestrating layout state (combining forms, live preview, and history table).

---

## Verification Plan

### Automated Tests
We will verify API health and correct calculations by writing a simple script that tests backend computation:
- `node backend/testCalculations.js`

### Manual Verification
1. Run backend server: `node backend/server.js` or `npm run backend`
2. Run frontend Vite server: `npm run dev`
3. Access UI in the browser and perform tests:
   - Verify fields auto-compute costs immediately on input.
   - Verify vehicle selector updates base fare calculations.
   - Verify AI assistant recommendations change based on distance.
   - Save a quotation, check if it populates the history table immediately.
   - Click "Download PDF" and verify structure.
   - Click "Share on WhatsApp" and verify correct text payload in URL.
   - Verify mobile/tablet layout scaling.
