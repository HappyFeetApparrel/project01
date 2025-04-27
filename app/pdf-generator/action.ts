"use server";

export async function getLogoBytes(
  relativeLogoPath: string
): Promise<Uint8Array | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${relativeLogoPath}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch logo image");
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error("Failed to fetch logo image:", error);
    return null;
  }
}
