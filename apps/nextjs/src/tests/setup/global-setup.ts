export default async function globalSetup() {
  // Set environment variables for tests
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000/api";
  process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
}
