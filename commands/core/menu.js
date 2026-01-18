export async function run(sock, msg, args, cfg) {
    const text = `📝 Menu IB_HEX_BOT
- Ib ai
- Ib profile
- Ib vv
- Ib vv2
- Ib toimage
- Ib image
- Ib antilink
- Ib antimentiongc
- Ib tagall
- Ib group open/close
- Ib menu`;

    await sock.sendMessage(msg.key.remoteJid, { text });
}
