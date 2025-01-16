// urlAnalyzer.js

// Common brands that might be targeted by phishing
const targetedBrands = [
    'paypal',
    'apple',
    'amazon',
    'microsoft',
    'google',
    'facebook',
    'netflix'
];

class URLAnalyzer {
    constructor() {
        this.suspiciousIndicators = [];
    }

    // Main analysis function
    analyzeURL(url) {
        this.suspiciousIndicators = []; // Reset for new analysis
        
        // Convert URL to lowercase for consistent checking
        const lowercaseURL = url.toLowerCase();
        const urlObj = new URL(url);
        
        // Run all checks
        this.checkURLLength(url);
        this.checkSuspiciousCharacters(lowercaseURL);
        this.checkNumberSubstitutions(urlObj.hostname);
        this.checkBrandAbuse(urlObj.hostname);

        // Return results
        return {
            isSuspicious: this.suspiciousIndicators.length > 0,
            riskFactors: this.suspiciousIndicators
        };
    }

    // Check 1: URL Length
    checkURLLength(url) {
        const MAX_SAFE_URL_LENGTH = 100;
        if (url.length > MAX_SAFE_URL_LENGTH) {
            this.suspiciousIndicators.push(
                `Unusually long URL (${url.length} characters)`
            );
        }
    }

    // Check 2: Suspicious Characters
    checkSuspiciousCharacters(url) {
        // Characters often used in phishing URLs
        const suspicious = /[<>{|}]/g;
        
        if (suspicious.test(url)) {
            this.suspiciousIndicators.push(
                'Contains suspicious special characters'
            );
        }
    }

    // Check 3: Number Substitutions
    checkNumberSubstitutions(domain) {
        // Common number substitutions
        const substitutions = {
            '0': 'o',
            '1': 'l',
            '3': 'e',
            '4': 'a',
            '5': 's'
        };

        let hasSubstitution = false;
        Object.entries(substitutions).forEach(([number, letter]) => {
            if (domain.includes(number)) {
                // Check if it might be a substitution
                const possibleWord = domain.replace(number, letter);
                if (this.looksMoreLegitimate(possibleWord)) {
                    hasSubstitution = true;
                }
            }
        });

        if (hasSubstitution) {
            this.suspiciousIndicators.push(
                'Contains possible number substitutions'
            );
        }
    }

    // Check 4: Brand Names in Suspicious Locations
    checkBrandAbuse(domain) {
        targetedBrands.forEach(brand => {
            // Check if domain contains brand but isn't the brand's domain
            if (domain.includes(brand) && 
                !domain.startsWith(brand + '.') && 
                !domain.endsWith('.' + brand + '.com')) {
                this.suspiciousIndicators.push(
                    `Suspicious use of "${brand}" in domain`
                );
            }
        });
    }

    // Helper: Check if a word looks more legitimate
    looksMoreLegitimate(word) {
        // Simple dictionary check - you can expand this
        const commonWords = ['google', 'paypal', 'login', 'account', 'secure'];
        return commonWords.some(commonWord => 
            word.includes(commonWord)
        );
    }
}

// Export for use in other files
export { URLAnalyzer };