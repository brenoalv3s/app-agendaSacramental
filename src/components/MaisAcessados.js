import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../config/firebaseConfig';
import './MaisAcessados.css';

// Import the images correctly
import agendaIcon from '../image/icon-agenda.png';
import sacramentoIcon from '../image/icon-sacramento.png';
import frequenciaIcon from '../image/icon-frequencia.png';
import topicosIcon from '../image/icon-topicos.png';

const MostAccessedMenus = () => {
  const [mostAccessedMenus, setMostAccessedMenus] = useState([]);
  const navigate = useNavigate();

  // Map paths to corresponding images
  const pathToIcon = {
    '/agenda': agendaIcon,
    '/sacramento': sacramentoIcon,
    '/frequencia': frequenciaIcon,
    '/topicos': topicosIcon,
    // Add more mappings as needed
  };

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    const fetchFirebaseMenus = async (user) => {
      try {
        const userDocRef = doc(db, 'alas', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userMenus = userDocSnapshot.data().menus || [];
          setMostAccessedMenus(userMenus);
        }
      } catch (error) {
        console.error('Erro ao buscar menus do Firebase:', error);
      }
    };

    const authUser = auth.currentUser;

    const unsubscribe = authUser
      ? onSnapshot(doc(db, 'alas', authUser.uid), (doc) => {
          const userMenus = doc.data()?.menus || [];
          setMostAccessedMenus(userMenus);
        })
      : () => {};

    // Call the function once when the component is loaded
    if (auth.currentUser) {
      fetchFirebaseMenus(auth.currentUser);
    }

    return () => {
      // Remove the listener subscription when unmounting the component
      unsubscribe();
    };
  }, []); // Empty array to ensure useEffect runs only once

  const registrarInteracaoMenu = async (menu) => {
    if (menu && menu.name && menu.path) {
      navigate(menu.path);

      // Check if mostAccessedMenus is not undefined before accessing it
      const updatedMenus = [
        menu,
        ...(mostAccessedMenus || []).filter(
          (item) => item.path !== menu.path
        ),
      ].slice(0, 3);
      setMostAccessedMenus(updatedMenus);
      localStorage.setItem(
        'mostAccessedMenus',
        JSON.stringify(updatedMenus)
      );

      try {
        const auth = getAuth(firebaseApp);
        const db = getFirestore(firebaseApp);

        // Check if auth.currentUser is not undefined before accessing it
        const userDocRef = doc(db, 'alas', auth.currentUser?.uid);

        await updateDoc(userDocRef, { menus: updatedMenus });
      } catch (error) {
        console.error('Erro ao enviar menu para o Firebase:', error);
      }
    }
  };

  return (
    <div className="menu-cards-container">
      <span className="subtitle-acessados">Últimos Acessos</span>
      {mostAccessedMenus.length > 0 ? (
        <div className="cards-wrapper">
          {mostAccessedMenus.map((menu, index) => (
            <MenuCard
              key={index}
              menu={menu}
              icon={pathToIcon[menu.path]}
              onClick={() => registrarInteracaoMenu(menu)}
            />
          ))}
        </div>
      ) : (
        <p className="no-accessed-menus-text">
          O histórico de acesso será apresentado aqui
        </p>
      )}
    </div>
  );
};

const MenuCard = ({ menu, icon }) => (
  <Link to={menu.path} className="menu-card">
    <div>
      <img src={icon} alt={menu && menu.nome} className="icons" />
      <div className="menu-card-text">{menu.nome}</div>
    </div>
  </Link>
);

export default MostAccessedMenus;
