//app.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './navigation/AuthStack';
import HomeScreen from './screens/HomeScreen';
import Sender from './screens/Sender';
import Receiver from './screens/Receiver';
import { auth } from './config/firebase';
import SignUpScreen from './screens/SignUpScreen';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return null; // Or show a loading spinner
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Sender" component={Sender} />
                        <Stack.Screen name="Receiver" component={Receiver} />

                    </>
                ) : (
                    <>
                    <Stack.Screen name="Auth" component={AuthStack} />
                    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
    
}
