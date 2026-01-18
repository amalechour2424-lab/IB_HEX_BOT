import { downloadContentFromMessage } from '@adiwajshing/baileys';
import { writeFileSync } from 'fs';

let lastViewOnce = null; // Stocke le dernier message view-once reçu

// Stocker le dernier view-once
export function storeViewOnce(msg) {
    if (msg.message.viewOnceMessage) {
        lastViewOnce = msg;
        console.log('🥷 View-once reçu et sauvegardé en mémoire !');
    }
}

// Débloquer le view-once pour tous (🥷)
export async function handleViewOnce(sock, msg) {
    if (!lastViewOnce) {
        await sock.sendMessage(msg.key.remoteJid, { text: 'Aucun view-once à débloquer !' });
        return;
    }

    const viewOnce = lastViewOnce.message.viewOnceMessage;
    viewOnce.message = viewOnce.message; 
    await sock.sendMessage(msg.key.remoteJid, { ...viewOnce.message });
    console.log('🥷 View-once débloqué pour le destinataire !');
}

// Sauvegarder le view-once en privé (💯)
export async function handleSavePrivate(sock, msg) {
    if (!lastViewOnce) {
        await sock.sendMessage(msg.key.remoteJid, { text: 'Aucun view-once à sauvegarder !' });
        return;
    }

    const viewOnce = lastViewOnce.message.viewOnceMessage;
    const mediaType = Object.keys(viewOnce.message)[0];
    const media = viewOnce.message[mediaType];

    const stream = await downloadContentFromMessage(media, mediaType.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const fileName = mediaType === 'imageMessage' ? `viewonce_private.jpg` : `viewonce_private.mp4`;
    writeFileSync(fileName, buffer);

    await sock.sendMessage(msg.key.remoteJid, { text: `💯 Fichier sauvegardé en privé : ${fileName}` });
    console.log(`💯 Fichier sauvegardé : ${fileName}`);
}
