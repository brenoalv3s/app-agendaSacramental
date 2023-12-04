import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from "../config/firebaseConfig";
import { useNavigate } from 'react-router-dom';

import './Menu.css';
import homeIcon from '../image/icon-home.png';
import agendaIcon from '../image/icon-agenda.png';
import sacramentoIcon from '../image/icon-sacramento.png';
import frequenciaIcon from '../image/icon-frequencia.png';
import topicosIcon from '../image/icon-topicos.png';
import arrowUpIcon from '../image/icon-arrow-up.png';
import arrowDownIcon from '../image/icon-arrow-down.png';

const menus = [
  { id: 0, name: 'Home', icon: homeIcon, path: '/home', nome: 'Página Inicial' },
  { id: 1, name: 'Agenda', icon: agendaIcon, path: '/agenda', nome: 'Agenda' },
  { id: 2, name: 'Sacramento', icon: sacramentoIcon, path: '/sacramento', nome: 'Sacramento' },
  { id: 3, name: 'Frequência', icon: frequenciaIcon, path: '/frequencia', nome: 'Frequência' },
  { id: 4, name: 'Tópicos', icon: topicosIcon, path: '/topicos', nome: 'Tópicos' },
];

const Menu = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState(null);

  useEffect(() => {
    const fetchUserDoc = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore(firebaseApp);
        const userDocRef = doc(db, 'alas', user.uid);
        await getDoc(userDocRef); // Removed the declaration and unused assignment
        // Aqui você pode fazer algo com userDocSnapshot se necessário
      }
    };

    fetchUserDoc();
  }, []);

  const handleNavigation = async (path, menuId) => {
    const selectedMenu = menus.find(menu => menu.id === menuId);

    if (!selectedMenu) {
      return;
    }

    navigate(path, { state: { menuId } });
    localStorage.setItem('indexMenu', menuId);

    // Enviar para o Firebase
    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, 'alas', user.uid);

      // Check if the selected menu is not the "Home" menu
      if (selectedMenu.name !== 'Home') {
        const userDocSnapshot = await getDoc(userDocRef);
        let updatedMenus = [];

        if (userDocSnapshot.exists()) {
          const existingMenus = userDocSnapshot.data().menus || [];
          const existingMenuPaths = existingMenus.map(menu => menu.path);

          // Check if the menu path has already been saved
          if (!existingMenuPaths.includes(path)) {
            // Update the existing menus, shifting the items
            updatedMenus = [
              { path, timestamp: new Date(), nome: selectedMenu.nome },
              ...existingMenus.slice(0, 2), // Keep the latest two menus
            ];
          } else {
            // The menu path has already been saved, no update needed
            updatedMenus = existingMenus;
          }
        } else {
          // If the document does not exist, create it with the "menus" field
          await setDoc(userDocRef, { menus: [] });

          // Create a new menu array with the selected menu
          updatedMenus = [{ path, timestamp: new Date(), nome: selectedMenu.nome }];
        }

        // Update the document with the new array of menus
        await updateDoc(userDocRef, { menus: updatedMenus });
      }
      setSelectedIcon(menuId);
    }
  };

  const toggleMenuVisibility = () => {
    setMenuVisible(prevMenuVisible => !prevMenuVisible);
  };

  return (
    <div className="menu-container">
      <img
        className={`menu-item menu-arrow ${selectedIcon === 'arrow' ? 'selected' : ''}`}
        src={menuVisible ? arrowDownIcon : arrowUpIcon}
        alt="Arrow"
        onClick={toggleMenuVisibility}
      />
      <div className={`menu ${menuVisible ? 'visible' : 'hidden'}`}>
        {menus.map((menu) => (
          <img
            key={menu.id}
            className={`menu-item ${selectedIcon === menu.id ? 'selected' : ''}`}
            src={menu.icon}
            alt={menu.name}
            onClick={() => handleNavigation(menu.path, menu.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
