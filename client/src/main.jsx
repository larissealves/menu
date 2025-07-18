import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Router from './Router.jsx'

import '../src/styles/base.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router /> {/* Main router with route-based structure */}
    </BrowserRouter>
  </React.StrictMode>
);
