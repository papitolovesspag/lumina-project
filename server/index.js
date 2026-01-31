import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// --- MIDDLEWARE ---
app.use(cors()); // Allows React (Port 5173) to talk to this Server (Port 3000)
app.use(express.json()); // Allows us to read JSON data sent from React

// --- DATABASE CONNECTION (Render & Local Compatible) ---
let db;
if (process.env.DATABASE_URL) {
  // PRODUCTION (Render)
  db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render Postgres
  });
} else {
  // LOCAL (Your Laptop)
  db = new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
}
// --- AUTO-FIX DATABASE 
const initDb = async () => {
  try {
    // 1. Create Users Table if missing
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      );
    `);
    
    // 2. Create Notes Table if missing
    await db.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100),
        content TEXT,
        user_id INTEGER REFERENCES users(id)
      );
    `);
    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
};

// Run the fix immediately
initDb();
// ------------------------------------------

// --- AUTHENTICATION MIDDLEWARE ---
// This acts as a "Bouncer". It checks if the user has a valid Token (JWT).
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: "Failed to authenticate token" });
    req.userId = decoded.id; // Save the User ID for the next step
    next();
  });
};

// --- ROUTES ---

// 1. REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      // Create a "Digital Key" (Token) for the user
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      res.json({ auth: true, token: token, email: user.email });
    } else {
      res.status(401).json({ auth: false, token: null });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3. GET NOTES (Protected: Only gets YOUR notes)
app.get("/notes", verifyToken, async (req, res) => {
  try {
    // We use req.userId (from the token) so you only see YOUR notes
    const result = await db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC", [req.userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching notes" });
  }
});

// 4. ADD NOTE (Protected)
app.post("/notes", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNote = await db.query(
      "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, req.userId]
    );
    res.json(newNote.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding note" });
  }
});

// 5. DELETE NOTE (Protected)
app.delete("/notes/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    // We strictly check 'user_id' so you can't delete someone else's note
    await db.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [id, req.userId]);
    res.json({ status: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting note" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});