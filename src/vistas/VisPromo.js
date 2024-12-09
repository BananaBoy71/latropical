// src/vistas/VisPromo.js

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

const VisPromo = () => {
  const [vasosCompletados, setVasosCompletados] = useState(0);
  const [mensajePromocion, setMensajePromocion] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const usuario = firebase.auth().currentUser;

  useEffect(() => {
    const cargarProgreso = async () => {
      if (usuario) {
        try {
          const doc = await firebase.firestore().collection('usuarios').doc(usuario.uid).get();
          if (doc.exists) {
            const data = doc.data();
            setVasosCompletados(data.vasosCompletados || 0);
          } else {
            // Si el documento no existe, inicializamos vasosCompletados en 0
            await firebase.firestore().collection('usuarios').doc(usuario.uid).set({
              vasosCompletados: 0,
            });
            setVasosCompletados(0);
          }
        } catch (error) {
          console.error('Error al cargar el progreso:', error);
          Alert.alert('Error', 'No se pudo cargar tu progreso. Intenta nuevamente más tarde.');
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay usuario autenticado, redirigir a la pantalla de Login
        navigation.replace('VL');
      }
    };

    cargarProgreso();
  }, [usuario, navigation]);

  const manejarCompra = async () => {
    if (!usuario) {
      Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión nuevamente.');
      navigation.replace('VL');
      return;
    }

    try {
      let nuevoProgreso = vasosCompletados + 1;

      if (nuevoProgreso >= 10) {
        // El usuario ha completado la promoción
        Alert.alert(
          '¡Felicidades!',
          'Has completado la promoción. Tu próxima bebida es gratis.',
          [
            { text: 'OK', onPress: () => {} },
          ]
        );
        setMensajePromocion('¡Felicidades! Has conseguido tu bebida gratis.');
      } else {
        Alert.alert(
          'Compra Registrada',
          `¡Compra registrada! Te faltan ${10 - nuevoProgreso} compras para tu bebida gratis.`,
          [
            { text: 'OK', onPress: () => {} },
          ]
        );
        setMensajePromocion(''); // Limpiar el mensaje si existía
      }

      // Actualizar el progreso en Firestore
      await firebase.firestore().collection('usuarios').doc(usuario.uid).update({
        vasosCompletados: nuevoProgreso,
      });

      // Actualizar el estado local
      setVasosCompletados(nuevoProgreso);
      console.log('Vasos completados después de compra:', nuevoProgreso);
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      Alert.alert('Error', 'No se pudo registrar tu compra. Intenta nuevamente más tarde.');
    }
  };

  const manejarRecompensa = async () => {
    if (!usuario) {
      Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión nuevamente.');
      navigation.replace('VL');
      return;
    }

    try {
      // Calcular fecha de expiración (5 días desde ahora)
      const fechaExpiracion = firebase.firestore.Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));

      // Añadir una nueva recompensa a la colección 'Recompensas'
      await firebase.firestore().collection('Recompensas').add({
        userId: usuario.uid,
        email: usuario.email,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
        fechaExpiracion: fechaExpiracion,
      });

      // Reiniciar vasosCompletados a 0 en Firestore
      await firebase.firestore().collection('usuarios').doc(usuario.uid).update({
        vasosCompletados: 0,
      });

      // Actualizar el estado local
      setVasosCompletados(0);
      setMensajePromocion('¡Recompensa canjeada exitosamente!');
      console.log('Vasos completados después de canjear recompensa:', 0);

      Alert.alert(
        'Recompensa Canjeada',
        'Has reclamado tu bebida gratis. Visita Regalos para ver tus recompensas.',
        [
          { text: 'OK', onPress: () => navigation.navigate('Regalos') },
        ]
      );
    } catch (error) {
      console.error('Error al canjear la recompensa:', error);
      Alert.alert('Error', 'No se pudo canjear tu recompensa. Intenta nuevamente más tarde.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando tu progreso...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Contenedor de la tarjeta de promoción */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bebida Gratis</Text>
        <Text style={styles.cardSubtitle}>Compra 10 bebidas de 32 oz y obtén la 11ª gratis.</Text>

        {/* Mensaje dinámico */}
        {mensajePromocion !== '' && (
          <Text style={styles.mensajePromocion}>{mensajePromocion}</Text>
        )}

        {/* Vasos de progreso */}
        <View style={styles.vasosContainer}>
          <View style={styles.row}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < vasosCompletados ? 'beer' : 'beer-outline'}
                size={40}
                color={index < vasosCompletados ? '#4CAF50' : '#ccc'}
                style={styles.vasoIcon}
              />
            ))}
          </View>
          <View style={styles.row}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index + 5} // Asegura que las claves sean únicas
                name={(index + 5) < vasosCompletados ? 'beer' : 'beer-outline'}
                size={40}
                color={(index + 5) < vasosCompletados ? '#4CAF50' : '#ccc'}
                style={styles.vasoIcon}
              />
            ))}
          </View>
        </View>

        {/* Botón de registrar compra */}
        <TouchableOpacity style={styles.button} onPress={manejarCompra}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Registrar Compra</Text>
        </TouchableOpacity>

        {/* Botón para canjear la recompensa */}
        {vasosCompletados >= 10 && (
          <TouchableOpacity style={styles.recompensaButton} onPress={manejarRecompensa}>
            <Ionicons name="gift-outline" size={20} color="#fff" />
            <Text style={styles.recompensaButtonText}>Canjear Recompensa</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Botón pequeño para acceder a Tus Regalos */}
      <TouchableOpacity 
        style={styles.accessButton} 
        onPress={() => navigation.navigate('Regalos')}>
        <Ionicons name="gift-outline" size={20} color="#fff" />
        <Text style={styles.accessButtonText}>Tus Regalos</Text>
      </TouchableOpacity>

      {/* Botón para regresar */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Principal')}>
        <Ionicons name="arrow-back-outline" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VisPromo;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
    justifyContent: 'center',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 7,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  mensajePromocion: {
    fontSize: 18,
    color: '#d9534f',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  vasosContainer: {
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  vasoIcon: {
    margin: 5,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  recompensaButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 3,
  },
  recompensaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  accessButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
  },
  accessButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
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
