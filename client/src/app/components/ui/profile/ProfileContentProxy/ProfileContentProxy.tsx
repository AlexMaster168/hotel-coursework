import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { getCurrentUserData } from '../../../../store/users';
import AdminDashboard from '../AdminDashboard';
import ProfileBooking from '../ProfileBooking';
import ProfileEdit from '../ProfileEdit';
import ProfileFavorites from '../ProfileFavorites';
import ProfileLikes from '../ProfileLikes';
import UserProfile from '../UserProfile';

type ProfileContentProxyProps = {
  userId: string;
  route: string;
};

const ProfileContentProxy: React.FC<ProfileContentProxyProps> = ({ userId, route }) => {
  const currentUser = useSelector(getCurrentUserData());
  const contentByType: { [x: string]: React.ReactNode } = {
    booking: <ProfileBooking />,
    likes: <ProfileLikes />,
    favorites: <ProfileFavorites />,
    edit: currentUser?._id === userId ? <ProfileEdit /> : <Navigate replace to={`/profile/${currentUser?._id}`} />,
    dashboard: currentUser?.role === 'admin' ? <AdminDashboard /> : <Navigate replace to={`/profile/${currentUser?._id}`} />,
  };


  return (
    <>
      {contentByType[route] || <UserProfile userId={userId} />}
    </>
  );
};

export default ProfileContentProxy;
