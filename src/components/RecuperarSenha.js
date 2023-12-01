import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import './RecuperarSenha.css';
import { firebaseApp } from '../config/firebaseConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!email) {
      setShowErrorMessage('Digite o e-mail cadastrado.');
      setTimeout(() => {
        setShowErrorMessage('');
      }, 3000);
      return;
    }

    const firestore = getFirestore(firebaseApp);
    const q = query(collection(firestore, 'alas'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setShowErrorMessage('E-mail não encontrado. Por favor, tente novamente.');
      setTimeout(() => {
        setShowErrorMessage('');
      }, 3000);
      return;
    }

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setShowSuccessMessage('E-mail enviado com sucesso. Verifique sua caixa de entrada.');
      setTimeout(() => {
        setShowSuccessMessage('');
      }, 5000);
    } catch (error) {
      setShowErrorMessage('Erro ao enviar e-mail. Por favor, tente novamente.');
      setTimeout(() => {
        setShowErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className='forgot-password-container'>
      <img className='img-logo' src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" />
      <br />
      <form onSubmit={handleResetPassword}>
        <label className='label-recuperar'>
          E-mail
          <input
            className='input-recuperar'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
      {showSuccessMessage && (
        <p style={{ color: 'green', marginTop: '5px', textAlign: 'center' }}>{showSuccessMessage}</p>
      )}
      {showErrorMessage && (
        <p style={{ color: 'red', marginTop: '5px', textAlign: 'center' }}>{showErrorMessage}</p>
      )}
      <p>
        Solicitação realizada?{' '}
        <Link className='cadastro' to="/">Faça o Login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
