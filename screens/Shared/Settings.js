import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';

const firstNameInput = React.createRef();
const lastNameInput = React.createRef();

class Settings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            isVisible: false,
            changeNameModal: false,
            inputFocused: false
        }
    }

    componentDidMount() {
        this.getUserInfo()
    }

    getUserInfo = async () => {
        this.setState({ loading: true });
        asyncUserInfo = await AsyncStorage.multiGet(['firstName', 'lastName', 'email', 'password', 'score', 'id']);
        let userInfo = {};
        asyncUserInfo.forEach(property => {
            userInfo[property[0]] = property[1];
        });
        this.setState({ userInfo: userInfo, newUserInfo: userInfo, loading: false });
    }

    backdropPressed() {

    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                {this.state.isVisible && this.state.changeNameModal && (
                    <Overlay
                        isVisible
                        onBackdropPress={() => {
                            switch (this.state.inputFocused) {
                                case false:
                                    return this.setState({ isVisible: false, changeNameModal: false })
                                case 'firstName':
                                    return firstNameInput.current.blur();
                                case 'lastName':
                                    return lastNameInput.current.blur();
                            }
                        }}
                        width={350}
                        height={275}
                        overlayStyle={{ borderRadius: 15, backgroundColor: '#404040' }}
                    >
                        <View style={{ display: 'flex', flex: 1 }}>
                            <Input
                                ref={firstNameInput}
                                placeholder='First Name'
                                placeholderTextColor='white'
                                value={this.state.newUserInfo.firstName}
                                onChangeText={(firstName) => {
                                    this.setState({ newUserInfo: { firstName: firstName } });
                                }}
                                onFocus={() => { this.setState({ inputFocused: 'firstName' }) }}
                                onBlur={() => { this.setState({ inputFocused: false }) }}
                                inputContainerStyle={{
                                    borderBottomColor: '#e0d100'
                                }}
                                inputStyle={{
                                    fontSize: 18,
                                    color: 'white'
                                }}
                                containerStyle={{
                                    paddingBottom: 20
                                }}
                            />
                            <Input
                                ref={lastNameInput}
                                placeholder='Last Name'
                                placeholderTextColor='white'
                                onChangeText={(lastName) => {
                                    this.setState({ newUserInfo: { lastName: lastName } });
                                }}
                                onFocus={() => { this.setState({ inputFocused: 'lastName' }) }}
                                onBlur={() => { this.setState({ inputFocused: false }) }}
                                value={this.state.newUserInfo.lastName}
                                inputContainerStyle={{
                                    borderBottomColor: '#e0d100'
                                }}
                                inputStyle={{
                                    fontSize: 18,
                                    color: 'white'
                                }}
                                containerStyle={{
                                    paddingBottom: 20
                                }}
                            />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Button
                                    containerStyle={{
                                        width: 150,
                                        marginLeft: 3,
                                        marginRight: 2,
                                        alignSelf: 'flex-end',
                                        borderRadius: 15
                                    }}
                                    buttonStyle={{
                                        backgroundColor: '#f44336',
                                        borderRadius: 30
                                    }}
                                    title='Cancel'
                                    onPress={() => {
                                        this.deleteItem();
                                    }
                                    }
                                />
                                <Button
                                    containerStyle={{
                                        width: 150,
                                        marginLeft: 2,
                                        marginRight: 3,
                                        alignSelf: 'flex-end',
                                        borderRadius: 30
                                    }}
                                    buttonStyle={{
                                        backgroundColor: '#06D6A0',
                                        borderRadius: 30
                                    }}
                                    title='Save'
                                    onPress={() => this.determineComplete(this.state.overlayInfo.type)}
                                />
                            </View>
                        </View>
                    </Overlay>
                )}
                {!this.state.loading && (
                    <View>
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 30 }}>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() => { this.setState({ isVisible: true, changeNameModal: true }) }}>Change Name</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>Reset Predictions</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>Log Out</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}></Text>
                        <Text style={{ color: '#ff2e2e', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>Delete Account</Text>
                    </View>

                )}
            </View>
        )
    }

}

export default Settings