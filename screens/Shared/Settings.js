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
        asyncUserInfo = await AsyncStorage.multiGet(['firstName', 'lastName', 'email', 'password', 'score', 'id', 'admin']);
        let userInfo = {};
        asyncUserInfo.forEach(property => {
            userInfo[property[0]] = property[1];
        });
        this.setState({ userInfo: userInfo, newUserInfo: userInfo, loading: false });
    }

    setUserInfo = async () => {
        try {
            await AsyncStorage.multiSet([
                ['firstName', this.state.userInfo.firstName],
                ['lastName', this.state.userInfo.lastName],
                ['email', this.state.userInfo.email],
                ['password', this.state.userInfo.password],
                ['score', this.state.userInfo.score],
                ['id', this.state.userInfo.id]
            ], (e) => {
                this.setState({ loading: false })
            })
        } catch (err) {
            console.log(err)
        }
    }

    updateUserInfo = async () => {
        this.setState({ loading: true })
        this.closeModal();
        try {
            console.log(this.state.newUserInfo.score)
            let response = await fetch(`https://oscars-picks-api.herokuapp.com/users/${this.state.userInfo.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: this.state.newUserInfo.firstName,
                    lastName: this.state.newUserInfo.lastName,
                    email: this.state.newUserInfo.email,
                    password: this.state.newUserInfo.password,
                    score: parseInt(this.state.newUserInfo.score),
                    admin: this.state.newUserInfo.admin
                })
            })
            let res = await response.json()
            if (res) {
                this.setState({
                    userInfo: {
                        firstName: res.firstName,
                        lastName: res.lastName,
                        email: res.email,
                        password: res.password,
                        score: res.score.toString(),
                        id: res._id,
                        admin: res.admin
                    },
                    newUserInfo: {
                        firstName: res.firstName,
                        lastName: res.lastName,
                        email: res.email,
                        password: res.password,
                        score: res.score.toString(),
                        id: res._id,
                        admin: res.admin
                    }
                })
                this.setUserInfo();
            } else {
                console.log('There was a problem updating the user')
                this.setState({ loading: false })
            }
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    deleteUser = async () => {
        this.setState({ loading: true })
        try {
            let response = await fetch(`https://oscars-picks-api.herokuapp.com/users/${this.state.userInfo.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let res = await response.json()
            if (!res) {
                console.log('There was an issue deleting user')
            }
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    deletePredictions = async () => {
        try {
            let searchParams = JSON.stringify({
                user: this.state.newUserInfo.id
            })
            let response = await fetch(`https://oscars-picks-api.herokuapp.com/predictions/${searchParams}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let res = await response.json()
            if (!res) {
                console.log('There was an issue deleting predictions')
            }
            this.setState({
                loading: false
            })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    deleteAccount() {
        this.deleteUser()
            .then(() => {
                this.deletePredictions()
                    .then(() => {
                        AsyncStorage.clear()
                            .then(() => {
                                this.setState({ loading: false })
                                this.props.navigation.navigate('FirstLoad')
                            })
                    })
            })
    }

    resetPredictions() {
        this.setState({
            userInfo: {
                firstName: this.state.userInfo.firstName,
                lastName: this.state.userInfo.lastName,
                email: this.state.userInfo.email,
                password: this.state.userInfo.password,
                score: '0',
                id: this.state.userInfo.id,
                admin: this.state.userInfo.admin
            },
            newUserInfo: {
                firstName: this.state.newUserInfo.firstName,
                lastName: this.state.newUserInfo.lastName,
                email: this.state.newUserInfo.email,
                password: this.state.newUserInfo.password,
                score: '0',
                id: this.state.newUserInfo.id,
                admin: this.state.newUserInfo.admin
            }
        }, () => {
            this.updateUserInfo()
                .then(() => {
                    this.deletePredictions()
                })
        })
    }

    logout = async () => {
        await AsyncStorage.multiRemove(['firstName', 'lastName', 'email', 'password', 'score', 'id']);
        this.props.navigation.navigate('FirstLoad')
    }

    closeModal() {
        this.setState({
            isVisible: false,
            changeNameModal: false,
            resetPredictionsModal: false,
            logoutModal: false,
            deleteAccountModal: false,
            inputFocused: false
        })
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
                                    return this.closeModal();
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
                                        this.setState({
                                            newUserInfo: {
                                                firstName: firstName,
                                                lastName: this.state.newUserInfo.lastName,
                                                email: this.state.newUserInfo.email,
                                                password: this.state.newUserInfo.password,
                                                score: this.state.newUserInfo.score
                                            }
                                        });
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
                                        this.setState({
                                            newUserInfo: {
                                                firstName: this.state.newUserInfo.firstName,
                                                lastName: lastName,
                                                email: this.state.newUserInfo.email,
                                                password: this.state.newUserInfo.password,
                                                score: this.state.newUserInfo.score
                                            }
                                        });
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
                                        onPress={() => this.updateUserInfo()}
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
                                        onPress={() => this.resetPredictions()}
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
                                        onPress={() => this.deleteAccount()}
                                    />
                                </View>
                            </View>
                        )}

                    </Overlay>
                )}
                {!this.state.loading && (
                    <View>
                        <Text style={{ color: 'white', fontSize: 30, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 30 }}>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15 }} onPress={() => { this.props.navigation.navigate('NotFirstLoadRules') }}>Read Rules</Text>
                        <Text style={{ color: '#e0d100', fontSize: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 10 }} onPress={() => { this.setState({ isVisible: true, changeNameModal: true }) }}>Change Name</Text>
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