import { SwitchNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import AuthStack from './AuthStack'
import HomeStack from './HomeStack'

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Home: HomeStack,
  },
  {
    initialRouteName: 'AuthLoading',
    mode: 'modal',
    headerMode: 'none'
  });