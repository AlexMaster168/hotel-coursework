import { t, useLocale } from "../../../../i18n/locale";
import { Paper } from '@mui/material';
import React from 'react';
import ProfileEditForm from '../../forms/ProfileEditForm/ProfileEditForm';
const ProfileEdit = () => {
  useLocale();
  return <main className='profile-edit'>
      <Paper elevation={3} className='form-card profileEdit-form'>
        <h2>{t("Редагування профілю")}</h2>
        <ProfileEditForm />
      </Paper>
    </main>;
};
export default ProfileEdit;
