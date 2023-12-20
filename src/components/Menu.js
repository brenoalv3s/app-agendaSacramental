import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from '../config/firebaseConfig';

import './Menu.css';
import homeIconEnable from '../image/icon-home-enable.png';
import homeIconDisable from '../image/icon-home-disable.png';
import agendaIconEnable from '../image/icon-agenda-enable.png';
import agendaIconDisable from '../image/icon-agenda-disable.png';
import sacramentoIconEnable from '../image/icon-sacramento-enable.png';
import sacramentoIconDisable from '../image/icon-sacramento-disable.png';
import frequenciaIconEnable from '../image/icon-frequencia-enable.png';
import frequenciaIconDisable from '../image/icon-frequencia-disable.png';
import topicosIconEnable from '../image/icon-topicos-enable.png';
import topicosIconDisable from '../image/icon-topicos-disable.png';

const menus = [
  { id: 0, name: 'Home', iconEnable: homeIconEnable, iconDisable: homeIconDisable, path: '/home', nome: 'Home' },
  { id: 1, name: 'Agenda', iconEnable: agendaIconEnable, iconDisable: agendaIconDisable, path: '/agenda', nome: 'Agenda' },
  { id: 2, name: 'Sacramento', iconEnable: sacramentoIconEnable, iconDisable: sacramentoIconDisable, path: '/sacramento', nome: 'Sacramento' },
  { id: 3, name: 'Frequência', iconEnable: frequenciaIconEnable, iconDisable: frequenciaIconDisable, path: '/frequencia', nome: 'Frequência' },
  { id: 4, name: 'Tópicos e Oradores', iconEnable: topicosIconEnable, iconDisable: topicosIconDisable, path: '/topicos', nome: 'Tópicos e Oradores' },
];

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchUserDoc = async () => {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore(firebaseApp);
        const userDocRef = doc(db, 'alas', user.uid);
        await getDoc(userDocRef);
      }
    };

    fetchUserDoc();
  }, []);

  useEffect(() => {
    const currentMenu = menus.find(menu => location.pathname === menu.path);
    if (currentMenu) {
      setActiveMenu(currentMenu.id);
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const handleNavigation = async (path, menuId) => {
    navigate(path, { state: { menuId } });

    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    if (user && menuId !== 0) { // Exclude 'Home' menu (menuId 0) from saving
      const db = getFirestore(firebaseApp);
      const userDocRef = doc(db, 'alas', user.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);
        const userMenus = userDocSnapshot.data()?.menus || [];

        // Update the first menu clicked, maintaining the limit of 3 menus
        const updatedMenus = [
          { id: menuId, path, nome: menus[menuId].name },
          ...(userMenus || []).filter((item) => item.id !== menuId),
        ].slice(0, 3);

        await updateDoc(userDocRef, { menus: updatedMenus });
      } catch (error) {
        console.error('Error updating menu in Firebase:', error);
      }
    }
  };

  const menuClickHandler = (path, menuId) => {
    setActiveMenu(menuId);
    handleNavigation(path, menuId);
  };

  return (
    <div className="menu-container">
      <div className="menu">
        {menus.map((menu) => (
          <img
            key={menu.id}
            className={`menu-item ${activeMenu === menu.id ? 'selected' : ''}`}
            src={activeMenu === menu.id ? menu.iconEnable : menu.iconDisable}
            alt={menu.name}
            onClick={() => menuClickHandler(menu.path, menu.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
