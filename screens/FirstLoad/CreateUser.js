import React, { Component } from 'react';
import { View, Text, ScrollView, AsyncStorage } from 'react-native';
import { Button, Input } from 'react-native-elements';
import bcrypt from 'react-native-bcrypt';

class CreateUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password1: '',
            password2: '',
            hashedPassword: '',
            score: 0,
            errors: {
                accountExists: false,
                passwordsDontMatch: false,
                incomplete: false
            },
            loading: false
        }
    }

    checkIncomplete() {
        this.setState({ loading: true })
        if (this.state.firstName === '' ||
            this.state.lastName === '' ||
            this.state.email === '' ||
            this.state.password1 === '' ||
            this.state.password2 === '') {
            this.setState({
                errors: {
                    incomplete: true
                }
            })
        } else {
            this.doesUserExist();
        }
    }

    doesUserExist = async () => {
        this.setState({ loading: true })
        let searchParams = JSON.stringify({
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
            let res = await response.json();
            if (res.length === 0) {
                this.validateAndHashPassword();
            } else {
                this.setState({ errors: { accountExists: true } })
            }
        } catch (err) {
            console.log(err)
        }
    }

    validateAndHashPassword() {
        if (this.state.password1 === this.state.password2) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(this.state.password1, salt, (err, hash) => {
                    this.setState({ hashedPassword: hash });
                    this.createUser();
                })
            })
        } else {
            this.setState({ errors: { passwordsDontMatch: true } })
        }
    }

    createUser = async () => {
        this.setState({ loading: true })
        try {
            let response = await fetch('https://oscars-picks-api.herokuapp.com/users', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.hashedPassword,
                    score: this.state.score
                })
            })
            let res = await response.json();
            if (res.errors) {
                this.setState({ errors: res.errors })
            } else {
                this.saveUserInfo();
            }
            this.setState({ loading: false })
        } catch (err) {
            console.log(err)
        }
    }

    saveUserInfo = async () => {
        try {
            await AsyncStorage.multiSet([
                ['firstName', this.state.firstName],
                ['lastName', this.state.lastName],
                ['email', this.state.email],
                ['score', this.state.score.toString()],
                ['id', this.state._id]
            ], (e) => {
                global.firstName = this.state.firstName;
                global.lastName = this.state.lastName;
                global.email = this.state.email;
                global.score = this.state.score;
                global.id = this.state.id;
                this.setState({ loading: false })
                this.props.navigation.navigate('Rules')
            })
        } catch (err) {
            console.log(err)
        }
    }

    resetErrors() {
        this.setState({
            errors: {
                accountCreated: false,
                passwordsDontMatch: false,
                incomplete: false
            }
        })
    }

    render() {
        return (
            <View style={{ height: '100%', width: '100%', display: 'flex', backgroundColor: '#262626' }}>
                <ScrollView>
                    <View style={{ display: 'flex', alignItems: 'center', flex: 1, paddingTop: 50 }}>
                        <Text style={{ paddingBottom: 50, fontSize: 30, color: 'white' }}>Let's Get Started</Text>
                        <Input
                            placeholder='First Name'
                            placeholderTextColor='white'
                            onChangeText={(firstName) => {
                                this.setState({ firstName });
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
                            placeholder='Last Name'
                            placeholderTextColor='white'
                            onChangeText={(lastName) => {
                                this.setState({ lastName });
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
                            onChangeText={(password1) => {
                                this.setState({ password1 });
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
                            placeholder='Confirm Password'
                            placeholderTextColor='white'
                            secureTextEntry={true}
                            onChangeText={(password2) => {
                                this.setState({ password2 });
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
                        <View style={{ height: 75, display: 'flex', alignItems: 'center' }}>
                            {this.state.errors.incomplete &&
                                (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#f44336' }}>Please complete all fields</Text>
                                    </View>
                                )
                            }
                            {this.state.errors.passwordsDontMatch &&
                                (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#f44336' }}>Please ensure your passwords match.</Text>
                                    </View>
                                )
                            }
                            {this.state.errors.accountExists &&
                                (
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ color: '#f44336' }}>User account already exists.</Text>
                                        <Text style={{ color: '#f44336' }}>Please use a different email and password.</Text>
                                    </View>
                                )
                            }
                        </View>

                    </View>
                    <Button
                        title='Next'
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
                        onPress={() =>
                            this.checkIncomplete()
                        }
                        disabled={this.state.loading}
                    />
                </ScrollView>
            </View>
        )
    }
}

export default CreateUser