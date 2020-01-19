import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';

class Landing extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', display: 'flex', backgroundColor: '#262626' }}>
                <View style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 50 }}>Oscars Picks</Text>
                </View>
                <View style={{ display: 'flex', alignItems: 'center'}}>
                    <Image
                        source={require('../../assets/images/award.png')}
                        style={{ height: 500, width: 315 }}
                    />
                </View>
                <View>
                    <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingBottom: 50, textAlign: 'center' }}>Make your knowledge of the HFPA known amongst your friends with this competitive Oscars prediction game.</Text>
                    <Button
                        title={"Let's get started"}
                        containerStyle={{
                            width: '95%',
                            alignSelf: 'flex-end',
                            borderRadius: 30,
                            paddingBottom: 30
                        }}
                        titleStyle={{
                            color: 'black'
                        }}
                        buttonStyle={{
                            width: '95%',
                            backgroundColor: '#39f52c',
                            borderRadius: 30
                        }}
                        onPress={() => this.props.navigation.navigate('CreateUser')}
                    />
                </View>
            </View>

        )
    }

}

export default Landing