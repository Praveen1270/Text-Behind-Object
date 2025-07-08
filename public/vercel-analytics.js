// Clean Vercel Analytics Script
(function() {
  'use strict';
  
  // Configuration
  const VERCEL_ANALYTICS_ID = 'prj_ZFFx6Qt7y48n6UhfbdrjGl2cim1v'; // Your actual Vercel Analytics ID
  const API_ENDPOINT = 'https://vitals.vercel-analytics.com/v1/vitals';
  
  // Helper functions
  function getConnectionSpeed() {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }
  
  function getDeviceType() {
      const userAgent = navigator.userAgent;
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
      if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
      return 'desktop';
  }
  
  function generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
  }
  
  // Core analytics functions
  function collectVitals() {
      const vitals = {
          id: generateId(),
          timestamp: Date.now(),
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          connectionSpeed: getConnectionSpeed(),
          deviceType: getDeviceType(),
          screenSize: `${screen.width}x${screen.height}`,
          viewportSize: `${window.innerWidth}x${window.innerHeight}`,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      // Collect Web Vitals if available
      if (typeof performance !== 'undefined' && performance.getEntriesByType) {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
              vitals.loadTime = navigation.loadEventEnd - navigation.fetchStart;
              vitals.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
              vitals.firstPaint = navigation.responseStart - navigation.fetchStart;
          }
          
          // First Contentful Paint
          const paintEntries = performance.getEntriesByType('paint');
          const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
              vitals.fcp = fcp.startTime;
          }
          
          // Largest Contentful Paint
          if ('PerformanceObserver' in window) {
              try {
                  const observer = new PerformanceObserver((list) => {
                      const entries = list.getEntries();
                      const lastEntry = entries[entries.length - 1];
                      if (lastEntry) {
                          vitals.lcp = lastEntry.startTime;
                      }
                  });
                  observer.observe({ entryTypes: ['largest-contentful-paint'] });
              } catch (e) {
                  console.warn('LCP observation failed:', e);
              }
          }
      }
      
      return vitals;
  }
  
  function sendVitals(data) {
      const payload = {
          ...data,
          analyticsId: VERCEL_ANALYTICS_ID,
          timestamp: new Date().toISOString()
      };
      
      // Try to send using beacon API first (more reliable)
      if (navigator.sendBeacon) {
          const success = navigator.sendBeacon(
              API_ENDPOINT,
              JSON.stringify(payload)
          );
          if (success) return;
      }
      
      // Fallback to fetch
      fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true
      }).catch((error) => {
          console.warn('Analytics send failed:', error);
      });
  }
  
  // Event tracking
  function trackEvent(eventName, properties = {}) {
      const eventData = {
          type: 'event',
          name: eventName,
          properties: properties,
          timestamp: Date.now(),
          url: window.location.href,
          id: generateId()
      };
      
      sendVitals(eventData);
  }
  
  // Page view tracking
  function trackPageView() {
      const pageData = {
          type: 'pageview',
          ...collectVitals()
      };
      
      sendVitals(pageData);
  }
  
  // Click tracking
  function setupClickTracking() {
      document.addEventListener('click', (event) => {
          const target = event.target;
          const tagName = target.tagName && target.tagName.toLowerCase();
          
          // Track important clicks
          if (tagName === 'a' || tagName === 'button' || target.getAttribute('role') === 'button') {
              const clickData = {
                  type: 'click',
                  element: tagName,
                  text: target.textContent ? target.textContent.trim().substring(0, 100) : '',
                  href: target.href || '',
                  id: target.id || '',
                  className: target.className || '',
                  timestamp: Date.now(),
                  url: window.location.href
              };
              
              sendVitals(clickData);
          }
      });
  }
  
  // Error tracking
  function setupErrorTracking() {
      window.addEventListener('error', (event) => {
          const errorData = {
              type: 'error',
              message: event.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              stack: event.error && event.error.stack ? event.error.stack : '',
              timestamp: Date.now(),
              url: window.location.href
          };
          
          sendVitals(errorData);
      });
      
      window.addEventListener('unhandledrejection', (event) => {
          const errorData = {
              type: 'unhandledrejection',
              reason: event.reason ? event.reason.toString() : 'Unknown promise rejection',
              stack: event.reason && event.reason.stack ? event.reason.stack : '',
              timestamp: Date.now(),
              url: window.location.href
          };
          
          sendVitals(errorData);
      });
  }
  
  // Session tracking
  function setupSessionTracking() {
      const sessionStart = Date.now();
      
      // Track session end
      window.addEventListener('beforeunload', () => {
          const sessionData = {
              type: 'session',
              duration: Date.now() - sessionStart,
              timestamp: Date.now(),
              url: window.location.href
          };
          
          sendVitals(sessionData);
      });
      
      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
          const visibilityData = {
              type: 'visibility',
              hidden: document.hidden,
              timestamp: Date.now(),
              url: window.location.href
          };
          
          sendVitals(visibilityData);
      });
  }
  
  // Initialize analytics
  function init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
          return;
      }
      
      // Track initial page view
      trackPageView();
      
      // Setup event listeners
      setupClickTracking();
      setupErrorTracking();
      setupSessionTracking();
      
      // Track performance metrics after page load
      window.addEventListener('load', () => {
          setTimeout(() => {
              const performanceData = {
                  type: 'performance',
                  ...collectVitals()
              };
              sendVitals(performanceData);
          }, 1000);
      });
  }
  
  // Export functions for manual tracking
  window.vercelAnalytics = {
      track: trackEvent,
      pageview: trackPageView
  };
  
  // Auto-initialize
  init();
})();