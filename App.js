import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import PredictionPicker from './screens/PredictionPicker';
import Categories from './screens/OthersPicks/Categories';


import Landing from './screens/FirstLoad/Landing';
import CreateUser from './screens/FirstLoad/CreateUser';
import Rules from './screens/FirstLoad/Rules';

import AuthLoading from './screens/AuthLoading';

const FirstLoad = createStackNavigator(
  {
    Landing: {
      screen: Landing,
      navigationOptions: {
        headerShown: false
      }
    },
    CreateUser: {
      screen: CreateUser,
      navigationOptions: {
        headerShown: false
      }
    }, 
    Rules: {
      screen: Rules,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    initialRouteName: 'Landing'
  }
)

const NotFirstLoad = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        headerShown: false
      }
    },
    PredictionPicker: {
      screen: PredictionPicker,
      navigationOptions: {
        headerShown: false
      }
    },
    Categories: {
      screen: Categories
    }
  },
  {
    initialRouteName: 'Home'
  }
)

export default createAppContainer(
  createSwitchNavigator(
    {
      NotFirstLoad: NotFirstLoad,
      FirstLoad: FirstLoad,
      AuthLoading: AuthLoading
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)

console.disableYellowBox = true;