import { createBot } from "whatsapp-md"; // Exemple, dépend de la librairie que tu utilises
import fs from "fs";

// ----- CONFIG -----
const SESSION_ID = process.env.SESSION_ID; // On mettra le SESSION_ID sur Render plus tard
const PREFIX = "Ib"; // Préfixe des commandes

// ----- BOT -----
const bot = createBot({ session: SESSION_ID, language: "fr" });

// Menu de base
bot.onMessage(async (message) => {
    const text = message.body;
    
    if (!text.startsWith(PREFIX)) return;

    const command = text.slice(PREFIX.length).trim();

    switch (command) {
        case "🥷":
            bot.sendMessage(message.from, "Commande 🥷 reçue !");
            break;
        case "menu":
            bot.sendMessage(message.from, "📋 Menu de base :\n- 🥷 Commande secrète\n- menu : Affiche ce menu");
            break;
        default:
            bot.sendMessage(message.from, "Commande inconnue. Tape `Ib menu` pour voir les commandes.");
    }
});

console.log("IB_HEX_BOT prêt et en ligne !"); 
