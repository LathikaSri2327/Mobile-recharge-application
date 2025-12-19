import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import backgroundImage from './assets/background.jpg';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.body.style.background = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage}) no-repeat center center / cover`;