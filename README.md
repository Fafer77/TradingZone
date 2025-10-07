# TradeCraft - Trading Analytics Platform
---

## About The Project

TradeCraft is a journaling and analytics tool which goal is to help traders become and stay consistent. Monitor your progress using popular and proven concepts - Daily Report Card, Trade Samples. Build your own dashboard, mark your market drivers,
reminders and which instruments are bullish or bearish. Create your own playbook and entry criteria in order to build better discipline.

---

## ✨ Features & Screenshots

The application is composed of several key modules, providing an ecosystem for performance tracking.

| Dashboard | Playbook View | Daily Report Card |
| :---: | :---: | :---: |
| ![Dashboard View](./ss/dashboard.png) | ![Playbook View](./ss/playbook.png) | ![DRC View](./ss/DailyReportCard.png) |
| **Trade Samples List** | **Playbook Detail** | **DRC Detail** |
| ![Trade Samples List](./ss/tradeSample.png) | ![Playbook Detail View](./ss/playbook_example.png) | ![DRC Detail View](./ss/DRCExample.png) |

- **🔐 Secure Authentication**: Full user registration and login system using JWT for secure, stateless sessions.
- **📊 Interactive Dashboard**: A central hub featuring dynamic widgets for `Market Drivers` (bubble visualization), `Market Bias` (interactive toggles), and psychological `Reminders`.
- **📚 Playbook Management**: Full CRUD functionality for creating, editing, and deleting detailed trading strategies with specific criteria and checklists.
- **📈 Daily Report Cards (DRC)**: A daily journaling system to log goals, PNL, self-graded performance, and detailed session analysis in an interactive table.
- **🔬 Trade Samples & Logging**: Functionality to create focused 20-trade samples and log individual trades against them, with automatic PNL aggregation for each sample.
- **🧠 Statistical Analysis**: A separate database for logging all trades to calculate the **Expected Value (EV)** of each strategy, providing real-time statistical feedback via the API.
- ** responsive Design**: A clean, modern UI with a collapsible sidebar that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Tech Stack

This project is built with a modern, full-stack architecture using industry-standard tools.

| Category      | Technology                                                                                                                                                                                                                                                                                          |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **shadcn/ui**, **React Router**, **Axios**, **Framer Motion** |
| **Backend** | **Python**, **Django**, **Django REST Framework (DRF)**, **Simple JWT** |
| **Database** | **PostgreSQL (Neon)** |

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- Python 3.10+
- Node.js & npm
- PostgreSQL database - neontech

### Backend Setup

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```sh
    python -m venv venv
    # On Windows: venv\Scripts\activate
    # On macOS/Linux: source venv/bin/activate
    ```
3.  Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend` directory and add your database connection string and secret key:
    ```env
    DATABASE_URL="YOUR_NEON_POSTGRESQL_URL"
    SECRET_KEY="YOUR_DJANGO_SECRET_KEY"
    ```
5.  Run the database migrations:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
    ```
6.  Create a superuser to access the admin panel:
    ```sh
    python manage.py createsuperuser
    ```
7.  Start the backend server:
    ```sh
    python manage.py runserver
    ```
    The backend will be running on `http://127.0.0.1:8000`.

### Frontend Setup

1.  Navigate to the `frontend` directory in a new terminal:
    ```sh
    cd frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` directory and point it to your local backend server:
    ```env
    VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
    ```
4.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
