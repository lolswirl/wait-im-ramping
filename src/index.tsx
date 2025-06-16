import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App.tsx';
import Theme from './components/Theme/Theme.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { SpecProvider } from './context/SpecContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Theme>
        <SpecProvider>
          <App />
        </SpecProvider>
      </Theme>
    </ThemeProvider>
  </React.StrictMode>
);
