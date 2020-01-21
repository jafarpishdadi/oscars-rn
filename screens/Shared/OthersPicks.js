import React, { Component } from 'react';
import { View, Text, ScrollView, AsyncStorage } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

class OthersPicks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            loading: true
        }
    }

    componentDidMount() {
        this.getAllUsers();
    }

    getAllUsers = async () => {
        this.setState({ loading: true });
        let firstName = await AsyncStorage.getItem('firstName');
        try {
            let response = await fetch('https://oscars-picks-api.herokuapp.com/users/{}', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let res = await response.json();
            if (!res) {
                console.log('No response when trying to fetch all nominations')
            } else {
                let filtered = res.filter(item => {
                    return item.firstName !== firstName;
                })
                this.setState({
                    users: filtered,
                    loading: false
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                <ScrollView>
                    <View>
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Other's Picks</Text>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Criticize and applaud your friend's predictions here. Pick a person, then a category.</Text>
                    </View>

                    {
                        !this.state.loading && (
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                                {this.state.users.length !== 0 && (
                                    this.state.users.map((item, i) => (
                                        <ListItem
                                            containerStyle={{
                                                borderWidth: 1,
                                                width: '97%',
                                                backgroundColor: '#fff',
                                                borderRadius: 10,
                                                marginBottom: 10
                                            }}
                                            key={i}
                                            title={item.firstName}
                                            rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
                                            onPress={() => { this.props.navigation.navigate('Categories', item) }}
                                        />
                                    ))
                                )}
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        )
    }

}

export default OthersPicks