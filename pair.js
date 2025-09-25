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

                        // Exact session structure as requested
                        const sessionData = {
                            "noiseKey": {
                                "private": {
                                    "type": "Buffer",
                                    "data": "oKVkFg/R15/POROSLiH4RvHSH8z79P+e6E1t19g+j38="
                                },
                                "public": {
                                    "type": "Buffer",
                                    "data": "o3EyQYMHlcOpIEsw6Ofi/JmS2QIZaPV105qF3aBgSig="
                                }
                            },
                            "pairingEphemeralKeyPair": {
                                "private": {
                                    "type": "Buffer",
                                    "data": "kBBTctOw9N+D/shBIdI/HcXhyQ/ZfhRhhhuwMUmlnmA="
                                },
                                "public": {
                                    "type": "Buffer",
                                    "data": "MzOiidZYIvZ0pfePnhQuRIcfgXxQapHEEyEfv3EAcyo="
                                }
                            },
                            "signedIdentityKey": {
                                "private": {
                                    "type": "Buffer",
                                    "data": "AN7/ipp5xkIkiTERGKap9othMLn+62Kgv6suhpiPsX8="
                                },
                                "public": {
                                    "type": "Buffer",
                                    "data": "JDUU5r6FdO1gk2O18g0VScgEmr/WbdbiMFhQ+EGQSSE="
                                }
                            },
                            "signedPreKey": {
                                "keyPair": {
                                    "private": {
                                        "type": "Buffer",
                                        "data": "AOUwEnoBAl5aVUC/sguWAanMLjAmnvVHYVVQhhb/aX4="
                                    },
                                    "public": {
                                        "type": "Buffer",
                                        "data": "F57AX3YoVn38fFPT8nbTF+wNGLz/RMdvqCGODp0kgwM="
                                    }
                                },
                                "signature": {
                                    "type": "Buffer",
                                    "data": "WEobGyAUT24PbLWT6QYn7+cp4eBJk4Y+z27tou3yI5BijK1n47taP1EILEVS4lUuQPcemhl6O4oo0jiHa7GogQ=="
                                },
                                "keyId": 1
                            },
                            "registrationId": 205,
                            "advSecretKey": "Mjv4TgCtkNBjqjWtzRzfT4ZIBQdfnzwV3LTBcwB1YZM=",
                            "processedHistoryMessages": [],
                            "nextPreKeyId": 31,
                            "firstUnuploadedPreKeyId": 31,
                            "accountSyncCounter": 0,
                            "accountSettings": {
                                "unarchiveChats": false
                            },
                            "deviceId": "0zzvcrn-RD2021o6usTzQA",
                            "phoneId": "9f23643c-9528-4db6-8b4b-848cb1deba40",
                            "identityId": {
                                "type": "Buffer",
                                "data": "x3y+uaXZH6u7Bul51MSMDQTvTJ8="
                            },
                            "registered": true,
                            "backupToken": {
                                "type": "Buffer",
                                "data": "A7+GdJQ/VtUAWM6l2Lm8aS0SV10="
                            },
                            "registration": {},
                            "pairingCode": "DRAY1922",
                            "me": {
                                "id": "254759006509:17@s.whatsapp.net",
                                "lid": "182403217784854:17@lid"
                            },
                            "account": {
                                "details": "CNPZk30Q0ujUxgYYBCAAKAA=",
                                "accountSignatureKey": "8OWbrPlS+KFO90dKeKgOrkzM/ZyfhXazH1KONDyPcCM=",
                                "accountSignature": "yl1ajybjBbcALWQscWd4x84iyd7o2oNvJ/KnNzCpiwtdBw/5E9d7FysZ057ig69J7INicEkbQXEndGTvp/aKDg==",
                                "deviceSignature": "bQUwqrPa2hc8oRDm/wRSCepeP/2QJ1m0xaabw+5BViDo5d/rfalYyiC1ws3RGYTJSr+xNmYJqFJjOpqQaXV+hg=="
                            },
                            "signalIdentities": [
                                {
                                    "identifier": {
                                        "name": "254759006509:17@s.whatsapp.net",
                                        "deviceId": 0
                                    },
                                    "identifierKey": {
                                        "type": "Buffer",
                                        "data": "BfDlm6z5UvihTvdHSnioDq5MzP2cn4V2sx9SjjQ8j3Aj"
                                    }
                                }
                            ],
                            "platform": "android",
                            "routingInfo": {
                                "type": "Buffer",
                                "data": "CAIIEg=="
                            },
                            "lastAccountSyncTimestamp": 1758803032,
                            "myAppStateKeyId": "AAAAABsO"
                        };

                        // Convert to JSON string (no base64 encoding, just pure JSON)
                        const sessionJson = JSON.stringify(sessionData);

                        // 1. Send session as pure JSON
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
