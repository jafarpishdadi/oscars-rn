import React, { Component } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

class Categories extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: this.props.navigation.state.params,
            predictions: [],
            loading: true
        }
    }

    static navigationOptions = {
        title: `Categories`,
        headerStyle: {
            backgroundColor: '#262626'
        },
        headerTintColor: 'white'
    }

    componentDidMount() {
        this.getPredictionsByUser();
    }

    getPredictionsByUser = async () => {
        this.setState({ loading: true });
        searchParams = JSON.stringify({
            user: this.state.user.firstName
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
            if (!res) {
                console.log('No response when trying to fetch all nominations')
            } else {
                this.setState({
                    predictions: res,
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
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>{this.state.user.firstName}'s Picks</Text>
                        {
                            this.state.predictions.length > 0 && !this.state.loading && (
                                <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Pick a category to see {this.state.user.firstName}'s predictions.</Text>
                            )
                        }
                        {
                            this.state.predictions.length === 0 && !this.state.loading && (
                                <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>{this.state.user.firstName} has not made any predictions yet. Pester them until they do.</Text>
                            )
                        }
                    </View>
                    {
                        !this.state.loading && (
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                                {this.state.predictions.length !== 0 && (
                                    this.state.predictions.map((item, i) => (
                                        <ListItem
                                            containerStyle={{
                                                borderWidth: 1,
                                                width: '97%',
                                                backgroundColor: '#fff',
                                                borderRadius: 10,
                                                marginBottom: 10
                                            }}
                                            key={i}
                                            title={item.category}
                                            rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
                                        // onPress={() => { this.props.navigation.navigate('Categories', item) }}
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

export default Categories