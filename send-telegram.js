// Vercel Serverless Function: Handle Telegram message sending

const TELEGRAM_BOT_TOKEN = '8526650918:AAGnLa86BtAohGUNMllQPkHWgAW0ZT63t6Q';
const TELEGRAM_CHAT_ID = '8469619186';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required' });
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();

        if (data.ok) {
            console.log('✓ Telegram message sent successfully');
            return res.status(200).json({ success: true, messageId: data.result.message_id });
        } else {
            console.error('✗ Telegram API error:', data);
            return res.status(response.status).json({ success: false, error: data.description || 'Unknown error' });
        }
    } catch (error) {
        console.error('✗ Server error:', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
