import { t, useLocale } from "../../../i18n/locale";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsIcon from '@mui/icons-material/Settings';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { MenuItem, MenuList } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getCurrentUserData } from '../../../store/users';
const Sidebar = () => {
  useLocale();
  const currentUser = useSelector(getCurrentUserData());
  return <MenuList className='sidebar'>
      <MenuItem component={NavLink} className='sidebar-menu__item' to={`/profile/${currentUser?._id}`} end>
        <AccountCircleIcon />{t("Мій профіль")}</MenuItem>
      {currentUser?.role === 'admin' && <MenuItem component={NavLink} className='sidebar-menu__item' to={`/profile/${currentUser?._id}/dashboard`} end>
          <AdminPanelSettingsIcon />{t("Панель адміністратора")}</MenuItem>}
      <MenuItem component={NavLink} className='sidebar-menu__item' to={`/profile/${currentUser?._id}/booking`} end>
        <StarBorderIcon />{t("Мої Бронювання")}</MenuItem>
      <MenuItem component={NavLink} className='sidebar-menu__item' to={`/profile/${currentUser?._id}/likes`} end>
        <FavoriteBorderIcon />{t("Сподобалось")}</MenuItem>
      <MenuItem component={NavLink} className='sidebar-menu__item' to={`/profile/${currentUser?._id}/favorites`} end>
        <BookmarkBorderIcon />{t("Вибране")}</MenuItem>

      <MenuItem className='sidebar-menu__item' component={NavLink} to={`/profile/${currentUser?._id}/edit`}>
        <SettingsIcon />{t("Редагувати профіль")}</MenuItem>
    </MenuList>;
};
export default Sidebar;
