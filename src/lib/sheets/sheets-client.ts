// src\lib\sheets\sheets-client.ts
import { google } from "googleapis";
import { env } from "@/lib/env";

const privateKey = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

export function createSheetsClient() {
  const auth = new google.auth.JWT({
    email: env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({
    version: "v4",
    auth,
  });
}