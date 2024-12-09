// src/vistas/VisUsuariosPerfil.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { firebase } from '../../Control/FireBase';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const VisUsuariosPerfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserData = useCallback(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const userRef = firebase.firestore().collection('usuarios').doc(user.uid);
      userRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const data = doc.data();
            console.log('Datos del usuario:', data); // Para depuración

            setUserData({
              nombre: data.nombre || '',
              apellido: data.apellido || '',
              email: data.email || data.correo || '',
              telefono: data.telefono || '',
              direccion: data.direccion || '',
              sexo: data.sexo || '',
              fotoURL: data.fotoURL || '',
            });
          } else {
            console.log('¡No existe el documento del usuario!');
            Alert.alert('Error', 'No se encontraron datos del usuario.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log('Error al obtener el documento:', error);
          Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
          setLoading(false);
        });
    } else {
      navigation.replace('VL');
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUserData();
    }, [fetchUserData])
  );

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('Usuario cerrado sesión');
        navigation.replace('VL'); // Navegar a la pantalla de Login
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
        Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se encontraron datos del usuario.</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Imagen de Perfil */}
      {userData.fotoURL ? (
        <Image source={{ uri: userData.fotoURL }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="person-circle-outline" size={100} color="#888" />
        </View>
      )}

      {/* Información del Usuario */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Nombre: {userData.nombre || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-add-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Apellido: {userData.apellido || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Correo: {userData.email || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Teléfono: {userData.telefono || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Dirección: {userData.direccion || 'No especificado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="male-female-outline" size={24} color="#555" style={styles.infoIcon} />
          <Text style={styles.infoText}>Sexo: {userData.sexo || 'No especificado'}</Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('VisEditarPerfilUsuarios')}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VisUsuariosPerfil;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#555',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 10,
  },
});
