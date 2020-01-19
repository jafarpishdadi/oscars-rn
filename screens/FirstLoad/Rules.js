import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';

class Rules extends Component {

    render() {
        return (
            <View style={{ height: '100%', width: '100%', display: 'flex', backgroundColor: '#262626' }}>
                <ScrollView>
                    <View style={{ display: 'flex', alignItems: 'center', flex: 1, paddingTop: 50 }}>
                        <Text style={{ paddingBottom: 50, fontSize: 30, color: 'white' }}>Rules</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>Congrats! Your account has been created. Now that you are ready to get started, here is how the game will work.</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>You will be able to prioritize your predictions for each awards category from most likely to win to least likely to win. Based on the winners position in your prediction, your account will receive an allocation of points.</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>For example, if 1917 is your top selection for 'Best picture', and 1917 wins, you will receive 8 points because there were 8 nominees for the category. If 1917 is your second pick, you will only receive 7 points, 3rd pick results in 6 points, and so forth.</Text>
                        <Text style={{ fontSize: 20, color: 'white' }}>You will be able to update your predictions as much as you want until the start of the awards, February 9th at 7 PM.</Text>
                    </View>
                    <Button
                        title='Got it! Finish'
                        containerStyle={{
                            width: '95%',
                            alignSelf: 'flex-end',
                            borderRadius: 30,
                            paddingBottom: 30,
                            paddingTop: 75
                        }}
                        titleStyle={{
                            color: 'black'
                        }}
                        buttonStyle={{
                            width: '95%',
                            backgroundColor: '#39f52c',
                            borderRadius: 30
                        }}
                        onPress={() =>
                            this.props.navigation.navigate('NotFirstLoad')
                        }
                    />
                </ScrollView>
            </View>
        )
    }

}

export default Rules