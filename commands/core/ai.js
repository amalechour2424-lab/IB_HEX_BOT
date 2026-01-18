export async function run(sock, msg, args, cfg) {
    await sock.sendMessage(msg.key.remoteJid, { text: "Commande AI activée 🤖" });
}
