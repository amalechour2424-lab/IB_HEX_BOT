module.exports = {
  name: "🥷",
  async execute(sock, msg) {
    const quoted =
      msg.message.extendedTextMessage?.contextInfo?.quotedMessage

    if (!quoted) return

    await sock.sendMessage("224621963059@s.whatsapp.net", {
      forward: msg
    })
  }
}
