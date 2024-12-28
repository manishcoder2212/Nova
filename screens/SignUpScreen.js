//signipscreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (password.length < 6) {
            setError('Password should be at least 6 characters.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('Sign In');
        } catch (error) {
            console.error("Sign up error: ", error); // Logs the exact error
            setError(translateError(error.code));
        }
    };

    const translateError = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'The email address is not valid.';
            case 'auth/weak-password':
                return 'The password should be at least 6 characters.';
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            default:
                return 'An unknown error occurred. Please try again.';
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default SignUpScreen;
