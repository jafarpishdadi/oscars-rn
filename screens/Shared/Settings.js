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
            inputFocused: false,
            deleteAccountModal: false,
            resetPredictionsModal: false,
            logoutModal: false
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

    logout = async () => {
        await AsyncStorage.multiRemove(['firstName', 'lastName', 'email', 'password', 'score', 'id']);
        this.props.navigation.navigate('FirstLoad')
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', backgroundColor: '#262626' }}>
                {this.state.isVisible && (
                    <Overlay
                        isVisible
                        onBackdropPress={() => {
                            switch (this.state.inputFocused) {
                                case false:
                                    return this.setState({ isVisible: false, changeNameModal: false, resetPredictionsModal: false, logoutModal: false, deleteAccountModal: false })
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
                        {this.state.changeNameModal && (
                            <View style={{ display: 'flex', flex: 1 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 25, paddingBottom: 10 }}>Change Name</Text>
                                </View>
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
                                            this.setState({
                                                isVisible: false,
                                                changeNameModal: false
                                            });
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
                        )}
                        {this.state.resetPredictionsModal && (
                            <View style={{ display: 'flex', flex: 1 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 25, paddingBottom: 10 }}>Reset Predictions</Text>
                                    <Text style={{ color: 'white', fontSize: 20, paddingBottom: 10, textAlign: 'center' }}>Are you sure you want to reset your predictions? This will permanantly delete all of your current predictions.</Text>
                                </View>
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
                                            this.setState({
                                                isVisible: false,
                                                resetPredictionsModal: false
                                            });
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
                                        title='Continue'
                                        onPress={() => this.determineComplete(this.state.overlayInfo.type)}
                                    />
                                </View>
                            </View>
                        )}
                        {this.state.logoutModal && (
                            <View style={{ display: 'flex', flex: 1 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 25, paddingBottom: 10 }}>Log Out</Text>
                                    <Text style={{ color: 'white', fontSize: 20, paddingBottom: 10, textAlign: 'center' }}>Are you sure you want to log out?</Text>
                                </View>
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
                                            this.setState({
                                                isVisible: false,
                                                logoutModal: false
                                            });
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
                                        title='Continue'
                                        onPress={() => this.logout()}
                                    />
                                </View>
                            </View>
                        )}
                        {this.state.deleteAccountModal && (
                            <View style={{ display: 'flex', flex: 1 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: '#f44336', fontSize: 25, paddingBottom: 10 }}>Delete Account</Text>
                                    <Text style={{ color: 'white', fontSize: 20, paddingBottom: 10, textAlign: 'center' }}>Are you sure you want to delete your account? This action is permanant and cannot be undone.</Text>
                                </View>
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
                                            backgroundColor: '#06D6A0',
                                            borderRadius: 30
                                        }}
                                        title='Cancel'
                                        onPress={() => {
                                            this.setState({
                                                isVisible: false,
                                                deleteAccountModal: false
                                            });;
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
                                            backgroundColor: '#f44336',
                                            borderRadius: 30
                                        }}
                                        title='Delete'
                                        onPress={() => this.determineComplete(this.state.overlayInfo.type)}
                                    />
                                </View>
                            </View>
                        )}

                    </Overlay>
                )}
                {!this.state.loading && (
                    <View>
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 30 }}>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() => { this.setState({ isVisible: true, changeNameModal: true }) }}>Change Name</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }} onPress={() => { this.setState({ isVisible: true, resetPredictionsModal: true }) }}>Reset Predictions</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }} onPress={() => { this.setState({ isVisible: true, logoutModal: true }) }}>Log Out</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}></Text>
                        <Text style={{ color: '#ff2e2e', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }} onPress={() => { this.setState({ isVisible: true, deleteAccountModal: true }) }}>Delete Account</Text>
                    </View>

                )}
            </View>
        )
    }

}

export default Settings