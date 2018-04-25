import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'
import SettingScreen from '../screens/SettingScreen'

export default StackNavigator({
  HomeScreen: {
    screen: HomeScreen,
  },
  SettingScreen: {
    screen: SettingScreen,
  },
});