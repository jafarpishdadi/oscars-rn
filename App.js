import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import PredictionPicker from './screens/PredictionPicker';
import MyPicks from './screens/Shared/MyPicks';

import Landing from './screens/FirstLoad/Landing';
import CreateUser from './screens/FirstLoad/CreateUser';
import Rules from './screens/FirstLoad/Rules';

import AuthLoading from './screens/AuthLoading';

const FirstLoad = createStackNavigator(
  {
    Landing: {
      screen: Landing,
      navigationOptions: {
        header: null
      }
    },
    CreateUser: {
      screen: CreateUser,
      navigationOptions: {
        header: null
      }
    }, 
    Rules: {
      screen: Rules,
      navigationOptions: {
        header: null
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
        header: null
      }
    },
    PredictionPicker: {
      screen: PredictionPicker,
      navigationOptions: {
        header: null
      }
    },
    MyPicks: {
      screen: MyPicks,
      navigationOptions: {
        header: null
      }
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