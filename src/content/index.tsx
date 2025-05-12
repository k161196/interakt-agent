import { createRoot } from 'react-dom/client';
import Content from './Content';
import '../styles/globals.css';

const container = document.createElement('div');
// container.id = 'interakt-balance-root';
container.id = 'mobile-header';
document.body.appendChild(container);

// Inject the fetch interceptor script from your extension
// const script = document.createElement('script');
// const injectUrl = chrome.runtime.getURL('inject.js');
// console.log('[ContentScript] inject.js URL:', injectUrl);
// script.src = injectUrl;
// script.onload = () => {
//   console.log('[ContentScript] inject.js loaded');
//   script.remove(); // Clean up after loading
// };
// document.documentElement.appendChild(script);

const root = createRoot(container);
root.render(<Content/>); 