const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const P = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session'); // dossier session pour SESSION_ID
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        if (!m.messages) return;
        const msg = m.messages[0];
        const text = msg.message?.conversation || "";
        const from = msg.key.remoteJid;

        // Vérifie le préfixe Ib
        if (!text.startsWith("Ib")) return;

        const command = text.slice(2).trim().split(" ")[0].toLowerCase();
        const args = text.slice(2).trim().split(" ").slice(1);

        switch(command) {
            case 'menu':
                await sock.sendMessage(from, { text: "📜 Menu du bot : menu, alive, owner, ping..." });
                break;
            case 'alive':
                await sock.sendMessage(from, { text: "✅ IB_HEX_BOT est en ligne !" });
                break;
            case 'owner':
                await sock.sendMessage(from, { text: "Propriétaire : IbSacko" });
                break;
            case 'ping':
                await sock.sendMessage(from, { text: "🏓 Pong !" });
                break;
            // Tu peux ajouter ici toutes tes autres commandes
            default:
                await sock.sendMessage(from, { text: "❌ Commande inconnue" });
        }
    });
}

startBot();
