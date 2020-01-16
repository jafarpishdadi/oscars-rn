import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { pics } from '../assets/key';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class PredictionPicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: this.props.navigation.state.params,
            myPredictions: this.props.navigation.state.params.nominees,
            scrollEnabled: true,
            userHasPredicted: false,
            loading: false
        }
    }

    componentDidMount() {
        this.checkForUserPredictions();
    }

    checkForUserPredictions = async () => {
        this.setState({ loading: true })
        let searchParams = JSON.stringify({
            user: 'Pete',
            category: this.state.info.category
        })
        try {
            let response = await fetch(`https://oscars-picks-api.herokuapp.com/predictions/${searchParams}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let res = await response.json();
            if (res.length !== 0) {
                this.setState({
                    info: res[0],
                    myPredictions: res[0].selections,
                    userHasPredicted: true
                })
            }
            this.setState({loading: false})
        } catch (err) {
            console.log(err)
        }
    }

    updatePredictions = async () => {
        this.setState({ loading: true });
        try {
            let response = await fetch(`https://oscars-picks-api.herokuapp.com/predictions/${this.state.info._id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    category: this.state.info.category,
                    user: 'Pete',
                    selections: this.state.myPredictions
                })
            });
            let res = await response;
            if (res) {
                this.setState({
                    loading: false
                })
            } else {
                console.log('There was a problem updating the prediction')
            }
        } catch (err) {
            console.log(err)
        }
    }

    savePredictions = async () => {
        this.setState({ loading: true })
        try {
            let response = await fetch('https://oscars-picks-api.herokuapp.com/predictions', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: 'Pete',
                    selections: this.state.myPredictions,
                    category: this.state.info.category
                })
            })
            let res = await response.json();
            if (res.errors) {
                this.setState({ errors: res.errors })
            } else {
                this.setState({ userHasPredicted: true })
                // this.props.navigation.goBack();
            }
            this.setState({ loading: false })
        } catch (err) {
            console.log(err)
        }
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
            <View style={{ backgroundColor: '#262626', flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingBottom: 10, paddingTop: 30 }}>{this.state.info.category}</Text>
                <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingBottom: 10 }}>Drag and drop nominees in order of most likely to least likely, top to bottom</Text>

                {this.state.loading && (
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <ActivityIndicator
                            size='large'
                            color='#e0d100'
                        />
                    </View>
                )}

                {!this.state.loading && (
                    <DraggableFlatList
                        data={this.state.myPredictions}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => item.primary}
                        onDragBegin={() => this.setState({ scrollEnabled: false })}
                        onDragEnd={({ data }) => this.setState({ myPredictions: data, scrollEnabled: true })}
                    />
                )}

                {!this.state.loading && (
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
                        <Button
                            icon={<FontAwesomeIcon icon={faSave} style={{ color: 'white' }} />}
                            onPress={() => this.state.userHasPredicted ? this.updatePredictions() : this.savePredictions()}
                            buttonStyle={{
                                width: 60,
                                height: 61,
                                borderRadius: 30,
                                backgroundColor: '#39f52c'
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
                )}
            </View>
        )
    }
}

export default PredictionPicker