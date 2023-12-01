import React from 'react';
import {useAppSelector} from '../../app/hooks';
// import {checkUserAuthenticate} from '../../services/auth.service';
import AuthNavigator from '../auth-navigator/AuthNavigator';
// import {useCheckAuthenticated} from '../../hooks/auth/query/useCheckAuthenticated';
import DrawerNavigation from '../drawer-navigator/DrawerNavigator';

const AppNavigator = () => {
  const loginState = useAppSelector(state => state.login.status);
  // const {refetch} = useCheckAuthenticated(res => checkUserAuthenticate(res));

  // useEffect(() => {
  //   setTimeout(() => {
  //     refetch();
  //   }, 2000);
  // }, [refetch]);

  switch (loginState) {
    case 'loggedIn':
      return <DrawerNavigation />;
    case 'logout':
      return <AuthNavigator />;
    default:
      return <AuthNavigator />;
  }
};

export default AppNavigator;
