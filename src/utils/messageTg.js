import { createImage } from "./image.js";
import { sendPhoto } from "./sendToTg.js";

export async function messageTg(title, text) {
  try {
    console.log("Generating image...");
    const imageBuffer = await createImage(title, text);

    console.log("Sending to Telegram...");
    await sendPhoto(
      imageBuffer,
      `<b>${title}</b>` // optional caption under image
    );

    console.log("Telegram image sent successfully");
  } catch (err) {
    console.error("Telegram image send failed:", err);
  }
}