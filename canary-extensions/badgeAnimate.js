// Import the badge animator
import { badgeAnimator } from './badgeAnimator.js';
import { URLAnalyzer } from './urlAnalyzer.js';

const urlAnalyzer = new URLAnalyzer();
const phishingDomains = [
    'k4i.tech',
    'google.ca',
    'suspicious-login.net',
    'definitely-not-safe.com'
];

async function checkURL(url) {
    try {
        // Start scanning animation while checking
        badgeAnimator.startScanningAnimation();

        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();
        const cleanHostname = hostname.replace(/^www\./, '');
        
        // Check against known phishing domains
        const isKnownPhishing = phishingDomains.some(domain => 
            cleanHostname === domain
        );

        // Get enhanced analysis
        const analysisResult = urlAnalyzer.analyzeURL(url);

        // Determine threat level
        if (isKnownPhishing) {
            // Known phishing site - show warning animation
            badgeAnimator.startWarningAnimation();
        } else if (analysisResult.riskFactors.length > 0) {
            // Suspicious site - show suspicious animation
            badgeAnimator.startSuspiciousAnimation();
        } else {
            // Safe site - show brief checkmark
            badgeAnimator.showSafeAnimation();
        }

        // Store analysis results
        chrome.storage.local.set({
            currentAnalysis: {
                url: url,
                isPhishing: isKnownPhishing,
                riskFactors: analysisResult.riskFactors
            }
        });

    } catch (error) {
        console.error('Error checking URL:', error);
        badgeAnimator.stopAnimation();
    }
}

// Tab activation listener
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
            checkURL(tab.url);
        }
    } catch (error) {
        console.error('Error getting tab: ', error);
    }
});

// URL update listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        checkURL(changeInfo.url);
    }
});