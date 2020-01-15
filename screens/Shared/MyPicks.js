import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';

class MyPicks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nominations: []
        }
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.getAllNominations();
        console.log(this.props)
    }

    getAllNominations = async () => {
        console.log('getAllNominations')
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
                console.log(res)
                this.setState({
                    nominations: res
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#fafafa' }}>
                <ScrollView>
                    <View style={{ display: 'flex', alignItems: 'center' }}>
                        {this.state.nominations.length !== 0 && (
                            this.state.nominations.map((item, i) => (
                                <ListItem
                                    containerStyle={{
                                        borderWidth: 1,
                                        width: '97%',
                                        backgroundColor: '#fff'
                                    }}
                                    key={i}
                                    title={item.category}
                                    chevron
                                    bottomDivider
                                    onPress={() => {this.props.navigation.navigate('PredictionPicker', item)}}
                                />
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
        )
    }

}

export default MyPicks