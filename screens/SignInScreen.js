//signinscreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate('Home'); // Navigate to Home on successful sign-in
        } catch (error) {
            setError(translateError(error.code)); // Handle error and display user-friendly messages
        }
    };

    const translateError = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/invalid-email':
                return 'Invalid email format.';
            default:
                return 'An error occurred. Please try again.';
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Sign In" onPress={handleSignIn} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate('SignUpScreen')}
            >
                <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    signupButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    signupText: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default SignInScreen;
