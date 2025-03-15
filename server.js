const express = require('express');
const { create, Client } = require('whatsapp-web.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

let client;

// Inițializăm clientul WhatsApp cu Pairing Code
app.post('/connect', async (req, res) => {
    const { pairingCode } = req.body;
    if (!pairingCode) return res.status(400).json({ error: "Pairing Code lipsă!" });

    client = new Client({ authStrategy: new Client.AuthStrategies.Pairing(pairingCode) });
    
    client.on('ready', () => console.log("WhatsApp Bot conectat!"));
    client.initialize();

    res.json({ success: true, message: "Conectare în curs..." });
});

// Endpoint pentru trimiterea mesajelor
app.post('/send', async (req, res) => {
    if (!client) return res.status(500).json({ error: "Botul nu este conectat!" });
    
    const { number, message, delay } = req.body;
    if (!number || !message) return res.status(400).json({ error: "Număr sau mesaj lipsă!" });
    
    setTimeout(async () => {
        await client.sendMessage(number + "@c.us", message);
        res.json({ success: true, message: "Mesaj trimis!" });
    }, delay * 1000 || 1000);
});

app.listen(port, () => console.log(`Serverul rulează pe portul ${port}`));
