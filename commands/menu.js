module.exports = {
  execute(sock, msg) {
    sock.sendMessage(msg.key.remoteJid, {
      text: `
╭──𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧─────🥷
│ ʙᴏᴛ : IB_HEX_BOT
│ ᴍᴏᴅᴇ : privé
│ ᴘʀᴇғɪxᴇ : Ib
│ ᴠᴇʀꜱɪᴏɴ : 2.0
╰──────────────🥷

🥷 MENU
Ib menu
Ib alive
Ib ping
Ib vv
Ib 🥷
`
    })
  }
}
