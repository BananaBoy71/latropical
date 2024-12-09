// src/vistas/VisConsultaClientes.js

import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  FlatList 
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const VisConsultaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  const mostrarClientes = async () => {
    try {
      setCargando(true);
      const rsClientes = [];
      const querySnapshot = await conexion.collection('Clientes').get();
      querySnapshot.forEach((doc) => {
        const { nombre, email, telefono, direccion } = doc.data();
        rsClientes.push({
          id: doc.id,
          nombre,
          email,
          telefono,
          direccion,
        });
      });
      setClientes(rsClientes);
      console.log('Clientes obtenidos:', rsClientes); // Para depuración
    } catch (e) {
      Alert.alert('Error', 'Mensaje: ' + e.message);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', mostrarClientes);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={styles.listItem}
      onPress={() => {
        console.log('ID del cliente seleccionado:', item.id);
        navigation.navigate('EditarClientes', {
          id: item.id,
        });
      }}
    >
      <Avatar
        rounded
        title={item.nombre.charAt(0).toUpperCase()}
        size="medium"
        overlayContainerStyle={{ backgroundColor: '#4CAF50' }}
        source={{ uri: 'https://via.placeholder.com/150' }} // Cambia la URL por una imagen real si la tienes
      />
      <ListItem.Content>
        <ListItem.Title style={styles.clientName}>{item.nombre}</ListItem.Title>
        <ListItem.Subtitle style={styles.clientEmail}>{item.email}</ListItem.Subtitle>
        <Text style={styles.clientTelefono}>Teléfono: {item.telefono}</Text>
        <Text style={styles.clientDireccion}>Dirección: {item.direccion}</Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón "Agregar Cliente" centrado */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AltaClientes')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Agregar Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar indicador de carga mientras se obtienen los datos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noClientsText}>No hay clientes registrados.</Text>}
        />
      )}
    </View>
  );
};

export default VisConsultaClientes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  buttonContainer: {
    alignItems: 'center', // Centra el botón
    marginTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50', // Verde
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  loader: {
    marginTop: 50,
  },
  listContainer: {
    padding: 10,
  },
  noClientsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  clientEmail: {
    fontSize: 14,
    color: '#666',
  },
  clientTelefono: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  clientDireccion: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
