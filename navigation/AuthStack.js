// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Sender from '../screens/Sender';
import Receiver from '../screens/Receiver';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator>
           
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
            <Stack.Screen name='Sender' component={Sender}/>
            <Stack.Screen name='Receiver' component={Receiver}/>
        </Stack.Navigator>
    );
};

export default AuthStack;