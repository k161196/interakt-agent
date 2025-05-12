// Background script for Chrome extension
// TODO: Implement API interception logic for Interakt.ai wallet balance 

console.log('Background script loaded'); 

chrome.webRequest.onCompleted.addListener(
  (details:chrome.webRequest.WebResponseCacheDetails) => {
    console.log('webRequest.onCompleted fired:', details.url);
    if (details.url.includes('/payments/wallet/')) {
      // Try to fetch the latest wallet balance using the same request headers
      // Note: This may not work due to CORS or missing credentials, but we log for debugging
      fetch(details.url, {
        // headers: details.requestHeaders?.reduce((acc, header) => {
        //   if (header.name && header.value) acc[header.name] = header.value;
        //   return acc;
        // }, {} as Record<string, string>)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched wallet data:', data);
          // Adjust this if the balance is nested differently
          const balance = data.balance ?? data.data?.balance ?? '0';
          chrome.runtime.sendMessage({
            type: 'BALANCE_UPDATE',
            balance,
          });
        })
        .catch((err) => {
          console.error('Failed to fetch balance:', err);
        });
    }
  },
  { urls: ['<all_urls>'] },
  // ['extraHeaders', 'requestHeaders'] // Not needed for onCompleted
); 