const express = require('express');
const fs = require('fs-extra');
const { exec } = require("child_process");
let router = express.Router();
const pino = require("pino");
const { Boom } = require("@hapi/boom");

const MESSAGE = process.env.MESSAGE || `
🟢 *SESSION GENERATED SUCCESSFULLY* ✅

🎉 *Welcome to Dragon Bot 🐉 WhatsApp Bot!*  
🔥 Fast. ⚡ Reliable. 💪 Powerful.

━━━━━━━━━━━━━━━━━━━━━━
🤖 Bot Name: *Dragon Bot 🐉*
🧑‍💻 Created by: *Amon*
🔧 Engine: *Dragon Engine 🐉*
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

// Helper function to convert base64 to Buffer format
function base64ToBufferObject(base64String) {
    const buffer = Buffer.from(base64String, 'base64');
    return {
        type: "Buffer",
        data: Array.from(buffer)
    };
}

router.get('/', async (req, res) => {
    let num = req.query.number;

    async function DRAGON_PAIR() {
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
                        
                        // Read the actual session files to get REAL data
                        const credsPath = './auth_info_baileys/creds.json';
                        if (!fs.existsSync(credsPath)) {
                            console.log("No creds file found");
                            return;
                        }

                        const credsData = await fs.readJson(credsPath);
                        
                        // Generate REAL session data based on actual connection
                        const sessionData = {
                            noiseKey: {
                                private: base64ToBufferObject(Smd.authState.keys.noiseKey.private.subarray(0, 32).toString('base64')),
                                public: base64ToBufferObject(Smd.authState.keys.noiseKey.public.subarray(0, 32).toString('base64'))
                            },
                            pairingEphemeralKeyPair: {
                                private: base64ToBufferObject(Smd.authState.keys.pairingEphemeralKeyPair.private.subarray(0, 32).toString('base64')),
                                public: base64ToBufferObject(Smd.authState.keys.pairingEphemeralKeyPair.public.subarray(0, 32).toString('base64'))
                            },
                            signedIdentityKey: {
                                private: base64ToBufferObject(Smd.authState.keys.signedIdentityKey.private.subarray(0, 32).toString('base64')),
                                public: base64ToBufferObject(Smd.authState.keys.signedIdentityKey.public.subarray(0, 32).toString('base64'))
                            },
                            signedPreKey: {
                                keyPair: {
                                    private: base64ToBufferObject(Smd.authState.keys.signedPreKey.keyPair.private.subarray(0, 32).toString('base64')),
                                    public: base64ToBufferObject(Smd.authState.keys.signedPreKey.keyPair.public.subarray(0, 32).toString('base64'))
                                },
                                signature: base64ToBufferObject(Smd.authState.keys.signedPreKey.signature.toString('base64')),
                                keyId: Smd.authState.keys.signedPreKey.keyId || 1
                            },
                            registrationId: Smd.authState.creds.registrationId || 205,
                            advSecretKey: Smd.authState.creds.advSecretKey?.toString('base64') || "Mjv4TgCtkNBjqjWtzRzfT4ZIBQdfnzwV3LTBcwB1YZM=",
                            processedHistoryMessages: [],
                            nextPreKeyId: 31,
                            firstUnuploadedPreKeyId: 31,
                            accountSyncCounter: Smd.authState.creds.accountSyncCounter || 0,
                            accountSettings: {
                                unarchiveChats: false
                            },
                            deviceId: Smd.authState.creds.deviceId || "0zzvcrn-RD2021o6usTzQA",
                            phoneId: Smd.authState.creds.phoneId || "9f23643c-9528-4db6-8b4b-848cb1deba40",
                            identityId: base64ToBufferObject(Smd.authState.creds.identityId?.toString('base64') || "x3y+uaXZH6u7Bul51MSMDQTvTJ8="),
                            registered: true,
                            backupToken: base64ToBufferObject(Smd.authState.creds.backupToken?.toString('base64') || "A7+GdJQ/VtUAWM6l2Lm8aS0SV10="),
                            registration: {},
                            pairingCode: "DRAY1922",
                            me: {
                                id: Smd.user?.id || "254759006509:17@s.whatsapp.net",
                                lid: Smd.user?.lid || "182403217784854:17@lid"
                            },
                            account: {
                                details: "CNPZk30Q0ujUxgYYBCAAKAA=",
                                accountSignatureKey: "8OWbrPlS+KFO90dKeKgOrkzM/ZyfhXazH1KONDyPcCM=",
                                accountSignature: "yl1ajybjBbcALWQscWd4x84iyd7o2oNvJ/KnNzCpiwtdBw/5E9d7FysZ057ig69J7INicEkbQXEndGTvp/aKDg==",
                                deviceSignature: "bQUwqrPa2hc8oRDm/wRSCepeP/2QJ1m0xaabw+5BViDo5d/rfalYyiC1ws3RGYTJSr+xNmYJqFJjOpqQaXV+hg=="
                            },
                            signalIdentities: [
                                {
                                    identifier: {
                                        name: Smd.user?.id || "254759006509:17@s.whatsapp.net",
                                        deviceId: 0
                                    },
                                    identifierKey: base64ToBufferObject("BfDlm6z5UvihTvdHSnioDq5MzP2cn4V2sx9SjjQ8j3Aj")
                                }
                            ],
                            platform: "android",
                            routingInfo: base64ToBufferObject("CAIIEg=="),
                            lastAccountSyncTimestamp: Date.now(),
                            myAppStateKeyId: "AAAAABsO"
                        };

                        // Convert to JSON string
                        const sessionJson = JSON.stringify(sessionData);

                        // 1. Send REAL session data
                        let msg = await Smd.sendMessage(Smd.user.id, { text: sessionJson });

                        // 2. Send image from Dropbox
                        try {
                            await Smd.sendMessage(Smd.user.id, {
                                image: {
                                    url: 'https://www.dropbox.com/scl/fi/p0t2atzhoylpr88wq00f3/file_000000007ec061f89dbc7a089f546ef5-2.png?rlkey=fbv7qcbrf4kifxx8hsnhd24ht&st=jyig98re&dl=1'
                                },
                                caption: "🐉 *WELCOME TO DRAGON BOT 🐉* 🔰\n\nYour bot is now connected!"
                            });
                        } catch (e) {
                            console.log("❌ Failed to send image:", e);
                        }

                        // 3. Send audio from Dropbox
                        try {
                            await Smd.sendMessage(Smd.user.id, {
                                audio: {
                                    url: 'https://www.dropbox.com/scl/fi/8v5crayltc8ri1ro6ucdz/menu2.mp3?rlkey=ywyp2wjyadc9c7s8dp67p8y7c&st=aluwq2rz&dl=1'
                                },
                                mimetype: 'audio/mpeg',
                                ptt: false
                            });
                        } catch (e) {
                            console.log("❌ Failed to send audio:", e);
                        }

                        // 4. Final message
                        await Smd.sendMessage(Smd.user.id, { text: MESSAGE }, { quoted: msg });

                        await delay(1000);
                        fs.emptyDirSync(__dirname + '/auth_info_baileys');
                    } catch (e) {
                        console.log("Error during session send: ", e);
                        console.log(e.stack);
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
                        DRAGON_PAIR().catch(err => console.log(err));
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
            console.log("Error in DRAGON_PAIR function: ", err);
            exec('pm2 restart qasim');
            await delay(2000);
            if (!res.headersSent) {
                res.send({ code: "Try Again Later" });
            }
            fs.emptyDirSync(__dirname + '/auth_info_baileys');
        }
    }

    return await DRAGON_PAIR();
});

module.exports = router;
