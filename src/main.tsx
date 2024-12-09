import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { db } from './config/database';

// Initialize database before rendering
db.initialize()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    // Show error message to user
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="padding: 20px; color: red;">
          Error initializing database. Please refresh the page or contact support.
        </div>
      `;
    }
  });