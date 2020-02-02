import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { pics } from '../../assets/key';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class PredictionsRO extends Component {

    constructor(props) {
        super(props)
        this.state = {
            predictions: this.props.navigation.state.params
        }
    }

    static navigationOptions = {
        title: `Predictions`,
        headerStyle: {
            backgroundColor: '#262626'
        },
        headerTintColor: 'white'
    }

    componentDidMount() {
        this.getName();
    }

    getName = async () => {
        let name = await AsyncStorage.getItem('firstName');
        this.setState({ name: name })
    }

    renderItem = ({ item, index, drag, isActive }) => {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <TouchableOpacity style={{ height: 100, width: '97%', backgroundColor: 'white', alignItems: 'center', borderRadius: 10, marginBottom: 10, flexDirection: 'row' }} onLongPress={drag} activeOpacity={0.9}>
                    <Image source={pics[item.primary] || pics[item.secondary]} style={{ marginLeft: 10, height: 75, width: 47 }} />
                    <View>
                        <Text style={{ paddingLeft: 10, marginRight: 20 }}>{item.primary}</Text>
                        <Text style={{ paddingLeft: 10, marginRight: 20 }}>{item.secondary}</Text>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingBottom: 10, paddingTop: 30 }}>{this.state.predictions.user}'s picks for {this.state.predictions.category.toLowerCase()}</Text>
                <DraggableFlatList
                    data={this.state.predictions.selections}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => item.primary}
                />
                <View style={{ height: 75, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, paddingLeft: 20 }}>
                    <Button
                        icon={<FontAwesomeIcon icon={faArrowLeft} style={{ color: 'white' }} />}
                        onPress={() => this.props.navigation.goBack()}
                        buttonStyle={{
                            width: 60,
                            height: 61,
                            borderRadius: 30,
                            backgroundColor: '#ff2e2e'
                        }}
                        containerStyle={{
                            width: 60,
                            height: 61,
                            borderRadius: 30
                        }}
                        titleStyle={{
                            fontSize: 30
                        }}
                    />
                </View>
            </View>
        )
    }

}

export default PredictionsRO