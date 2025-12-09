export default async function connectDB() {
  try {
    console.log("[DB] Skipped (Safe Mode ON)");
  } catch (err) {
    console.log("[DB] Skipped");
  }
}
