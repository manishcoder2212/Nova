//Homescreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const HomeScreen = ({ navigation }) => { // Destructure navigation from props
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        if (auth.currentUser) {
            setUserEmail(auth.currentUser.email);
        }
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("You have successfully signed out.");
        } catch (error) {
            alert("Error signing out. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome, {userEmail}</Text>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Sender')} // Navigate to Sender screen
            >
                <Text style={styles.buttonText}>Sender</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Receiver')} // Navigate to Receiver screen
            >
                <Text style={styles.buttonText}>Receiver</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.signOutButton} 
                onPress={handleSignOut}
            >
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, 
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    signOutButton: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
