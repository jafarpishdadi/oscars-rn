import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { pics } from '../assets/key';

class PredictionPicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: this.props.navigation.state.params
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.state.params)
        console.log(this.state.info)
    }

    render() {
        return (
            <View style={{ backgroundColor: '#262626', flex: 1 }}>
                <ScrollView>
                    <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingBottom: 30, paddingTop: 15 }}>{this.state.info.category}</Text>
                    <View style={{ alignItems: 'center' }}>
                        {this.state.info.nominees.map((nominee, i) => (
                            <ListItem
                                containerStyle={{
                                    borderWidth: 1,
                                    width: '97%',
                                    backgroundColor: '#fff',
                                    borderRadius: 10
                                }}
                                style={{
                                    marginBottom: 10,
                                    borderRadius: 10
                                }}
                                key={i}
                                title={nominee.primary}
                                subtitle={nominee.secondary}
                                leftElement={<Image source={pics[nominee.primary]} style={{ height: 75, width: 40 }} />}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default PredictionPicker