const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")
const express = require("express")
const config = require("./config")

// 🔥 Serveur HTTP (Render exige ça)
const app = express()
const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("IB_HEX_BOT est en ligne 🥷")
})

app.listen(PORT, () => {
  console.log("🌐 Serveur actif sur le port " + PORT)
})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state
  })

  sock.ev.on("creds.update", saveCreds)

  // ✅ NOUVEAU SYSTÈME QR
  sock.ev.on("connection.update", (update) => {
    const { connection, qr, lastDisconnect } = update

    if (qr) {
      console.log("📱 SCANNE CE QR CODE DANS LES LOGS 👇")
      console.log(qr)
    }

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      } else {
        console.log("❌ Déconnecté définitivement")
      }
    }

    if (connection === "open") {
      console.log("✅ IB_HEX_BOT connecté à WhatsApp")
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!text.startsWith(config.prefix)) return

    const args = text.slice(config.prefix.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()

    try {
      const command = require(`./commands/${cmd}.js`)
      command.execute(sock, msg, args)
    } catch (e) {
      // commande inconnue
    }
  })
}

startBot()
