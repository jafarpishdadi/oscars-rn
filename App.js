import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import PredictionPicker from './screens/PredictionPicker';
import Categories from './screens/OthersPicks/Categories';
import PredictionsRO from './screens/Shared/PredictionsRO';
import NotFirstLoadRules from './screens/Shared/NotFirstLoadRules';
import CategoriesWin from './screens/CategoriesWin';
import WinnerSelect from './screens/WinnerSelect';

import Landing from './screens/FirstLoad/Landing';
import CreateUser from './screens/FirstLoad/CreateUser';
import Rules from './screens/FirstLoad/Rules';
import Login from './screens/FirstLoad/Login';

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
    },
    Login: {
      screen: Login,
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
      screen: Categories,
      navigationOptions: {
        headerShown: false
      }
    },
    PredictionsRO: {
      screen: PredictionsRO,
      navigationOptions: {
        headerShown: false
      }
    },
    NotFirstLoadRules: {
      screen: NotFirstLoadRules,
      navigationOptions: {
        headerShown: false
      }
    },
    CategoriesWin: {
      screen: CategoriesWin,
      navigationOptions: {
        headerShown: false
      }
    },
    WinnerSelect: {
      screen: WinnerSelect,
      navigationOptions: {
        headerShown: false
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