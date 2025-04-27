"use server";

import fs from "fs/promises";
import path from "path";

export async function getLogoBytes(
  relativeLogoPath: string
): Promise<Uint8Array | null> {
  try {
    const logoPath = path.join(process.cwd(), "public", relativeLogoPath);
    console.log("logoPath");
    console.log(logoPath);
    console.log("logoPath");
    const imageBytes = await fs.readFile(logoPath);
    return imageBytes;
  } catch (error) {
    console.error("Failed to read logo image:", error);
    return null;
  }
}
