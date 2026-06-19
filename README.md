# Trip Quotation Generator

A complete, production-ready Single Page Application (SPA) designed for travel agencies to dynamically compute road travel fares, generate professional PDF quotations on-the-fly, produce WhatsApp follow-up messages, and keep a persisted history log.

This project is separated into two clean, independent directories:
- **`frontend/`**: The React/Vite/Tailwind CSS client application.
- **`backend/`**: The Node/Express API and PDF generation server.

---

## Directory Structure

```
c:\Users\SATYA DEV\Desktop\Trip_Quotation_Generator\
├── README.md (Root documentation)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/ (React frontend source code)
└── backend/
    ├── package.json
    ├── server.js
    ├── testCalculations.js
    ├── data/
    │   └── quotations.json
    └── controllers, services, routes...
```

---

## Technical Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Icons.
- **Backend**: Node.js, Express.js.
- **Storage**: Local JSON file storage (`backend/data/quotations.json`).
- **PDF Engine**: `jsPDF` (leveraging identical vector layouts on both frontend and backend).

---

## Installation & Setup

Before running, you must install dependencies for both the frontend and backend.

### Step 1: Install Dependencies
Open your terminal in the root folder and run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Running in Development Mode
To develop locally, you will start both servers in separate terminal sessions or run them concurrently.

1. **Start Express Backend** (runs on port `5000`):
   ```bash
   cd backend
   npm start
   ```
2. **Start Vite Frontend** (runs on port `5173`):
   ```bash
   cd frontend
   npm run dev
   ```

Now open [http://localhost:5173](http://localhost:5173) in your browser. All API requests containing `/api/*` will be proxied automatically to the backend on `http://localhost:5000`.

### Step 3: Production Build & Deployment
To deploy to platforms like Render or Vercel:

1. **Compile React Bundle**:
   ```bash
   cd frontend
   npm run build
   ```
   This generates compiled production assets inside `./frontend/dist/`.
2. **Start Production Server**:
   ```bash
   cd backend
   npm start
   ```
   The backend Express server will serve these production assets statically from `../frontend/dist` and handle the APIs under a single port.

---

## API Documentation

### 1. `POST /api/quotation/generate`
Computes trip fares.
- **Request Body**:
  ```json
  {
    "distance": 250,
    "vehicleRate": 16,
    "driverCharge": 500,
    "tollCharge": 350,
    "parkingCharge": 150,
    "gstPercent": 5
  }
  ```
- **Response Content**:
  ```json
  {
    "calculations": {
      "baseFare": 4000,
      "subtotal": 5000,
      "gstAmount": 250,
      "totalPayable": 5250
    }
  }
  ```

### 2. `POST /api/quotation/save`
Stores quotation to JSON database.
- **Request Body**: Same schema containing `customer`, `trip`, `vehicle`, and `cost`.
- **Response Content**: The saved quotation object containing a unique identifier (e.g. `QTN-20260616-4321`) and timestamps.

### 3. `GET /api/quotation/history`
Retrieves history records sorted descending by creation date.

### 4. `GET /api/quotation/pdf/:id`
Streams PDF data directly with header headers set to `application/pdf`.

### 5. `GET /api/quotation/share/:id`
Generates a pre-formatted plain-text share snippet returned as a WhatsApp web encoded URI.
- **Response Content**:
  ```json
  {
    "whatsappUrl": "https://wa.me/?text=%E2%80%8B..."
  }
  ```
