const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Supabase PostgreSQL
const DATABASE_URL = process.env.DATABASE_URL || "";

// Supabase Auth  ← ADD THESE TWO
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
if (!process.env.JWT_SECRET && NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be set in production!");
}

module.exports = {
  PORT, NODE_ENV, CLIENT_URL,
  JWT_SECRET, JWT_EXPIRES_IN,
  DATABASE_URL,
  SUPABASE_URL,               // ← ADD
  SUPABASE_SERVICE_ROLE_KEY,  // ← ADD
};