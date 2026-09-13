import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA background capabilities and offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New content available, refreshing service worker');
  },
  onOfflineReady() {
    console.log('App ready to work offline and in background');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
