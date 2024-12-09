import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const CatalogoProductos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  
  const mostrarProductos = async () => {
    try {
      setCargando(true);
      const productosList = [];
      const querySnapshot = await conexion.collection('Productos').get();
      querySnapshot.forEach(doc => {
        const { nombre, descripcion, precio, imagenUrl } = doc.data();
        productosList.push({
          id: doc.id,
          nombre,
          descripcion,
          precio,
          imagenUrl,  // Aquí se recupera la URL de la imagen
        });
      });
      setProductos(productosList);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el catálogo de productos.');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', mostrarProductos);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.imagenUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productDescription}>{item.descripcion}</Text>
        <Text style={styles.productPrice}>${item.precio}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cargando ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default CatalogoProductos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,  // Sombra en Android
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
});
