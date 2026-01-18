// handleMessage.js
import { run as menuRun } from './commands/core/menu.js';
// Tu pourras créer d'autres fichiers pour chaque commande si besoin
// Exemple : import { run as aiRun } from './commands/core/ai.js';

export async function handleMessage(sock, msg, cfg) {
    if (!msg.message) return; // message vide
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text) return;

    if (text.startsWith("Ib ")) {
        const command = text.slice(3).trim(); // enlève "Ib "

        switch (command) {
            case "menu":
                await menuRun(sock, msg, [], cfg);
                break;
            case "ai":
                await sock.sendMessage(msg.key.remoteJid, { text: "Commande AI activée 🤖" });
                break;
            case "profile":
                await sock.sendMessage(msg.key.remoteJid, { text: "Voici ton profile 📝" });
                break;
            case "🥷":
  // Appelle la fonction de débloquage view-once
  await handleViewOnce(sock, msg); 
  break;
case "💯":
  // Appelle la fonction de sauvegarde en privé
  await handleSavePrivate(sock, msg); 
  break;
            case "toimage":
                await sock.sendMessage(msg.key.remoteJid, { text: "Conversion en image 🖼️" });
                break;
            case "image":
                await sock.sendMessage(msg.key.remoteJid, { text: "Voici l'image demandée 🖼️" });
                break;
            case "antilink":
                await sock.sendMessage(msg.key.remoteJid, { text: "Protection anti-link activée 🔒" });
                break;
            case "antimentiongc":
                await sock.sendMessage(msg.key.remoteJid, { text: "Protection anti-mention activée 🔒" });
                break;
            case "tagall":
                await sock.sendMessage(msg.key.remoteJid, { text: "Tagging de tous les membres 👥" });
                break;
            case "group open/close":
                await sock.sendMessage(msg.key.remoteJid, { text: "Groupe ouvert/fermé ⚡" });
                break;
            default:
                await sock.sendMessage(msg.key.remoteJid, { text: "Commande inconnue ❌" });
                break;
        }
    }
}
