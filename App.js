import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './screens/Home';
import PredictionPicker from './screens/PredictionPicker';
import MyPicks from './screens/Shared/MyPicks'


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
      NotFirstLoad: NotFirstLoad
    },
    {
      initialRouteName: 'NotFirstLoad'
    }
  )
)

console.disableYellowBox = true;