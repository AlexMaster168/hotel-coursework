import { t, useLocale } from "../../../i18n/locale";
import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
const labels: Record<string, string> = {
  rooms: 'Доступні номери',
  profile: 'Профіль',
  booking: 'Мої бронювання',
  dashboard: 'Панель адміністратора',
  likes: 'Сподобалось',
  favorites: 'Вибране',
  edit: 'Редагувати профіль'
};
export default function Breadcrumbs() {
  useLocale();
  const {
    pathname
  } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  return <div className='breadcrumbs'><MuiBreadcrumbs aria-label={t("Навігація")}><Link to='/'>{t("Головна")}</Link>{parts.map((part, i) => <Link key={i} to={'/' + parts.slice(0, i + 1).join('/')} aria-current={i === parts.length - 1 ? 'page' : undefined}>{t(labels[part] || (parts[0] === 'rooms' ? 'Номер' : 'Кабінет'))}</Link>)}</MuiBreadcrumbs></div>;
}
