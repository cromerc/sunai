import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardComponent from './views/Dashboard/DashboardComponent';

import { locale, addLocale } from 'primereact/api';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

addLocale('es', {
    choose: "Cargar Excel"
});

locale('es');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
// @ts-ignore
        exact path="/" element={<Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={<DashboardComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
