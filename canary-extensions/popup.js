// Define phishing domains outside functions for better access
const phishingDomains = [
    'k4i.tech',
    'google.ca',
    'suspicious-login.net',
    'definitely-not-safe.com'
];

document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        
        document.getElementById('currentUrl').textContent = url;
        console.log('Current URL:', url);
        
        checkIfPhishing(url);
    });
    
    document.getElementById('checkNow').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            checkIfPhishing(currentTab.url);
        });
    });
});

function checkIfPhishing(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase(); // Convert to lowercase
        console.log('Checking hostname:', hostname);
        
        // Better URL matching
        const isPhishing = phishingDomains.some(domain => {
            // Remove 'www.' if present for consistent comparison
            const cleanHostname = hostname.replace(/^www\./, '');
            const match = cleanHostname === domain;  // Exact match instead of includes
            console.log(`Checking ${domain} against ${cleanHostname}: ${match}`);
            return match;
        });
        
        if (isPhishing) {
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
        } else {
            chrome.action.setBadgeText({ text: '' });
        }
        
        const statusContainer = document.querySelector('.status-container');
        const statusMessage = document.getElementById('statusMessage');
        
        console.log('Phishing check result:', isPhishing);
        
        if (isPhishing) {
            statusContainer.className = 'status-container unsafe';
            statusMessage.textContent = 'WARNING: This site appears to be unsafe!';
            addToRecentChecks(hostname, false);
        } else {
            statusContainer.className = 'status-container safe';
            statusMessage.textContent = 'Site appears to be safe';
            addToRecentChecks(hostname, true);
        }

        // Add debug information
        addDebugInfo(hostname, isPhishing);

    } catch (error) {
        console.error('Error checking URL:', error);
        statusMessage.textContent = 'Error checking site security';
    }
}

// New function to add debug information to the popup
function addDebugInfo(hostname, isPhishing) {
    const debugDiv = document.createElement('div');
    debugDiv.style.marginTop = '10px';
    debugDiv.style.padding = '10px';
    debugDiv.style.backgroundColor = '#f0f0f0';
    debugDiv.style.fontSize = '12px';
    
    debugDiv.innerHTML = `
        <strong>Debug Information:</strong><br>
        Checked Domain: ${hostname}<br>
        Result: ${isPhishing ? 'Unsafe' : 'Safe'}<br>
        Checking against: ${phishingDomains.join(', ')}<br>
    `;
    
    // Remove old debug info if it exists
    const oldDebug = document.querySelector('.debug-info');
    if (oldDebug) {
        oldDebug.remove();
    }
    
    debugDiv.className = 'debug-info';
    document.body.appendChild(debugDiv);
}

function addToRecentChecks(url, isSafe) {
    const recentList = document.getElementById('recentList');
    const listItem = document.createElement('li');
    listItem.textContent = `${url} - ${isSafe ? ' Safe' : ' Unsafe'}`;
    
    if (recentList.firstChild && recentList.firstChild.textContent === 'No recent checks') {
        recentList.innerHTML = '';
    }
    
    recentList.insertBefore(listItem, recentList.firstChild);
    
    while (recentList.children.length > 5) {
        recentList.removeChild(recentList.lastChild);
    }
}