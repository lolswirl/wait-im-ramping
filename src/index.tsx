import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import Theme from './components/Theme/Theme';
import { ThemeProvider } from './context/ThemeContext';
import { SpecProvider } from './context/SpecContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ThemeProvider>
      <Theme>
        <SpecProvider>
          <App />
        </SpecProvider>
      </Theme>
    </ThemeProvider>
  // </React.StrictMode>
);
