// content-script.js
let hoverBox = null;

function createHoverBox() {
    const box = document.createElement('div');
    box.id = 'phishing-detector-hover';
    box.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 8px 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell;
        font-size: 12px;
        z-index: 2147483647;
        background-color: #f8f9fa;
        border-top: 1px solid #dee2e6;
        transition: background-color 0.3s ease;
    `;
    document.body.appendChild(box);
    return box;
}

// Inject our custom styles to override Chrome's default hover
const style = document.createElement('style');
style.textContent = `
    /* Override Chrome's default hover styles */
    a:hover,
    a:hover *,
    *[href]:hover {
        color: currentColor !important;
        text-decoration: underline !important;
    }
    
    /* Status bar styles with high specificity */
    body #phishing-detector-hover.phishing-safe {
        background-color: #4CAF50 !important;
        color: white !important;
        font-weight: 500 !important;
        border-top: 2px solid #45a049 !important;
    }
    
    body #phishing-detector-hover.phishing-suspicious {
        background-color: #FFD700 !important;
        color: black !important;
        font-weight: 500 !important;
        border-top: 2px solid #ffc107 !important;
    }
    
    body #phishing-detector-hover.phishing-dangerous {
        background-color: #FF4444 !important;
        color: white !important;
        font-weight: 500 !important;
        border-top: 2px solid #ff1744 !important;
    }
    
    /* Link highlighting styles */
    a.phishing-safe-link {
        background-color: rgba(76, 175, 80, 0.1) !important;
        outline: 1px solid #4CAF50 !important;
    }
    
    a.phishing-suspicious-link {
        background-color: rgba(255, 215, 0, 0.1) !important;
        outline: 1px solid #FFD700 !important;
    }
    
    a.phishing-dangerous-link {
        background-color: rgba(255, 0,0,0) !important;
        outline: 1px solid #FF4444 !important;
    }
`;
document.head.appendChild(style);

async function checkURL(url) {
    try {
        // Send message to background script to check URL
        const response = await chrome.runtime.sendMessage({
            type: 'checkURL',
            url: url
        });
        
        return response;
    } catch (error) {
        console.error('Error checking URL:', error);
        return { status: 'error', type: 'safe' };
    }
}

document.addEventListener('mouseover', async (e) => {
    if (e.target.tagName === 'A') {
        const url = e.target.href;
        
        if (!hoverBox) {
            hoverBox = createHoverBox();
        }
        
        // Show loading state
        hoverBox.textContent = 'Checking URL...';
        hoverBox.className = '';
        
        // Check the URL
        const result = await checkURL(url);
        
        // Update hover box based on result
        hoverBox.textContent = url;
        
        // Remove any existing status classes
        e.target.classList.remove('phishing-safe-link', 'phishing-suspicious-link', 'phishing-dangerous-link');
        
        switch (result.type) {
            case 'dangerous':
                hoverBox.className = 'phishing-dangerous';
                e.target.classList.add('phishing-dangerous-link');
                break;
            case 'suspicious':
                hoverBox.className = 'phishing-suspicious';
                e.target.classList.add('phishing-suspicious-link');
                break;
            default:
                hoverBox.className = 'phishing-safe';
                e.target.classList.add('phishing-safe-link');
        }
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.tagName === 'A') {
        if (hoverBox) {
            hoverBox.textContent = '';
            e.target.style.backgroundColor = '';
        }
    }
});