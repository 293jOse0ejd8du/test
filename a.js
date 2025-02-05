// ==UserScript==
// @name        Delta Bypass
// @namespace   your-namespace
// @match       *://linkvertise.com/*
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    function decodeLinkvertise(url) {
        // Attempt 1: Direct URL Parameter
        let match = url.match(/https:\/\/linkvertise\.com\/.*r=([^&]*)/);
        if (match) {
            try {
                const base64_string = match[1];
                const decoded_base64 = decodeURIComponent(base64_string);
                return atob(decoded_base64);
            } catch (e) {
                console.error("Linkvertise Redirector: Error decoding base64 from URL:", e);
            }
        }

        // Attempt 2: Look for the redirect target in the page content (often in JavaScript)
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const scriptContent = script.textContent;
            if (scriptContent) {
                let match = scriptContent.match(/url: *['"]([^'"]+)['"]/); // Look for url: "..." or url: '...'
                if (match) {
                    return match[1];
                }
                match = scriptContent.match(/window\.location\.href *= *['"]([^'"]+)['"]/); // Look for window.location.href = "..."
                if (match) {
                    return match[1];
                }
            }
        }

        // Attempt 3: Simulate clicking the "Free Access with Ads" button (common pattern)
        const freeAccessButton = document.querySelector('a.main-button[href="#"]'); // Adjust selector if needed
        if (freeAccessButton) {
            console.log("Linkvertise Redirector: Found 'Free Access with Ads' button. Clicking...");
            freeAccessButton.click();
            // The actual redirect might happen via JavaScript after the click.
            // We might need to wait or observe for changes in window.location.href.
            // For now, let's assume it will redirect.
            return null; // Indicate that a click was simulated, further checks might be needed.
        }

        console.log("Linkvertise Redirector: No direct redirect found.");
        return null;
    }

    const currentUrl = window.location.href;
    const destinationUrl = decodeLinkvertise(currentUrl);

    if (destinationUrl) {
        console.log("Linkvertise Redirector: Redirecting to:", destinationUrl);
        window.location.replace(destinationUrl);
    } else if (!destinationUrl) {
        // If decodeLinkvertise returned null, it might mean a click was simulated.
        // We can potentially add more logic here to monitor for redirects after the click.
        // For now, we'll just log a message.
        console.log("Linkvertise Redirector: Waiting for potential redirect after interaction.");
    }
})();
