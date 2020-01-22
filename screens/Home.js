import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCog } from "@fortawesome/free-solid-svg-icons";


import MyPicks from './Shared/MyPicks';
import Scoreboard from './Shared/Scoreboard';
import OthersPicks from './Shared/OthersPicks';
import Settings from './Shared/Settings';

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nominations: [],
            index: 0,
            routes: [
                { key: 'mypicks', title: 'My Picks' },
                { key: 'scoreboard', title: 'Scoreboard' },
                { key: 'friendspicks', title: "Other's Picks" },
                { key: 'settings' }
            ]
        }
    }
    
    renderScene = ({route}) => {
        switch (route.key) {
            case 'mypicks':
                return <MyPicks navigation={this.props.navigation}/>
            case 'scoreboard':
                return <Scoreboard navigation={this.props.navigation}/>
            case 'friendspicks':
                return <OthersPicks navigation={this.props.navigation}/>
            case 'settings': 
                return <Settings navigation={this.props.navigation}/>
            default:
                return null;
        }
    }

    renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#e0d100' }}
            style={{ backgroundColor: '#262626' }}
            tabStyle={{ width: 'auto' }}
            renderIcon={({ route, focused, color }) => {
                if (route.key === 'settings') {
                    return (
                        <FontAwesomeIcon icon={faCog} color={focused ? 'white' : 'grey'}/>
                    )
                }
            }}
        />
    )

    render() {
        return (
                <TabView
                    navigation={this.props.navigation}
                    navigationState={this.state}
                    renderScene={this.renderScene}
                    renderTabBar={this.renderTabBar}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
        )
    }
}

export default Home;