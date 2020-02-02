import React, { Component } from 'react'
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

class CategoriesWin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.getNominations();
    }
    
    getNominations = async () => {
        this.setState({ loading: true })
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
                const filteredNoms = res.filter(nom => !nom.complete)
                this.setState({
                    nominations: filteredNoms,
                    loading: false
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                {this.state.loading && (
                    <View style={{ display: 'flex', width: '100%', height: '75%', justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <ActivityIndicator
                            size='large'
                            color='#e0d100'
                        />
                    </View>
                )}
                {!this.state.loading &&
                    (
                        <ScrollView>
                            <View>
                                <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Categories</Text>
                                {
                                    this.state.nominations.length > 0 &&
                                    (
                                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>Pick a category record a winner</Text>
                                    )
                                }
                                {
                                    this.state.nominations.length === 0 &&
                                    (
                                        <Text style={{ color: 'white', fontSize: 20, paddingLeft: 15, paddingRight: 15, paddingTop: 30 }}>All categories recorded!</Text>
                                    )
                                }
                            </View>
                            <View style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                                {
                                    this.state.nominations.length !== 0 &&
                                    (
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
                                                onPress={() => { this.props.navigation.navigate('WinnerSelect', item) }}
                                            />
                                        ))
                                    )
                                }
                            </View>
                        </ScrollView>
                    )
                }
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

export default CategoriesWin