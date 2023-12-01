// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'firebase/auth';
import 'firebase/firestore';
import './index.css'

import firebaseConfig from './config/firebaseConfig';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>,
);

reportWebVitals();
