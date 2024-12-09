// src/vistas/EditarClientes.js
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


const EditarClientes = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const handlerChangeText = (field, value) => {
    setCliente({ ...cliente, [field]: value });
  };

  const actualizarCliente = async (id) => {
    if (!cliente.nombre || !cliente.email || !cliente.telefono || !cliente.direccion) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await conexion.collection('Clientes').doc(id).update({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      });
      Alert.alert('Éxito', 'Cliente actualizado correctamente.');
      navigation.navigate('VisConsultaClientes');
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al actualizar el cliente.');
      console.error(e);
    }
  };

  const eliminarCliente = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await conexion.collection('Clientes').doc(id).delete();
              Alert.alert('Éxito', 'Cliente eliminado correctamente.');
              navigation.navigate('VisConsultaClientes');
            } catch (e) {
              Alert.alert('Error', 'Hubo un problema al eliminar el cliente.');
              console.error(e);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    obtenerClientePorId(id);
  }, [id]);

  const obtenerClientePorId = async (id) => {
    try {
      const documentSnapshot = await conexion.collection('Clientes').doc(id).get();
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        setCliente({
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
        });
        console.log('Cliente obtenido:', data); // Para depuración
      } else {
        Alert.alert('Error', 'El cliente no existe.');
        navigation.navigate('VisConsultaClientes');
      }
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al obtener los datos del cliente.');
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Encabezado con título y botones */}
      <View style={styles.header}>
        <Text style={styles.title}>Editar Cliente</Text>
        <View style={styles.buttonRow}>
          {/* Botón Consultar Clientes */}
          <TouchableOpacity
            style={styles.consultarButton}
            onPress={() => navigation.navigate('VisConsultaClientes')}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
            <Text style={styles.consultarButtonText}>Consultar Clientes</Text>
          </TouchableOpacity>

          {/* Botón Admin */}
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Campos de Entrada con Iconos */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del Cliente"
          value={cliente.nombre}
          onChangeText={(value) => handlerChangeText('nombre', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={cliente.email}
          keyboardType="email-address"
          onChangeText={(value) => handlerChangeText('email', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={cliente.telefono}
          keyboardType="phone-pad"
          onChangeText={(value) => handlerChangeText('telefono', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={cliente.direccion}
          onChangeText={(value) => handlerChangeText('direccion', value)}
        />
      </View>

      {/* Botones de Acción */}
      <View style={styles.actionButtonsContainer}>
        {/* Botón Actualizar Cliente */}
        <TouchableOpacity 
          style={styles.actualizarButton} 
          onPress={() => actualizarCliente(id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.actualizarButtonText}>Actualizar Cliente</Text>
        </TouchableOpacity>

        {/* Botón Eliminar Cliente */}
        <TouchableOpacity 
          style={styles.eliminarButton} 
          onPress={() => eliminarCliente(id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.eliminarButtonText}>Eliminar Cliente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarClientes;

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
