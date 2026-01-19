import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth()
});

// Affiche le QR code pour scanner WhatsApp
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('Scanne le QR code ci-dessus avec WhatsApp');
});

// Quand le bot est prêt
client.on('ready', () => {
    console.log('IB_HEX_BOT est lancé avec succès ! ✅');
});

// Exemple de commande simple 🥷
client.on('message', message => {
    if(message.body.toLowerCase() === '🥷') {
        message.reply('Menu de base :\n1️⃣ Option 1\n2️⃣ Option 2\n3️⃣ Option 3');
    }
});

client.initialize();
