// Initialize data structure to store browsing data
let browsingData = {};

// Listen for tab updates

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      // Add this check to filter out Chrome URLs
      if (!tab.url.startsWith('chrome://')) {
        chrome.storage.local.get('browsingData', (result) => {
          let browsingData = result.browsingData || {};
          browsingData[tabId] = browsingData[tabId] || [];
          browsingData[tabId].push({
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
          });
          chrome.storage.local.set({browsingData: browsingData});
        });
      }
    }
  });

// Track navigation events
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {  // Only track main frame navigation
    const timestamp = new Date().toISOString();
    
    browsingData[details.tabId] = browsingData[details.tabId] || [];
    browsingData[details.tabId].push({
      url: details.url,
      timestamp: timestamp,
      transitionType: details.transitionType
    });

    // Save data to storage
    chrome.storage.local.set({browsingData: browsingData}, () => {
      console.log('Navigation data saved for tab:', details.tabId);
    });
  }
});

// Function to clear data (you can call this periodically or on certain events)
function clearBrowsingData() {
  browsingData = {};
  chrome.storage.local.remove('browsingData', () => {
    console.log('Browsing data cleared');
  });
}

// Optional: Clear data every 24 hours
setInterval(clearBrowsingData, 24 * 60 * 60 * 1000);