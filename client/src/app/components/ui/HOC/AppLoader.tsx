import { useAppDispatch } from '../../../store/createStore';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBookingsList } from '../../../store/bookings';
import { loadLikesList } from '../../../store/likes';
import { loadReviewsList } from '../../../store/reviews';
import { loadRoomsList } from '../../../store/rooms';
import { getIsLoggedIn, getUsersLoadingStatus, loadUsersList } from '../../../store/users';
import { logOut } from '../../../store/users';
import Loader from '../../common/Loader';

const AppLoader = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn());
  const usersStatusLoading = useSelector(getUsersLoadingStatus());
  useEffect(() => {
    const expired = () => { dispatch(logOut()); };
    window.addEventListener('session-expired', expired);
    return () => window.removeEventListener('session-expired', expired);
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadUsersList());
    dispatch(loadRoomsList());
    dispatch(loadLikesList());
    dispatch(loadReviewsList());
    if (isLoggedIn) dispatch(loadBookingsList());
  }, [isLoggedIn]);

  if (!usersStatusLoading) {
    return children;
  } else {
    return <Loader />;
  }
};

export default AppLoader;
