import React, { Component } from 'react';
import { View, AsyncStorage, ActivityIndicator } from 'react-native';

class AuthLoading extends Component {

    componentDidMount() {
        this.checkUser()
    }

    checkUser = async () => {
        try {
            user = {
                name: await AsyncStorage.getItem('firstName')
            }
            console.log(user)
            console.log(user.name)
            user.name ? this.props.navigation.navigate('NotFirstLoad') : this.props.navigation.navigate('FirstLoad')
            
        } catch (err) {
            console.log(err);
            this.props.navigation.navigate('FirstLoad')
        }
    }

    render() {
        return (
            <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#262626' }}>
                <ActivityIndicator size='large' color='#e0d100'></ActivityIndicator>
            </View>
        )
    }
}

export default AuthLoading