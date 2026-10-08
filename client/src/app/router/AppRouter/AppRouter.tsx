import React, { Suspense } from 'react';
import { publicRoutes, privateRoutes } from '../routes';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from '../../store/users';
import Page404 from '../../components/pages/404Page';

const AppRouter: React.FC = () => {
  const isLoggedIn = useSelector(getIsLoggedIn());
  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          {privateRoutes.map(route => <Route path={route.path} element={isLoggedIn ? <route.component /> : <Navigate replace to='/login/signIn' />} key={route.path} />)}
          {publicRoutes.map(route =>
            route.path ? (
                <Route path={route.path} element={<route.component />} key={route.path} />
            ) : null
          )}
          <Route path='*' element={<Page404 />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
