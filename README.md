# FarmerInventory — Direct Farm Marketplace & Inventory System

A modern, animated full-stack application connecting farmers and customers, replacing the old Java Swing prototype.

---

## ⚡ How to Start the Project Tomorrow

### Option A: 1-Click Launch (Easiest)
Simply double-click:
`d:\Hackathon\start_project.bat`
This automatically starts both the backend and frontend in separate command windows and opens your web browser to `http://localhost:5173`!

---

### Option B: From the Terminal

Open **two** terminal windows (or PowerShell tabs):

#### Terminal 1 — Backend (Port 5000):
```powershell
cd d:\Hackathon\server
npm start
```
*(Or use `npm run dev` if you want hot-reloading while editing backend files)*

#### Terminal 2 — Frontend (Port 5173):
```powershell
cd d:\Hackathon\client
npm run dev
```

Then visit: **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Login Accounts

- **Farmer Portal**: Username: `gurpreet_punjab` / Password: `password123`
- **Customer Portal**: Username: `rahul_v` / Password: `password123`
*(Or click the **"Autofill Demo"** button on the login screen)*

---

## 🛠️ How to Make Changes

The project has **Hot Module Replacement (HMR)** enabled on the frontend. When you edit and save any file, the browser updates **instantly without needing a manual refresh**.

### 1. Changing the Frontend (UI, Colors, Text)
All frontend files are in `d:\Hackathon\client\src\`:
- **Colors & Styles**: Edit `tailwind.config.js` or `src/index.css`.
- **Text & Languages**: Edit `src/i18n/translations.ts` to add or modify English, Hindi, or Punjabi translations.
- **Farmer Dashboard & Stock**: Edit `src/pages/farmer/FarmerInventoryPage.tsx`.
- **Kanban Board**: Edit `src/components/KanbanBoard.tsx` or `src/pages/farmer/FarmerOrdersPage.tsx`.
- **Marketplace & Products**: Edit `src/pages/customer/CustomerMarketplacePage.tsx`.
- **Customer Checkout & Payments**: Edit `src/components/OrderModal.tsx`.
- **Live Order Tracking**: Edit `src/components/LiveTrackingModal.tsx`.
- **AI Chatbot (Kisan Mitra)**: Edit `src/components/AIChatbotModal.tsx`.
- **Govt Mandi Comparison**: Edit `src/components/MandiPriceModal.tsx`.

### 2. Changing the Backend (APIs, Logic, Database)
All backend files are in `d:\Hackathon\server\src\`:
- **Order Acceptance / Transactions**: Edit `src/controllers/orderController.ts`.
- **Products & Low-Stock Alerts**: Edit `src/controllers/productController.ts`.
- **Chat Logic**: Edit `src/controllers/chatController.ts`.
- **AI Chatbot Responses**: Edit `src/controllers/aiController.ts`.
- **Mandi Benchmark Rates**: Edit `src/controllers/toolController.ts`.

After changing backend code:
```powershell
cd d:\Hackathon\server
npm run build
npm start
```
*(Or keep `npm run dev` running in your backend terminal to auto-restart on changes)*

### 3. Resetting / Re-seeding Demo Data
If you ever want to reset the database back to clean, fresh demo data:
```powershell
cd d:\Hackathon\server
npm run seed
```
