// src/vistas/EditarVentas.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const EditarVentas = () => {
  const [venta, setVenta] = useState({
    producto: '',
    cantidad: '',
    precio: '',
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const handlerChangeText = (field, value) => {
    setVenta({ ...venta, [field]: value });
  };

  const actualizarVenta = async (id) => {
    if (!venta.producto || !venta.cantidad || !venta.precio) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await conexion.collection('Ventas').doc(id).update({
        producto: venta.producto,
        cantidad: venta.cantidad,
        precio: venta.precio,
      });
      Alert.alert('Éxito', 'Venta actualizada correctamente.');
      navigation.navigate('VisConsultaVentas');
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al actualizar la venta.');
      console.error(e);
    }
  };

  const eliminarVenta = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta venta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await conexion.collection('Ventas').doc(id).delete();
              Alert.alert('Éxito', 'Venta eliminada correctamente.');
              navigation.navigate('VisConsultaVentas');
            } catch (e) {
              Alert.alert('Error', 'Hubo un problema al eliminar la venta.');
              console.error(e);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    obtenerVentaPorId(id);
  }, [id]);

  const obtenerVentaPorId = async (id) => {
    try {
      const documentSnapshot = await conexion.collection('Ventas').doc(id).get();
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setVenta({
          producto: data.producto || '',
          cantidad: data.cantidad || '',
          precio: data.precio || '',
        });
      } else {
        Alert.alert('Error', 'La venta no existe.');
        navigation.navigate('VisConsultaVentas');
      }
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al obtener los datos de la venta.');
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Campos de Entrada con Iconos */}
      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Producto"
          value={venta.producto}
          onChangeText={(value) => handlerChangeText('producto', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="list" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={venta.cantidad}
          keyboardType="numeric"
          onChangeText={(value) => handlerChangeText('cantidad', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={venta.precio}
          keyboardType="numeric"
          onChangeText={(value) => handlerChangeText('precio', value)}
        />
      </View>

      
      {/* Botones de Acción */}
      <View style={styles.actionButtonsContainer}>
        {/* Botón Actualizar Venta */}
        <TouchableOpacity 
          style={styles.actualizarButton} 
          onPress={() => actualizarVenta(id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.actualizarButtonText}>Actualizar Venta</Text>
        </TouchableOpacity>

        {/* Botón Eliminar Venta */}
        <TouchableOpacity 
          style={styles.eliminarButton} 
          onPress={() => eliminarVenta(id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.eliminarButtonText}>Eliminar Venta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarVentas;

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
});
