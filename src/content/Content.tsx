import React, { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";

// function injectFetchInterceptor() {
//   const script = document.createElement('script');
//   script.src = chrome.runtime.getURL('inject.js');
//   document.documentElement.appendChild(script);
//   script.remove();
// }


const Content: React.FC = () => {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // console.log('[Injected] Script running!');
//     //   const originalFetch = window.fetch;
//     //   window.fetch = async (...args) => {
//     //     console.log('[Injected] fetch called with args:', args);
//     //     const response = await originalFetch.apply(window, args);
//     //     const url =
//     //       typeof args[0] === 'string'
//     //         ? args[0]
//     //         : args[0] instanceof Request
//     //           ? args[0].url
//     //           : args[0].toString();
//     //     console.log('[Injected] fetch URL:', url);
//     //     if (url.includes('/payments/wallet/')) {
//     //       console.log('[Injected] Intercepted wallet API fetch:', url);
//     //       const cloned = response.clone();
//     //       cloned.json().then(data => {
//     //         console.log('[Injected] Wallet API response data:', data);
//     //         window.postMessage({ type: 'INTERAKT_WALLET_BALANCE', balance: data.balance }, '*');
//     //         console.log('[Injected] Posted INTERAKT_WALLET_BALANCE message:', data.balance);
//     //       });
//     //     }
//     //     return response;
//     //   };
// // injekkktFetchInterceptor();
//     const handler = (event: MessageEvent) => {
//       if (event.data?.type === 'INTERAKT_WALLET_BALANCE') {
//         console.log('[ContentScript] Received INTERAKT_WALLET_BALANCE message:', event.data.balance);
//         chrome.runtime.sendMessage({
//           type: 'BALANCE_UPDATE',
//           balance: event.data.balance,
//         });
//         console.log('[ContentScript] Sent BALANCE_UPDATE to extension:', event.data.balance);
//       }
//     };
//     window.addEventListener('message', handler);
//     return () => window.removeEventListener('message', handler);
//   }, []);

  useEffect(() => {
    // Listen for balance updates from background script
    // chrome.runtime.onMessage.addListener((message: { type: string; balance: string }) => {
    //   console.log('[ContentScript] Received message:', message);
    //   if (message.type === 'INTERAKT_WALLET_BALANCE') {
    //     setBalance(message.balance);
    //     setLoading(false);
    //   }
    // });

      const handler = (event: MessageEvent) => {
    // Only accept messages from the same window and with the correct type
    if (event.source !== window) return;
    if (event.data?.type === 'INTERAKT_WALLET_BALANCE') {
      console.log('[ContentScript] Received INTERAKT_WALLET_BALANCE:', event.data.balance);
      setBalance(event.data.balance);
      setLoading(false);
      console.log("sned message to chrome extnshion..")
      chrome.runtime.sendMessage({
        type: 'INTERAKT_WALLET_BALANCE',
        balance:event.data.balance,
      });
      // Now you can use event.data.balance
      // Optionally, forward to popup/background with chrome.runtime.sendMessage
    }
  };
  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50" style={{
        "zIndex": 2000
    }}>
      <Card className="w-[200px]">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            k:<Wallet className="h-4 w-4 text-muted-foreground" />
            {loading ? (
              <Skeleton className="h-4 w-[80px]" />
            ) : (
              <span className="text-sm font-medium">₹{balance}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Content;
