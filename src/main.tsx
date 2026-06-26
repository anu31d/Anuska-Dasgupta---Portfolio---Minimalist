/**
 * @file main.tsx
 * @description Application entry point. Renders the main App component inside the StrictMode React wrapper.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the React root and render the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
