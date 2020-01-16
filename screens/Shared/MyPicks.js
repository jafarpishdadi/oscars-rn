import React, { Component } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"

class MyPicks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nominations: [],
            loading: true
        }
    }

    componentDidMount() {
        this.getAllNominations();
    }

    getAllNominations = async () => {
        this.setState({ loading: true });
        try {
            let response = await fetch('https://oscars-picks-api.herokuapp.com/nominations', {
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
                    nominations: res,
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
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>My Picks</Text>
                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Pick a category, then drag and drop nominees in order of most likely to least likely</Text>
                    </View>
                    {
                        !this.state.loading && (
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                                {this.state.nominations.length !== 0 && (
                                    this.state.nominations.map((item, i) => (
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
                                            onPress={() => { this.props.navigation.navigate('PredictionPicker', item) }}
                                        />
                                    ))
                                )}
                            </View>
                        )
                    }

                    {
                        this.state.loading && (
                            <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
                                <ActivityIndicator
                                    size='large'
                                    color='#e0d100'
                                />
                            </View>

                        )
                    }

                </ScrollView>
            </View>
        )
    }

}

export default MyPicks