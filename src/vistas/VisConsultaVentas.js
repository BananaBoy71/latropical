// src/vistas/VisConsultaVentas.js

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
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { useNavigation } from '@react-navigation/native';

const VisConsultaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  const mostrarVentas = async () => {
    try {
      setCargando(true);
      const rsVentas = [];
      const querySnapshot = await conexion.collection('Ventas').get();
      querySnapshot.forEach((doc) => {
        const { producto, cantidad, precio, fechaVenta } = doc.data();
        rsVentas.push({
          id: doc.id,
          producto,
          cantidad,
          precio,
          fechaVenta,
        });
      });
      setVentas(rsVentas);
    } catch (e) {
      Alert.alert('Error', 'Mensaje: ' + e.message);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', mostrarVentas);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={styles.listItem}
      onPress={() => {
        console.log('ID de la venta seleccionada:', item.id);
        navigation.navigate('EditarVentas', { id: item.id });
      }}
    >
      <Avatar
        rounded
        title={item.producto.charAt(0).toUpperCase()}
        size="medium"
        overlayContainerStyle={{ backgroundColor: '#4CAF50' }}
        source={{ uri: 'https://via.placeholder.com/150' }} // Cambia la URL por una imagen real si la tienes
      />
      <ListItem.Content>
        <ListItem.Title style={styles.productName}>{item.producto}</ListItem.Title>
        <ListItem.Subtitle style={styles.productPrecio}>${item.precio}</ListItem.Subtitle>
        <Text style={styles.productDescripcion}>Cantidad: {item.cantidad}</Text>
        <Text style={styles.productFecha}>Fecha: {item.fechaVenta}</Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón "Agregar Venta" centrado */}
      <View style={styles.buttonContainer}>
        {/* Hacemos el título invisible si es necesario */}
        <Text style={[styles.title, { opacity: 0 }]}>Lista de Ventas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('RegistroVenta')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Agregar Venta</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar indicador de carga mientras se obtienen los datos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={ventas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noProductsText}>No hay ventas registradas.</Text>}
        />
      )}
    </View>
  );
};

export default VisConsultaVentas;

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
    backgroundColor: '#4CAF50', // Botón verde
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
  noProductsText: {
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
  productName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  productPrecio: {
    fontSize: 14,
    color: '#666',
  },
  productDescripcion: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productFecha: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
