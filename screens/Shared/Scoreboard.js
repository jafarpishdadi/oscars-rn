import React, { Component } from 'react';
import { View, ScrollView, Text, ActivityIndicator, RefreshControl, AsyncStorage } from 'react-native';
import { ListItem, Button } from 'react-native-elements';

class Scoreboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            refreshing: false
        }
    }

    componentDidMount() {
        this.getAllUsers();
    }

    getAllUsers = async () => {
        this.setState({ loading: true })
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
                console.log('No response when trying to fetch all users')
            } else {
                sorted = res.sort((a, b) => (a.score < b.score) ? 1 : -1)
                let admin = await AsyncStorage.getItem('admin') === 'true'
                this.setState({
                    users: sorted,
                    loading: false,
                    admin: admin
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.getAllUsers}
                            colors={['black']}
                        />
                    }
                >
                    <View>
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Scoreboard</Text>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>
                            Once the Oscars start, check here to see your score compared to your friends. Pull down to refresh.
                        </Text>
                    </View>
                    {
                        !this.state.loading && (
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                                {this.state.users.length !== 0 && (
                                    this.state.users.map((item, i) => (
                                        <ListItem
                                            containerStyle={{
                                                width: '75%',
                                                height: 50,
                                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                                borderBottomWidth: 1,
                                                borderBottomColor: 'white'
                                            }}
                                            key={i}
                                            title={(i + 1) + '. ' + item.firstName}
                                            titleStyle={{ color: 'white', fontSize: 25 }}
                                            badge={{
                                                value: item.score, badgeStyle: {
                                                    height: 30,
                                                    width: 40,
                                                    borderRadius: 25,
                                                    backgroundColor: '#e0d100'
                                                }, textStyle: {
                                                    color: 'black'
                                                }
                                            }}
                                        />
                                    ))
                                )}
                                {this.state.admin && (
                                    <Button
                                        title='Record Winners'
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
                                            this.props.navigation.navigate('CategoriesWin')
                                        }
                                    />
                                )}
                            </View>
                        )
                    }
                    {this.state.loading && (
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                            <ActivityIndicator
                                size='large'
                                color='#e0d100'
                            />
                        </View>
                    )}
                </ScrollView>
            </View>
        )
    }

}

export default Scoreboard