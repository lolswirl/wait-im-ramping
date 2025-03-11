import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Theme from './components/Theme/Theme.tsx';
import { ThemeProvider } from './components/Theme/ThemeContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Theme>
        <App />
      </Theme>
    </ThemeProvider>
  </React.StrictMode>
);
