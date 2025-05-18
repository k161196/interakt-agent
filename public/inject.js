// (function() {
//      console.log('[Injected] Script running!');
//       const originalFetch = window.fetch;
//       window.fetch = async (...args) => {
//         console.log('[Injected] fetch called with args:', args);
//         const response = await originalFetch.apply(window, args);
//         const url =
//           typeof args[0] === 'string'
//             ? args[0]
//             : args[0] instanceof Request
//               ? args[0].url
//               : args[0].toString();
//         console.log('[Injected] fetch URL:', url);
//         if (url.includes('/payments/wallet/')) {
//           console.log('[Injected] Intercepted wallet API fetch:', url);
//           const cloned = response.clone();
//           cloned.json().then(data => {
//             console.log('[Injected] Wallet API response data:', data);
//             window.postMessage({ type: 'INTERAKT_WALLET_BALANCE', balance: data.balance }, '*');
//             console.log('[Injected] Posted INTERAKT_WALLET_BALANCE message:', data.balance);
//           });
//         }
//         return response;
//       };
//     })();
let chatMessagesUserAgent = [];
(function () {
  console.log("[Injected] Script running!");

  // const chatUrl:string = ''

  // Intercept fetch
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    // console.log("[Injected] fetch called with args:", args);
    const response = await originalFetch(...args);
    const clone = response.clone();
    clone
      .json()
      .then((data) => {
        const url =
          typeof args[0] === "string"
            ? args[0]
            : args[0] instanceof Request
              ? args[0].url
              : args[0].toString();
        if (url.includes("/bundled-conversation/")) {
          console.log("[Injected] fetch URL:", url);
          console.log("[Fetch] Response body:", data);
          const chatMessages = data?.results?.data?.chat_messages ?? [];
          console.log("[Fetch] Response data", chatMessages);
          for (let i = 0; i < chatMessages?.length; i++) {
            let messages = chatMessages[i];
            if (
              messages?.chat_message_type !== "PublicApiMessage" &&
              (messages?.chat_message_type === "AgentMessage" ||
                messages?.chat_message_type === "CustomerMessage")
            ) {
              let messageFormat = {
                message: messages?.message,
                created_at_utc: messages?.created_at_utc,
                from:
                  messages?.chat_message_type === "AgentMessage"
                    ? "agent"
                    : messages?.chat_message_type === "CustomerMessage"
                      ? "customer"
                      : "other",
              };
              console.log("message", JSON.stringify(messageFormat));
             chatMessagesUserAgent?.push(messageFormat)
            }
          }
          // if (data && data.data && data.data.balance) {
          //   window.postMessage(
          //     { type: "INTERAKT_WALLET_BALANCE", balance: data.data.balance },
          //     "*",
          //   );
          //   chrome.runtime.sendMessage({
          //     type: "INTERAKT_WALLET_BALANCE",
          //     balance: data.data.balance,
          //   });
          //   console.log(
          //     "[Injected] Posted INTERAKT_WALLET_BALANCE message:",
          //     data.data.balance,
          //   );
          // }
          //
          console.log("chatMessages",JSON.stringify(chatMessagesUserAgent))
        }
      })
      .catch(() => {});
    return response;
  };

  // Intercept XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  function CustomXHR() {
    const xhr = new originalXHR();

    const open = xhr.open;
    xhr.open = function (method, url, async, user, password) {
      this._url = url;
      open.apply(this, arguments);
    };

    const send = xhr.send;
    xhr.send = function (body) {
      this.addEventListener("load", function () {
        try {
          console.log("[XHR] URL:", this._url);
          console.log("[XHR] Response:", this.responseText);
        } catch (e) {
          console.warn("XHR intercept error:", e);
        }
      });
      send.apply(this, arguments);
    };

    return xhr;
  }

  window.XMLHttpRequest = CustomXHR;

  console.log("[Injected] Interceptors installed");
})();
