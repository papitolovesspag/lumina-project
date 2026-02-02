# Lumina | Full-Stack Productivity Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-live-success.svg)
![Stack](https://img.shields.io/badge/stack-PERN-orange.svg)

> **A robust note-taking and productivity application built to demonstrate scalable CRUD operations, secure authentication, and persistent data management using the PERN stack.**

## 🚀 Overview

Lumina is more than just a notes app; it is a study in full-stack architecture. The goal was to build a system that handles **real-time data interactions** while maintaining a clean, responsive user interface.

Unlike static frontend applications, Lumina manages state server-side using **PostgreSQL**, ensuring that user data is persistent, secure, and accessible across devices. It implements **Optimistic UI updates** to make the interface feel instant, even while the database is updating in the background.

## ✨ Key Features

* **🔐 Secure Authentication:**
    * Custom login/registration system.
    * Sessions managed securely to protect user access.
* **⚡ Full CRUD Operations:**
    * **Create:** Instant note generation with dynamic ID assignment.
    * **Read:** Fetches data via REST API endpoints with optimized SQL queries.
    * **Update:** Edit existing notes with real-time feedback.
    * **Delete:** Secure removal of records from the database.
* **💾 Data Persistence:**
    * All data is stored in a **PostgreSQL** relational database, not local storage.
    * Uses `pg.Pool` for efficient database connection management.
* **📱 Responsive Design:**
    * Mobile-first architecture ensuring usability on all devices.

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js | Functional components, Hooks (useState, useEffect) for state management. |
| **Backend** | Node.js & Express | RESTful API architecture handling client requests. |
| **Database** | PostgreSQL | Relational database for structured data storage. |
| **Styling** | CSS3 | Custom flexible grid layouts and responsive media queries. |

## ⚙️ Architecture & Decisions

### Why PostgreSQL?
I chose a relational database over MongoDB to enforce strict schema validation for user profiles and notes. This ensures data integrity and allows for complex relationships (e.g., User -> hasMany -> Notes) as the application scales.

### Optimistic UI
To improve the perceived performance, the frontend updates the UI immediately upon user action (like adding a note), while the API call processes in the background. If the server returns an error, the UI rolls back to the previous state.

## 💻 Getting Started Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/lumina-project.git](https://github.com/your-username/lumina-project.git)
    cd lumina-project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    * Create a local PostgreSQL database named `lumina_db`.
    * Run the SQL scripts provided in `/database.sql` to create the `users` and `notes` tables.

4.  **Configure Environment**
    * Create a `.env` file in the root directory.
    * Add your database credentials:
        ```env
        DB_USER=postgres
        DB_PASSWORD=yourpassword
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=lumina_db
        ```

5.  **Run the App**
    ```bash
    npm run dev
    ```

## 🔮 Future Improvements

* **Dark Mode:** Implementing context API for global theme management.
* **Tagging System:** Adding a many-to-many relationship for categorizing notes.
* **Search Functionality:** Implementing SQL `ILIKE` queries for real-time text search.

---
*Built with ❤️ by Kosi*
