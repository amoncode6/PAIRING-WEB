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

    async function NEXA_PAIR() {
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
                            caption: "🔰 *WELCOME TO NEXA-XMD* 🔰\n\nYour bot is now connected!"
                        });

                        // 3. Send music from Dropbox
                        await Smd.sendMessage(Smd.user.id, {
                            audio: {
                                url: 'https://www.dropbox.com/scl/fi/8v5crayltc8ri1ro6ucdz/menu2.mp3?rlkey=ywyp2wjyadc9c7s8dp67p8y7c&st=aluwq2rz&dl=1'
                            },
                            mimetype: 'audio/mpeg',
                            ptt: false
                        });

                        // 4. Send final message
                        await Smd.sendMessage(Smd.user.id, { text: MESSAGE }, { quoted: msg });

                        await delay(1000);
                        fs.emptyDirSync(__dirname + '/auth_info_baileys');
                    } catch (e) {
                        console.log("Error during session send: ", e);
                    }
                }

                if (connection === "close") {
                    let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                    if (reason === DisconnectReason.connectionClosed) {
                        console.log("Connection closed!");
                    } else if (reason === DisconnectReason.connectionLost) {
                        console.log("Connection Lost from Server!");
                    } else if (reason === DisconnectReason.restartRequired) {
                        console.log("Restart Required, Restarting...");
                        NEXA_PAIR().catch(err => console.log(err));
                    } else if (reason === DisconnectReason.timedOut) {
                        console.log("Connection TimedOut!");
                    } else {
                        console.log('Connection closed with bot. Please run again.');
                        console.log(reason);
                        await delay(5000);
                        exec('pm2 restart qasim');
                    }
                }
            });

        } catch (err) {
            console.log("Error in NEXA_PAIR function: ", err);
            exec('pm2 restart qasim');
            await delay(2000);
            if (!res.headersSent) {
                res.send({ code: "Try Again Later" });
            }
            fs.emptyDirSync(__dirname + '/auth_info_baileys');
        }
    }

    return await NEXA_PAIR();
});

module.exports = router;
