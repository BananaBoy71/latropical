// src/vistas/Regalos.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../../Control/FireBase';
import { useNavigation } from '@react-navigation/native';

const Regalos = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const usuario = firebase.auth().currentUser;

  useEffect(() => {
    if (usuario) {
      const ahora = firebase.firestore.Timestamp.now();

      const unsubscribe = firebase.firestore()
        .collection('Recompensas')
        .where('userId', '==', usuario.uid)
        .where('fechaExpiracion', '>', ahora)
        .orderBy('fechaExpiracion', 'desc')
        .onSnapshot(
          snapshot => {
            const recompensasData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setRecompensas(recompensasData);
            setLoading(false);
          },
          error => {
            console.error('Error al cargar recompensas:', error);
            Alert.alert('Error', 'No se pudieron cargar tus recompensas. Intenta nuevamente más tarde.');
            setLoading(false);
          }
        );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      // Si no hay usuario autenticado, redirigir a la pantalla de Login
      navigation.replace('VL');
    }
  }, [usuario, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando tus recompensas...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="gift-outline" size={40} color="#FF9800" />
      </View>

      {recompensas.length === 0 ? (
        <Text style={styles.noRecompensasText}>No tienes recompensas aún.</Text>
      ) : (
        recompensas.map(recompensa => (
          <View key={recompensa.id} style={styles.recompensaCard}>
            <Ionicons name="beer-outline" size={30} color="#4CAF50" />
            <View style={styles.recompensaInfo}>
              <Text style={styles.recompensaTexto}>Bebida Gratis</Text>
              <Text style={styles.recompensaFecha}>
                Fecha de Expiración: {recompensa.fechaExpiracion?.toDate().toLocaleDateString([], { dateStyle: 'medium' }) || 'No disponible'}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Botón para regresar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('VisPromo')}>
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Regalos;

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
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  noRecompensasText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  recompensaCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recompensaInfo: {
    marginLeft: 15,
  },
  recompensaTexto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  recompensaFecha: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  backButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});
