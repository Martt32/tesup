// import axios from "axios";
// import FormData from "form-data";

// const botToken = "YOUR_BOT_TOKEN";
// const chatId = "YOUR_CHAT_ID";

// export async function sendPhoto(buffer, caption = "") {
//   const form = new FormData();
//   form.append("chat_id", chatId);
//   form.append("photo", buffer, { filename: "message.png" });

//   if (caption) {
//     form.append("caption", caption);
//     form.append("parse_mode", "HTML");
//   }

//   await axios.post(
//     `https://api.telegram.org/bot${botToken}/sendPhoto`,
//     form,
//     { headers: form.getHeaders() }
//   );
// }

import axios from 'axios'

const botToken = "8799698564:AAFYYGf0vKSz6EcgE4m_tLqRjeTfJ9zZhLI";
  const chatId = "6363774415";

// const botToken = '7772595881:AAENGMyOAAUtkhcKbvzkbVCamBWQcY_vtGg'
//     const chatId = '7118611217'
 export async function messageTg( title, text,) {
    console.log("started");
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const res = await axios.post(url, {
        chat_id: chatId,
        text: `title: ${title}`
      });
      const txt = await axios.post(url, {
        chat_id: chatId,
        text: text
      });
      console.log("Message Sent successfully:", res.data, txt.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }