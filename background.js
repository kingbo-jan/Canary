// Import the URLAnalyzer
import { URLAnalyzer } from './urlAnalyzer.js';

const urlAnalyzer = new URLAnalyzer();

// Google Safe Browsing API configuration
const SAFE_BROWSING_API_KEY = 'AIzaSyCks9WKYEX0a3Tchegijnbds9Io_wuWBvg';
const SAFE_BROWSING_API_URL = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';

// Your existing phishing domains list
const phishingDomains = [
    'k4i.tech',
    'google.ca',
    'suspicious-login.net',
    'definitely-not-safe.com'
];

// Function to check URL against Google Safe Browsing
async function checkGoogleSafeBrowsing(url) {
    const requestBody = {
        client: {
            //specific keywords that Google's Safe Browsing API expects to retrieve (not actually Javascript commands)
            clientId: "canary_phishing_detector", //tells Google who you are. (does not have to match with anything)
            clientVersion: "1.0.0"
        },
        threatInfo: {
            //specific keywords that Google's Safe Browsing API expects to retrieve

            threatTypes: [ //what kind of threat to look for.
                "MALWARE", //software that can harm the computer
                "SOCIAL_ENGINEERING", //scam websites that trick people
                "UNWANTED_SOFTWARE", //annoying softwares
                "POTENTIALLY_HARMFUL_APPLICATION" //apps that may be dangerous
            ],

            //specific keywords that Google's Safe Browsing API expects to retrieve
            platformTypes: ["ANY_PLATFORM"], //check for all threats on all devices.

            //specific keywords that Google's Safe Browsing API expects to retrieve
            threatEntryTypes: ["URL"], //checking website URLs

            //specific keywords that Google's Safe Browsing API expects to retrieve
            threatEntries: [{ url: url }] //the actual URL we want to check
        }
    };

    // cross references our data with the Google Safe Browsing database and see if there is a match
    try {
        const response = await fetch(`${SAFE_BROWSING_API_URL}?key=${SAFE_BROWSING_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        return data.matches && data.matches.length > 0;
    } catch (error) {
        console.error('Safe Browsing API Error:', error);
        return false;
    }
}

// Enhanced checkURL function
async function checkURL(url) {
    try {

        //breaks down URL using URL command
        const URLbreakdown = new URL(url);

        //gets the website part of the URL and makes it lowercase
        const hostname = URLbreakdown.hostname.toLowerCase();

        //gets rid of the "www" if it exists
        const cleanHostname = hostname.replace(/^www\./, '');
        
        // Check against known phishing domains called on top of script
        const yesPhishing = phishingDomains.some(domain => 
            cleanHostname === domain
        );

        // Check Google Safe Browsing
        const isUnsafeGoogle = await checkGoogleSafeBrowsing(url);

        // Get URLAnalyzer results
        const analysisResult = urlAnalyzer.analyzeURL(url);

        // if either our list OR google list says it's dangerous
        if (yesPhishing || isUnsafeGoogle) {
            console.log('URL flagged as dangerous:');
            console.log('In phishing list:', yesPhishing);
            console.log('Flagged by Google:', isUnsafeGoogle);
            // Known dangerous site
            // Chrome extension API commands that Google created.
            chrome.action.setBadgeText({text: '!'});
            chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
            return { status: 'dangerous', reason: 'Known malicious site' };

            // imported from the URLAnalyzer.js
        } else if (analysisResult.riskFactors.length > 0) {
            // Suspicious site
            chrome.action.setBadgeText({text: '?'});
            chrome.action.setBadgeBackgroundColor({color: '#FFA500'});
            return { status: 'suspicious', reason: 'Suspicious characteristics detected' };

        } else {
            // Safe site
            chrome.action.setBadgeText({text: ''});
            return { status: 'safe', reason: 'No threats detected' };
        }

    //if there's anything that goes wrong, log the error and report there was a problem checking the URL 
    } catch (error) {
        console.error('Error checking URL:', error);
        return { status: 'error', reason: 'Error checking URL' };
    }
}

// chrome extension command that listens for when you switch tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    try {

        //chrome.tabs.get() fetches information about that tab
        //tabID important because it is like a unique ID number that chrome uses to identify each tab
        const tab = await chrome.tabs.get(activeInfo.tabId);
        //checks if tab has a URL
        if (tab.url) {
            // calls the checkURL function
            checkURL(tab.url);
        }
    } catch (error) {
        console.error('Error getting tab: ', error);
    }
});

//like a security camera that watches for any URL change in tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    //if there is a change in URL 
    if (changeInfo.url) {
        //runs your checkURL() 
        checkURL(changeInfo.url);
    }
});

// Message handler for content script
//onMessage enables different parts of the extension to communicate with each other.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    //looks at what type of message it is (request.type)
    if (request.type === 'checkURL') {
        checkURL(request.url).then(result => {
            sendResponse(result);
        });
        return true; // Will respond asynchronously
    }
});

async function testSafeBrowsingAPI() {
    const testURL = 'http://malware.testing.google.test/testing/malware/';
    const result = await checkGoogleSafeBrowsing(testURL);
    console.log('Safe Browsing Test Result:', result);
}

// Add this test function in your console while in developer mode
async function testCanaryIntegration() {
    // Test 1: Known malicious URL (Google's test URL)
    const malwareTest = await checkURL('http://testsafebrowsing.appspot.com/s/malware.html');
    console.log('Malware Test:', malwareTest);
    
    // Test 2: Known phishing domain from your list
    const phishingTest = await checkURL('https://k4i.tech');
    console.log('Phishing List Test:', phishingTest);
    
    // Test 3: Known safe URL
    const safeTest = await checkURL('https://www.google.com');
    console.log('Safe URL Test:', safeTest);
}
