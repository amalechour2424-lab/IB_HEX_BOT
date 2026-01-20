// ------------------- IMPORTS -------------------
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode');
const express = require('express');

// ------------------- EXPRESS -------------------
const app = express();
const PORT = process.env.PORT || 10000;

// Page principale
app.get('/', (req, res) => {
    res.send('IB_HEX_BOT est en ligne 🥷');
});

// Page QR code
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

// ------------------- SESSION -------------------
const { state, saveState } = useSingleFileAuthState('./session.json');

// ------------------- BOT WHATSAPP -------------------
async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    // Gestion QR et connexion
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            global.qrCodeString = qr; // stocke le QR pour /qr
            console.log('QR reçu ! Ouvre /qr pour le scanner avec WhatsApp.');
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log('Connexion fermée, raison :', reason);
            if (reason !== DisconnectReason.loggedOut) {
                startBot(); // reconnect automatique
            } else {
                console.log('❌ Déconnecté définitivement, supprime session.json pour recommencer.');
            }
        } else if (connection === 'open') {
            console.log('✅ IB_HEX_BOT connecté à WhatsApp !');
        }
    });

    // Sauvegarde automatique de la session
    sock.ev.on('creds.update', saveState);

    // Gestion des messages
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
            if (!text) return;

            if (text.startsWith('Ib')) { // préfixe obligatoire
                const command = text.slice(2).trim().toLowerCase();

                // ---------------- COMMANDES DE BASE ----------------
                if (command === 'menu') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Voici le menu IB_HEX_BOT 🥷' });
                } else if (command === 'alive') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'IB_HEX_BOT est actif ! ✅' });
                } else if (command === 'ping') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Pong 🏓' });
                } else if (command === 'owner') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Propriétaire : IbSacko' });
                } else if (command === 'dev') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Développeur : Sacko' });
                }

                // ---------------- COMMANDES OWNER ----------------
                else if (command === 'join') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Commande join exécutée (exemple)' });
                } else if (command === 'leave') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Commande leave exécutée (exemple)' });
                } else if (command === 'update') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Bot mis à jour (exemple)' });
                }

                // ---------------- COMMANDES IA ----------------
                else if (command === 'ai' || command === 'chatbot' || command === 'gpt') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'IA en cours (exemple)' });
                }

                // ---------------- CONVERTISSEUR ----------------
                else if (command === 'attp' || command === 'sticker') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Conversion en sticker (exemple)' });
                }

                // ---------------- RECHERCHE ----------------
                else if (command === 'google' || command === 'video' || command === 'song') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Recherche en cours (exemple)' });
                }

                // ---------------- DIVERTISSEMENT ----------------
                else if (command === 'goodnight' || command === 'anime' || command === 'profile') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Fun command executed (exemple)' });
                }

                // ---------------- REACTIONS ----------------
                else if (command === 'wave' || command === 'dance' || command === 'smile') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Reaction exécutée (exemple)' });
                }

                // ---------------- HENTAI ----------------
                else if (command === 'hentai' || command === 'hneko') {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Hentai command (exemple)' });
                }

                // Commande inconnue
                else {
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Commande inconnue. Tape Ib menu pour voir la liste.' });
                }
            }
        } catch (err) {
            console.log('Erreur message:', err);
        }
    });
}

// Démarre le bot
startBot();
