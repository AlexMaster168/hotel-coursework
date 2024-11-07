import React from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

const Login = React.lazy(() => import('../layouts/login'));
const Main = React.lazy(() => import('../layouts/main'));
const Profile = React.lazy(() => import('../layouts/profile'));
const Rooms = React.lazy(() => import('../layouts/rooms'));

export const userProfileRoutes = [
  { path: '/profile/booking', name: 'Мої бронювання', icon: StarBorderIcon },
  { path: '/profile/likes', name: 'Сподобалося', icon: FavoriteBorderIcon },
  { path: '/profile/favorites', name: 'Вибране', icon: BookmarkBorderIcon },
];

export type RoutesNavType = {
  path: string;
  name: string;
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
};

export const adminRoutes = [
  { path: '/profile/dashboard', name: 'Панель адміністратора', icon: AdminPanelSettingsIcon },
  { path: '/profile/booking', name: 'Мої бронювання', icon: StarBorderIcon },
  { path: '/profile/likes', name: 'Сподобалося', icon: FavoriteBorderIcon },
  { path: '/profile/favorites', name: 'Вибране', icon: BookmarkBorderIcon },
];

export const navigationRoutes = [
  { path: '/rooms', name: 'Доступні номера' },
];

export const publicRoutes = [
  { path: '/', component: Main, exact: true },
  { path: '/login/:type?', component: Login, exact: true },
  { path: '/rooms/:roomId?/', component: Rooms, exact: true },
];

export const privateRoutes = [{ path: '/profile/:userId?/:route?', component: Profile, exact: true }];
