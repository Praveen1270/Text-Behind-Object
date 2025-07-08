// Simple Vercel Analytics - Alternative Approach
(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.vercelAnalyticsLoaded) return;
    window.vercelAnalyticsLoaded = true;
    
    // Configuration - Replace with your actual values
    const config = {
        // Get this from your Vercel project settings
        analyticsId: 'prj_ZFFx6Qt7y48n6UhfbdrjGl2cim1v', // Your actual project ID
        debug: false // Set to true for debugging
    };
    
    // Simple logging function
    function log(message, data = null) {
        if (config.debug) {
            console.log('[Vercel Analytics]', message, data);
        }
    }
    
    // Generate unique ID
    function generateId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    // Send data to Vercel Analytics
    function sendEvent(eventType, eventData = {}) {
        if (!config.analyticsId || config.analyticsId === 'your-project-id') {
            log('Analytics ID not configured, skipping event');
            return;
        }
        
        // Prepare the payload according to Vercel's expected format
        const payload = {
            o: window.location.origin,
            ts: Date.now(),
            r: document.referrer || '',
            u: window.location.href,
            q: window.location.search,
            h: window.location.hash,
            p: window.location.pathname,
            analyticsId: config.analyticsId,
            ...eventData
        };
        
        // Use the correct Vercel Analytics endpoint
        const endpoint = `https://vitals.vercel-analytics.com/v1/vitals`;
        
        // Prepare request options
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': navigator.userAgent
            },
            body: JSON.stringify(payload),
            keepalive: true
        };
        
        log('Sending event:', payload);
        
        // Try beacon first (more reliable for page unload events)
        if (navigator.sendBeacon && eventType === 'beforeunload') {
            navigator.sendBeacon(endpoint, JSON.stringify(payload));
            return;
        }
        
        // Use fetch for other events
        fetch(endpoint, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                log('Event sent successfully');
            })
            .catch(error => {
                log('Failed to send event:', error);
            });
    }
    
    // Track page view
    function trackPageView() {
        sendEvent('pageview', {
            type: 'pageview',
            id: generateId()
        });
    }
    
    // Track custom event
    function trackCustomEvent(eventName, properties = {}) {
        sendEvent('custom', {
            type: 'custom',
            name: eventName,
            id: generateId(),
            ...properties
        });
    }
    
    // Track clicks on important elements
    function setupClickTracking() {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const tagName = target.tagName.toLowerCase();
            
            // Only track clicks on links and buttons
            if (tagName === 'a' || tagName === 'button' || target.getAttribute('role') === 'button') {
                const clickData = {
                    type: 'click',
                    element: tagName,
                    id: generateId(),
                    text: target.textContent ? target.textContent.trim().substring(0, 50) : '',
                    href: target.href || ''
                };
                
                sendEvent('click', clickData);
            }
        });
    }
    
    // Track session end
    function setupSessionTracking() {
        const sessionStart = Date.now();
        
        window.addEventListener('beforeunload', () => {
            sendEvent('beforeunload', {
                type: 'session_end',
                duration: Date.now() - sessionStart,
                id: generateId()
            });
        });
    }
    
    // Initialize analytics
    function init() {
        log('Initializing Vercel Analytics');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Track initial page view
        trackPageView();
        
        // Setup event listeners
        setupClickTracking();
        setupSessionTracking();
        
        log('Vercel Analytics initialized');
    }
    
    // Export public API
    window.va = window.va || {
        track: trackCustomEvent,
        pageview: trackPageView
    };
    
    // Auto-initialize
    init();
    
})();