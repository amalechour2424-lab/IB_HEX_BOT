// ------------------- IMPORTS -------------------
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode');
const fs = require('fs');
const express = require('express');

// ------------------- EXPRESS -------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('IB_HEX_BOT est en ligne 🥷');
});

app.get('/qr', async (req, res) => {
    if (!global.qrCodeString) return res.send('QR non généré pour le moment.');
    try {
        const qrImage = await QRCode.toDataURL(global.qrCodeString);
        res.send(`<h2>Scan le QR code avec WhatsApp</h2><img src="${qrImage}" />`);
    } catch (err) {
        res.send('Erreur lors de la génération du QR');
    }
});

app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));

// ------------------- WHATSAPP -------------------
const { state, saveState } = useSingleFileAuthState('./session.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', (update) => {
        if (update.qr) {
            global.qrCodeString = update.qr; // stocke le QR pour /qr
            console.log('QR reçu ! Ouvre /qr pour le scanner avec WhatsApp.');
        }

        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error).output.statusCode;
            console.log('Connexion fermée, raison :', reason);
            if (reason !== DisconnectReason.loggedOut) {
                startBot(); // reconnect automatique
            }
        } else if (connection === 'open') {
            console.log('✅ IB_HEX_BOT connecté à WhatsApp !');
        }
    });

    sock.ev.on('creds.update', saveState);

    // Exemple simple de message automatique
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text) return;

            if (text.startsWith('Ib')) { // préfixe obligatoire
                const command = text.slice(2).trim().toLowerCase();

                if (command === 'menu') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Voici le menu IB_HEX_BOT 🥷' });
                } else if (command === 'alive') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'IB_HEX_BOT est actif ! ✅' });
                }
                // Ajoute ici tes autres commandes du bot
            }
        } catch (err) {
            console.log('Erreur message:', err);
        }
    });
}

startBot();
