const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")
const fs = require("fs")
const config = require("./config")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session")

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on("creds.update", saveCreds)

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
    } catch {
      // commande inexistante
    }
  })
}

startBot()
