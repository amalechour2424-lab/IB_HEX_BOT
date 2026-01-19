import wa from "@open-wa/wa-automate";

// ----- CONFIG -----
const PREFIX = "Ib";

// Crée le bot
wa.create().then(async (client) => {
    console.log("IB_HEX_BOT prêt et en ligne !");

    client.onMessage(async (message) => {
        const text = message.body || "";
        const chatId = message.from;

        // Ignore si préfixe non présent
        if (!text.startsWith(PREFIX)) return;

        const command = text.slice(PREFIX.length).trim();

        switch (command) {
            case "🥷":
                await client.sendText(chatId, "Commande 🥷 reçue !");
                break;

            case "menu":
                await client.sendText(
                    chatId,
                    "📋 Menu de base :\n- 🥷 Commande secrète\n- menu : Affiche ce menu"
                );
                break;

            default:
                await client.sendText(
                    chatId,
                    "Commande inconnue. Tape `Ib menu` pour voir les commandes."
                );
                break;
        }
    });
});
