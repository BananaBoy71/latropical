// src/vistas/VisLogin.js

import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { firebase } from '../../Control/FireBase'; // Asegúrate de que la ruta sea correcta
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const VisLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Listener para manejar la sesión del usuario
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('NA'); // Navega a la aplicación principal si el usuario está autenticado
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Validación básica del correo electrónico
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email.trim(), password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);

        // Agregar datos iniciales del usuario a Firestore con campos vacíos adicionales
        firebase
          .firestore()
          .collection('usuarios')
          .doc(user.uid)
          .set({
            nombre: '',
            apellido: '',
            email: email.trim(),
            telefono: '',
            direccion: '',
            sexo: '',
            fotoURL: '',
          })
          .then(() => {
            console.log('Usuario registrado en Firestore');
            // No navegar aquí, dejar que el listener maneje la navegación
          })
          .catch((error) => {
            console.error('Error al registrar usuario en Firestore:', error);
            Alert.alert('Error', 'No se pudo registrar el usuario en la base de datos.');
          });
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', error.message);
      });
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(email.trim(), password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        // No navegar aquí, dejar que el listener maneje la navegación
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo */}
      <Image source={require('../imagenes/LaTropical.jpg')} style={styles.logo} />
      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Ionicons name="log-in-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Ionicons name="person-add-outline" size={20} color="#4CAF50" />
          <Text style={styles.buttonOutlineText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
};

export default VisLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 10,
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonOutlineText: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 10,
  },
});
