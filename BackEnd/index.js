require("dotenv").config();

const express= require("express");
const cors= require("cors");
const path = require("path");
const connectDB= require("./Config/db");
const authRoutes= require("./Routes/authRoutes");
const incomeRoutes= require("./Routes/incomeRoutes")
const expenseRoutes= require("./Routes/expenseRoutes")
const dashboardRoutes= require("./Routes/dashboardRoutes")
const predictionRoutes = require("./Routes/predictionRoutes")
const accountsRoutes = require("./Routes/accountsRoutes")

const app= express();

// CORS configuration with support for multiple origins via env and *.vercel.app
const rawOrigins = process.env.CLIENT_URLS || process.env.CLIENT_URL || "*";
const allowedOrigins = rawOrigins.split(",").map((o) => o.trim()).filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true; // non-browser requests
  if (allowedOrigins.includes("*")) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow any Vercel preview/prod domains by default
  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith(".vercel.app")) return true;
  } catch (_) {}
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

connectDB();
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/income',incomeRoutes);
app.use('/api/v1/expense',expenseRoutes);
app.use('/api/v1/dashboard',dashboardRoutes);
app.use('/api/v1/predictions', predictionRoutes);
app.use('/api/v1/accounts', accountsRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT= process.env.PORT|| 5000;
app.listen(PORT, ()=> {console.log(`Sever running on ${PORT}`)})
