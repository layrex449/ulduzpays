// Basic security measures (non-aggressive)
(function() {
    'use strict';
    
    // Prevent iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }
    
    // Basic console clearing (optional, commented out)
    // setInterval(() => console.clear(), 30000);
    
    // Obfuscate page source from casual viewing
    document.addEventListener('keydown', function(e) {
        // Only prevent Ctrl+U (view source) to reduce suspicion
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    });
    
})();
