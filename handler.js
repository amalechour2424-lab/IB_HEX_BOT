import { makeWASocket, useSingleFileAuthState } from "@adiwajshing/baileys";
import P from "pino";
import { config } from "./config.js";
import { handleMessage } from "./handler.js";
import fs from "fs";

const { state, saveState } = useSingleFileAuthState("./session.json");

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'silent' })
});

sock.ev.on('messages.upsert', async m => {
    await handleMessage(sock, m.messages[0], config);
});

sock.ev.on('creds.update', saveState);
console.log("IB_HEX_BOT démarré ✅");
