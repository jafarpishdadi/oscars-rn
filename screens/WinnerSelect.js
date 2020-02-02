import React, { Component } from 'react'
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle as fullCircle, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircle as emptyCircle } from '@fortawesome/free-regular-svg-icons';



class WinnerSelect extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            category: this.props.navigation.state.params,
            nominees: this.props.navigation.state.params.nominees,
            winner: {
                primary: '',
                secondary: ''
            }
        }
    }

    recordWinner = async () => {
        this.setState({ loading: true })
        try {
            let response = await fetch('https://oscars-picks-api.herokuapp.com/winners', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nomination: this.state.category._id,
                    winner: this.state.winner
                })
            })
            let res = await response.json();
            if (res.errors) {
                console.log(res.errors)
            } else {
                this.setState({ loading: false })
                this.props.navigation.navigate('Home');
            }
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    determineIcon(item) {
        return this.state.winner.primary === item.primary && this.state.winner.secondary === item.secondary ? <FontAwesomeIcon icon={fullCircle} style={{ color: '#39f52c' }} /> : <FontAwesomeIcon icon={emptyCircle} style={{ color: '#39f52c' }} />
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                <ScrollView>
                    <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>{this.state.category.category}</Text>
                    <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Select the winner, then save.</Text>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                        {!this.state.loading && this.state.nominees.length > 0 && (
                            this.state.nominees.map((item, i) => (
                                <ListItem
                                    key={i}
                                    containerStyle={{
                                        borderWidth: 1,
                                        width: '97%',
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        marginBottom: 10
                                    }}
                                    rightIcon={this.determineIcon(item)}
                                    title={item.primary}
                                    subtitle={item.secondary}
                                    onPress={() => { this.setState({ winner: item }) }}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
                {this.state.loading && (
                    <View style={{ display: 'flex', width: '100%', height: '75%', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <ActivityIndicator
                            size='large'
                            color='#e0d100'
                        />
                    </View>
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
                            onPress={() => this.recordWinner()}
                            buttonStyle={{
                                width: 60,
                                height: 61,
                                borderRadius: 30,
                                backgroundColor: '#39f52c'
                            }}
                            disabled={(this.state.winner.primary === '' && this.state.winner.secondary === '')}
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

export default WinnerSelect