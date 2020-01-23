import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Input, Button } from 'react-native-elements';
import bcrypt from 'react-native-bcrypt';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            errors: {
                incompleteFields: false,
                incorrectPassword: false,
                userNotFound: false
            },
            firstName: '',
            lastName: '',
            hashedPassword: '',
            id: '',
            score: 0
        }
    }

    login = async () => {
        if (this.state.email !== '' && this.state.password !== '') {
            this.setState({ loading: true });
            const searchParams = JSON.stringify({
                email: this.state.email
            })
            try {
                let response = await fetch(`https://oscars-picks-api.herokuapp.com/users/${searchParams}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                let resp = await response.json();
                if (!resp) {
                    console.log('No response when trying to get user')
                } else {
                    if (resp.length > 0) {
                        bcrypt.compare(this.state.password, resp[0].password, (err, res) => {
                            if (res === true) {
                                this.setState({
                                    firstName: resp[0].firstName,
                                    lastName: resp[0].lastName,
                                    password: resp[0].password,
                                    score: resp[0].score,
                                    id: resp[0]._id
                                })
                                this.saveUserInfo();
                            } else {
                                this.setState({ errors: { incorrectPassword: true }, loading: false })
                            }
                        })
                    } else {
                        this.setState({ errors: { userNotFound: true }, loading: false })
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            this.setState({ errors: { incompleteFields: true }, loading: false })
        }
    }

    saveUserInfo = async () => {
        try {
            await AsyncStorage.multiSet([
                ['firstName', this.state.firstName],
                ['lastName', this.state.lastName],
                ['email', this.state.email],
                ['password', this.state.hashedPassword],
                ['score', this.state.score.toString()],
                ['id', this.state.id]
            ], (e) => {
                this.setState({ loading: false })
                this.props.navigation.navigate('NotFirstLoad')
            })
        } catch (err) {
            console.log(err)
        }
    }

    resetErrors() {
        this.setState({
            errors: {
                incompleteFields: false,
                incorrectPassword: false,
                userNotFound: false
            }
        })
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', display: 'flex', backgroundColor: '#262626' }}>
                <View style={{ display: 'flex', alignItems: 'center', flex: 1, paddingTop: 50 }}>
                    <Text style={{ paddingBottom: 50, fontSize: 30, color: 'white' }}>Log In</Text>
                    <Input
                        placeholder='Email'
                        placeholderTextColor='white'
                        keyboardType='email-address'
                        onChangeText={(email) => {
                            this.setState({ email });
                            this.resetErrors();
                        }}
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
                        placeholder='Password'
                        placeholderTextColor='white'
                        secureTextEntry={true}
                        onChangeText={(password) => {
                            this.setState({ password });
                            this.resetErrors();
                        }}
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
                    <View style={{ height: 60, display: 'flex', alignItems: 'center' }}>
                        {this.state.errors.incompleteFields && (
                            <Text style={{ color: '#f44336' }}>Please complete all fields</Text>
                        )}
                        {this.state.errors.incorrectPassword && (
                            <Text style={{ color: '#f44336' }}>Your password was incorrect. Please try again.</Text>
                        )}
                        {this.state.errors.userNotFound && (
                            <Text style={{ color: '#f44336' }}>Account not found. Try again or create a new account.</Text>
                        )}
                    </View>

                    <Button
                        title='Continue'
                        containerStyle={{
                            width: '95%',
                            alignSelf: 'flex-end',
                            borderRadius: 30,
                            paddingBottom: 30
                        }}
                        titleStyle={{
                            color: 'black'
                        }}
                        buttonStyle={{
                            width: '95%',
                            backgroundColor: '#39f52c',
                            borderRadius: 30
                        }}
                        disabled={this.state.loading}
                        onPress={() =>
                            this.login()
                        }
                    />
                </View>
            </View>
        )
    }
}

export default Login