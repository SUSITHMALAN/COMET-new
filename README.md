# COMET | Modern eCommerce for Clothing

COMET is a premium, full-stack eCommerce web application designed for a modern clothing brand. It features a stunning, high-performance storefront and a comprehensive admin dashboard for management.

## 🚀 Live Demo
- **Frontend**: [https://comet-new-kappa.vercel.app](https://comet-new-kappa.vercel.app)
- **Backend API**: [https://comet-new-vgri.onrender.com/api/health](https://comet-new-vgri.onrender.com/api/health)

---

## ✨ Features

### Storefront
- **Premium Design**: Dark-mode aesthetic with smooth animations and responsive layouts.
- **Product Discovery**: Browse by categories, new arrivals, and featured collections.
- **Dynamic Cart**: Real-time cart management using state management (Zustand).
- **Direct Ordering**: Integrated "Order via WhatsApp" for quick customer conversion.
- **Product Details**: Multi-image support, size/color selection, and stock status.

### Admin Dashboard
- **Analytics**: Overview of total users and store statistics.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) with image uploads.
- **Category Customization**: Manage product categories and slugs dynamically.
- **Order Tracking**: Monitor customer orders and status updates.
- **User Management**: View and manage customer profiles.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt
- **Deployment**: Render

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase Account

### 1. Clone the repository
```bash
git clone https://github.com/SUSITHMALAN/COMET-new.git
cd COMET-new
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` folder:
```env
DATABASE_URL=your_supabase_postgresql_url
SECRET_KEY=your_random_secret_key
ADMIN_EMAIL=admin@comet.com
ADMIN_PASSWORD=your_admin_password
```
Run the server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Run the development server:
```bash
npm run dev
```

---

## 🌐 Deployment Configuration

### Render (Backend)
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: Ensure `DATABASE_URL`, `SECRET_KEY`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in Render dashboard.

### Vercel (Frontend)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact
Project Link: [https://github.com/SUSITHMALAN/COMET-new](https://github.com/SUSITHMALAN/COMET-new)
