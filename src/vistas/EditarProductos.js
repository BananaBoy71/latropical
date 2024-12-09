import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../../Control/FireBase'; // Asegúrate de tener la conexión correcta con Firebase

const EditarProductos = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagenUrl: '', // Para la imagen
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const handlerChangeText = (field, value) => {
    setProducto({ ...producto, [field]: value });
  };

  const actualizarProducto = async (id) => {
    if (!producto.nombre || !producto.descripcion || !producto.precio) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await firebase.firestore().collection('Productos').doc(id).update({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl, // Actualizamos la imagen
      });
      Alert.alert('Éxito', 'Producto actualizado correctamente.');
      navigation.navigate('VisConsultaProductos');
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al actualizar el producto.');
      console.error(e);
    }
  };

  const eliminarProducto = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await firebase.firestore().collection('Productos').doc(id).delete();
              Alert.alert('Éxito', 'Producto eliminado correctamente.');
              navigation.navigate('VisConsultaProductos');
            } catch (e) {
              Alert.alert('Error', 'Hubo un problema al eliminar el producto.');
              console.error(e);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    obtenerProductoPorId(id);
  }, [id]);

  const obtenerProductoPorId = async (id) => {
    try {
      const documentSnapshot = await firebase.firestore().collection('Productos').doc(id).get();
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setProducto({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          precio: data.precio || '',
          imagenUrl: data.imagenUrl || '', // Cargar la URL de la imagen
        });
      } else {
        Alert.alert('Error', 'El producto no existe.');
        navigation.navigate('VisConsultaProductos');
      }
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al obtener los datos del producto.');
      console.error(e);
    }
  };

  // Función para seleccionar imagen
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProducto({ ...producto, imagenUrl: result.assets[0].uri }); // Asignar la nueva imagen
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Producto</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.consultarButton}
            onPress={() => navigation.navigate('VisConsultaProductos')}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
            <Text style={styles.consultarButtonText}>Consultar Productos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mostrar la imagen actual */}
      {producto.imagenUrl ? (
        <Image source={{ uri: producto.imagenUrl }} style={styles.selectedImage} />
      ) : (
        <Text>No hay imagen seleccionada</Text>
      )}

      {/* Botón para seleccionar una nueva imagen */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {/* Campos de Entrada con Iconos */}
      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del Producto"
          value={producto.nombre}
          onChangeText={(value) => handlerChangeText('nombre', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={producto.descripcion}
          onChangeText={(value) => handlerChangeText('descripcion', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={producto.precio}
          keyboardType="numeric"
          onChangeText={(value) => handlerChangeText('precio', value)}
        />
      </View>

      <View style={styles.actionButtonsContainer}>
        {/* Botón Actualizar Producto */}
        <TouchableOpacity 
          style={styles.actualizarButton} 
          onPress={() => actualizarProducto(id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.actualizarButtonText}>Actualizar Producto</Text>
        </TouchableOpacity>

        {/* Botón Eliminar Producto */}
        <TouchableOpacity 
          style={styles.eliminarButton} 
          onPress={() => eliminarProducto(id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.eliminarButtonText}>Eliminar Producto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarProductos;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  consultarButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginRight: 10,
  },
  consultarButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  adminButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionButtonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  actualizarButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
    justifyContent: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actualizarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  eliminarButton: {
    flexDirection: 'row',
    backgroundColor: '#D9534F',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eliminarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 15,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
});
