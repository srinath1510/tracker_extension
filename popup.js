document.addEventListener('DOMContentLoaded', function() {
    // Function to display browsing data
    function displayBrowsingData() {
      chrome.storage.local.get('browsingData', (result) => {
        const browsingData = result.browsingData || {};
        const dataContainer = document.getElementById('data-container');
        
        // Clear previous content
        dataContainer.innerHTML = '';
  
        if (Object.keys(browsingData).length === 0) {
          dataContainer.textContent = 'No browsing data collected yet.';
          return;
        }
  
        for (let tabId in browsingData) {
          const tabData = browsingData[tabId];
          const tabElement = document.createElement('div');
          tabElement.innerHTML = `<h2>Tab ${tabId}</h2>`;
          
          tabData.forEach(visit => {
            const date = new Date(visit.timestamp);
            tabElement.innerHTML += `
              <p>
                Title: ${visit.title || 'N/A'}<br>
                URL: ${visit.url}<br>
                Time: ${date.toLocaleString()}
              </p>
            `;
          });
          
          dataContainer.appendChild(tabElement);
        }
      });
    }
  
    // Initial display of browsing data
    displayBrowsingData();
  
    // Add event listener for the Clear Data button
    document.getElementById('clearData').addEventListener('click', () => {
      chrome.storage.local.remove('browsingData', () => {
        console.log('Data cleared');
        // Refresh the popup display
        displayBrowsingData();
        // Show a message to the user
        const dataContainer = document.getElementById('data-container');
        dataContainer.textContent = 'All data has been cleared.';
      });
    });
  
    // Optional: Add a refresh button functionality
    document.getElementById('refreshData').addEventListener('click', () => {
      displayBrowsingData();
    });
  
    // Optional: Auto-refresh the data every 5 seconds
    // setInterval(displayBrowsingData, 5000);
  });