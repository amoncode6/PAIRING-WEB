const express = require('express');
const fs = require('fs-extra');
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");

const MESSAGE = process.env.MESSAGE || `
🟢 *SESSION GENERATED SUCCESSFULLY* ✅

\`\`\`NEXA-XMD_your_base64_session_id_here...\`\`\`

🎉 *Welcome to NEXA-XMD WhatsApp Bot!*  
🔥 Fast. ⚡ Reliable. 💪 Powerful.

━━━━━━━━━━━━━━━━━━━━━━
🤖 Bot Name: *NEXA-XMD*
🧑‍💻 Created by: *Amon*
🔧 Engine: *NEXA-XMD Engine*
━━━━━━━━━━━━━━━━━━━━━━

✨ You're all set. Happy automating!
`;

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    DisconnectReason
} = require("@whiskeysockets/baileys");

// Clear previous sessions on start
if (fs.existsSync('./auth_info_baileys')) {
    fs.emptyDirSync(__dirname + '/auth_info_baileys');
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function SUHAIL() {
        const { state, saveCreds } = await useMultiFileAuthState(`./auth_info_baileys`);
        try {
            let Smd = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!Smd.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Smd.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Smd.ev.on('creds.update', saveCreds);
            Smd.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    try {
                        await delay(10000);
                        const credsFile = './auth_info_baileys/creds.json';
                        if (!fs.existsSync(credsFile)) return;

                        // Base64 encode session and add NEXA-XMD_ prefix
                        const rawCreds = fs.readFileSync(credsFile, 'utf-8');
                        const base64 = Buffer.from(rawCreds).toString('base64');
                        const sessionId = `NEXA-XMD_${base64}`;

                        // 1. Send session ID
                        let msg = await Smd.sendMessage(Smd.user.id, { text: sessionId });

                        // 2. Send logo image
                        await Smd.sendMessage(Smd.user.id, {
                            image: fs.readFileSync('./auth_info_baileys/nexa-logo.jpg'),
                            caption: "🔰 *WELCOME TO NEXA-XMD* 🔰\n
