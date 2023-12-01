// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseAppProvider } from 'reactfire';
import firebaseConfig from './config/firebaseConfig';
import Login from './components/Login';
import CadastroUnidade from './components/CadastroUnidade';
import RecuperarSenha from './components/RecuperarSenha';
import Home from './components/Home';
import Profile from './components/ProfileEdit';
import Sobre from './components/Sobre';
import Agenda from './components/Agenda'
import Sacramento from './components/Sacramento'
import Frequencia from './components/Frequencia'
import Topicos from './components/Topicos'

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<CadastroUnidade />} />
          <Route path="/esqueceu-senha" element={<RecuperarSenha />} />
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/sacramento" element={<Sacramento />} />
          <Route path="/frequencia" element={<Frequencia />} />
          <Route path="/topicos" element={<Topicos />} />
        </Routes>
      </Router>
    </FirebaseAppProvider>
  );
}

export default App;
