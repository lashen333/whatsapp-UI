import { env } from "@/lib/env";

export async function uploadMediaToWhatsApp(file: File) {
  const formData = new FormData();
  formData.append("messaging_product", "whatsapp");
  formData.append("file", file, file.name);

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${env.WA_PHONE_NUMBER_ID}/media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WA_CLOUD_API_TOKEN}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Media upload failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  return data;
}