//receiver.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export default function Receiver({ navigation }) {
  const [code, setCode] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchLocationFromFirestore = async () => {
    try {
      if (!auth.currentUser) {
        console.error('No user is logged in.');
        setErrorMsg('No user is logged in.');
        return;
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const sharedLocation = data.sharedLocations.find((loc) => loc.code === code);

        if (sharedLocation) {
          setLocation(sharedLocation);
          setErrorMsg(null);
        } else {
          setErrorMsg('Invalid code or location not found.');
        }
      } else {
        setErrorMsg('User document not found.');
      }
    } catch (error) {
      console.error('Error fetching location: ', error);
      setErrorMsg('Error fetching location.');
    }
  };

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      Linking.openURL(url).catch((err) => console.error('Error opening Google Maps', err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Code to Fetch Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter unique code"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity style={styles.button} onPress={fetchLocationFromFirestore}>
        <Text style={styles.buttonText}>Fetch Location</Text>
      </TouchableOpacity>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      {location && (
        <>
          <Text style={styles.locationText}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
          <TouchableOpacity style={styles.button} onPress={openInGoogleMaps}>
            <Text style={styles.buttonText}>Open in Google Maps</Text>
          </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    marginBottom: 20,
    backgroundColor: '#fff',
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
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
});
