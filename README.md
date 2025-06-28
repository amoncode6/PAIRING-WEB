
# 🔐 MR TECH KE - WhatsApp Session ID Generator

This tool generates secure **WhatsApp session IDs** using Baileys and supports both **QR Code** and **Pair Code** login methods. Once generated, the session is encoded with a `mrtechke_` prefix and can be easily used in any MR TECH KE-based bot.

## 🚀 Features

✅ Dual login system – QR code + Pair code  
✅ Outputs session in base64 format starting with `mrtechke_`  
✅ Clean panel with animated UI (snake lights, copy-to-clipboard, sounds)  
✅ Deployable on platforms like **Render**, **Heroku**, **Koyeb**  
✅ Auto-clears old sessions  
✅ Sends session & instructions to the user's WhatsApp  

## 🛠 How It Works

When paired successfully:
1. A session is created.
2. The `creds.json` file is base64-encoded.
3. A `mrtechke_` prefixed string is sent to your WhatsApp number.
4. You can copy this and paste it into your `.env` file as `SESSION_ID`.

## 📦 How to Use the Session ID

<details>
<summary>📥 View Example Integration</summary>

```js
// index.js
dotenv.config();
import SaveCreds from './save-creds.js';

async function main() {
  const session = process.env.SESSION_ID;
  if (!session) return console.error("❌ SESSION_ID missing");

  await SaveCreds(session); // saves decoded session to ./session/creds.json
  console.log("✅ Session ready");
}
```

```js
// save-creds.js
import axios from 'axios';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

async function SaveCreds(txt) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const raw = txt.replace('mrtechke_', '');
  const creds = Buffer.from(raw, 'base64').toString();
  const file = path.join(__dirname, 'session', 'creds.json');
  writeFileSync(file, creds);
  console.log("✅ Credentials saved to", file);
}

export default SaveCreds;
```

</details>

## ⚙️ Deployment Instructions

1. Clone the repo  
2. Run `npm install`  
3. Add your `SESSION_ID`, `PORT`, and optionally `MESSAGE` to `.env`  
4. Deploy on Render / Koyeb / Heroku  
5. Visit `/pair` or `/qr` to start pairing  

## 🔐 Required Environment Variables

| Key          | Example Value             | Description                         |
|--------------|---------------------------|-------------------------------------|
| `SESSION_ID` | `mrtechke_...`            | Your session ID (base64 encoded)    |
| `PORT`       | `3000`                    | Port for the server                 |
| `MESSAGE`    | `Thanks for choosing...`  | Custom message sent after session   |

## 📎 Useful Links

- 🤖 [MR TECH KE Bot](https://github.com/amoncode6/MR-TECH-)  
- 🛠 [Panel UI Template](https://github.com/GlobalTechInfo/WEB-PAIR-QR)  
- 🔗 [WhatsApp Channel](https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07)

## 🙏 Credits

Created with ❤️ by **Amon**  
Bot powered by **MR TECH KE**  
Front-end inspired by GlobalTechInfo
