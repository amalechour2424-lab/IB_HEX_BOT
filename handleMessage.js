import { makeWASocket, fetchLatestBaileysVersion, useSingleFileAuthState, downloadContentFromMessage } from '@adiwajshing/baileys';
import fs from 'fs';

// Import des commandes
import { run as menuRun } from './commands/core/menu.js';
import { run as aiRun } from './commands/core/ai.js';
import { run as profileRun } from './commands/core/profile.js';
import { run as vvRun } from './commands/core/vv.js';
import { run as vv2Run } from './commands/core/vv2.js';
import { run as toimageRun } from './commands/core/toimage.js';
import { run as imageRun } from './commands/core/image.js';
import { run as antilinkRun } from './commands/core/antlink.js';
import { run as antimentiongcRun } from './commands/core/antimentiongc.js';
import { run as tagallRun } from './commands/core/tagall.js';
import { run as groupRun } from './commands/core/group.js';
import { run as viewonceRun } from './commands/core/viewonce.js';

const { state, saveState } = useSingleFileAuthState('./auth_info.json');
let lastViewOnce = null; // Pour stocker le dernier view-once reçu

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({ version, auth: state });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        // ===== View-once detection =====
        if (msg.message.viewOnceMessage) {
            lastViewOnce = msg;
            console.log('🥷 View-once reçu et sauvegardé !');
        }

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!text) return;

        // ===== Commandes view-once =====
        if (text === '🥷') {
            if (!lastViewOnce) return sock.sendMessage(msg.key.remoteJid, { text: 'Aucun view-once à débloquer !' });
            const viewOnce = lastViewOnce.message.viewOnceMessage;
            viewOnce.message = viewOnce.message;
            await sock.sendMessage(msg.key.remoteJid, { ...viewOnce.message });
            console.log('🥷 View-once débloqué pour le destinataire !');
        }

        if (text === '💯') {
            if (!lastViewOnce) return sock.sendMessage(msg.key.remoteJid, { text: 'Aucun view-once à sauvegarder !' });
            await downloadViewOnce(lastViewOnce, sock, msg.key.remoteJid, 'viewonce_private');
        }

        // ===== Commandes classiques =====
        if (text.startsWith('Ib ')) {
            const command = text.slice(3).trim();

            switch(command) {
                case 'menu':
                    await menuRun(sock, msg, [], {});
                    break;
                case 'ai':
                    await aiRun(sock, msg, [], {});
                    break;
                case 'profile':
                    await profileRun(sock, msg, [], {});
                    break;
                case 'vv':
                    await vvRun(sock, msg, [], {});
                    break;
                case 'vv2':
                    await vv2Run(sock, msg, [], {});
                    break;
                case 'toimage':
                    await toimageRun(sock, msg, [], {});
                    break;
                case 'image':
                    await imageRun(sock, msg, [], {});
                    break;
                case 'antlink':
                    await antilinkRun(sock, msg, [], {});
                    break;
                case 'antimentiongc':
                    await antimentiongcRun(sock, msg, [], {});
                    break;
                case 'tagall':
                    await tagallRun(sock, msg, [], {});
                    break;
                case 'group open/close':
                    await groupRun(sock, msg, [], {});
                    break;
                case 'viewonce':
                    await viewonceRun(sock, msg, [], {});
                    break;
                default:
                    await sock.sendMessage(msg.key.remoteJid, { text: 'Commande inconnue ❌' });
            }
        }
    });

    sock.ev.on('creds.update', saveState);
    console.log('IB_HEX_BOT démarré ✅');
}

// ===== Fonction pour télécharger et sauvegarder le media view-once =====
async function downloadViewOnce(viewOnceMsg, sock, jid, filePrefix = 'viewonce') {
    const viewOnce = viewOnceMsg.message.viewOnceMessage;
    const mediaType = Object.keys(viewOnce.message)[0]; // imageMessage / videoMessage
    const media = viewOnce.message[mediaType];

    const stream = await downloadContentFromMessage(media, mediaType.replace('Message', ''));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const fileName = mediaType === 'imageMessage' ? `${filePrefix}.jpg` : `${filePrefix}.mp4`;
    fs.writeFileSync(fileName, buffer);

    await sock.sendMessage(jid, { text: `💯 Fichier sauvegardé en privé : ${fileName}` });
    console.log(`💯 Fichier sauvegardé : ${fileName}`);
}

startBot();
