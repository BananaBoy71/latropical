// src/vistas/VisConsultaProductos.js

import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  FlatList, 
  Image 
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const VisConsultaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  const mostrarProductos = async () => {
    try {
      setCargando(true);
      const rsProductos = [];
      const querySnapshot = await conexion.collection('Productos').get();
      querySnapshot.forEach((doc) => {
        const { nombre, descripcion, precio, fechaRegistro, imagenUrl } = doc.data();
        rsProductos.push({
          id: doc.id,
          nombre,
          descripcion,
          precio,
          fechaRegistro,
          imagenUrl, // Aseguramos que incluimos la URL de la imagen
        });
      });
      setProductos(rsProductos);
      console.log('Productos obtenidos:', rsProductos); // Para depuración
    } catch (e) {
      Alert.alert('Error', 'Mensaje: ' + e.message);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', mostrarProductos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={styles.listItem}
      onPress={() => {
        console.log('ID del producto seleccionado:', item.id);
        navigation.navigate('EditarProductos', {
          id: item.id,
        });
      }}
    >
      {/* Mostrar la imagen si existe */}
      {item.imagenUrl ? (
        <Image 
          source={{ uri: item.imagenUrl }} 
          style={styles.productImage} 
        />
      ) : (
        <Avatar
          rounded
          title={item.nombre.charAt(0).toUpperCase()}
          size="medium"
          overlayContainerStyle={{ backgroundColor: '#4CAF50' }}
        />
      )}

      <ListItem.Content>
        <ListItem.Title style={styles.productName}>{item.nombre}</ListItem.Title>
        <ListItem.Subtitle style={styles.productPrecio}>Precio: ${item.precio}</ListItem.Subtitle>
        <Text style={styles.productDescripcion}>{item.descripcion}</Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con el botón "Agregar Producto" centrado */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AltaProductos')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar indicador de carga mientras se obtienen los datos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noProductsText}>No hay productos registrados.</Text>}
        />
      )}
    </View>
  );
};

export default VisConsultaProductos;

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
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
});
