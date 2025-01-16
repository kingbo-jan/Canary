// Content Script for URL Hover Feature
const urlPreview = document.createElement('div');
urlPreview.style.cssText = `
    position: fixed;
    left: 0;
    bottom: 0;
    padding: 8px 16px;
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    font-size: 14px;
    z-index: 999999;
    display: none;
    width: 100%;
    box-sizing: border-box;
`;

document.body.appendChild(urlPreview);

// Track current threat level
let currentThreatLevel = 'safe';

// Listen for threat level updates from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateThreatLevel') {
        currentThreatLevel = message.threatLevel;
    }
});

// Function to get color based on threat level
function getColorForThreatLevel(threatLevel) {
    switch (threatLevel) {
        case 'malicious':
            return '#dc3545'; // Red
        case 'suspicious':
            return '#ffc107'; // Yellow
        default:
            return '#28a745'; // Green
    }
}

// Handle mouse hover over links
document.addEventListener('mouseover', (event) => {
    const link = event.target.closest('a');
    if (link && link.href) {
        urlPreview.textContent = link.href;
        urlPreview.style.color = getColorForThreatLevel(currentThreatLevel);
        urlPreview.style.display = 'block';
        
        // Add warning icon for suspicious or malicious links
        if (currentThreatLevel !== 'safe') {
            const warningIcon = '⚠️ ';
            urlPreview.textContent = warningIcon + urlPreview.textContent;
        }
    }
});

// Handle mouse leave
document.addEventListener('mouseout', (event) => {
    const link = event.target.closest('a');
    if (link) {
        urlPreview.style.display = 'none';
    }
});