//Sender.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import uuid from 'react-native-uuid';

export default function Sender({ navigation }) {
  const [uniqueCode, setUniqueCode] = useState(uuid.v4());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error fetching location');
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const updateLocationInFirestore = async () => {
      if (location) {
        try {
          if (!auth.currentUser) {
            console.error('No user is logged in.');
            setErrorMsg('No user is logged in.');
            return;
          }

          const userRef = doc(db, 'users', auth.currentUser.uid);

          // Check if the document exists
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            // Create the document if it doesn't exist
            await setDoc(userRef, { sharedLocations: [] });
          }

          // Update the document with the new location
          await updateDoc(userRef, {
            sharedLocations: arrayUnion({
              code: uniqueCode,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: new Date(),
            }),
          });
        } catch (error) {
          console.error('Error saving location: ', error);
          setErrorMsg('Error saving location');
        }
      }
    };

    updateLocationInFirestore();
  }, [location]);

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      Linking.openURL(url).catch((err) => console.error('Error opening Google Maps', err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your unique code: {uniqueCode}</Text>
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
              } catch (error) {
                setErrorMsg('Error refreshing location');
              }
            }}
          >
            <Text style={styles.buttonText}>Refresh Location</Text>
          </TouchableOpacity>
          {location && (
            <TouchableOpacity style={styles.button} onPress={openInGoogleMaps}>
              <Text style={styles.buttonText}>Open in Google Maps</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4682b4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#b22222',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});
