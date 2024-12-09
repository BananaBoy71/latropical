// src/vistas/Admin.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Admin = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Botón para registro de usuarios */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AltaUsuarios')}
      >
        <Text style={styles.buttonText}>Registro de Usuarios</Text>
      </TouchableOpacity>

      {/* Botón para registro de clientes */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AltaClientes')}
      >
        <Text style={styles.buttonText}>Registro de Clientes</Text>
      </TouchableOpacity>

      {/* Botón para registro de productos */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AltaProductos')}
      >
        <Text style={styles.buttonText}>Registro de Productos</Text>
      </TouchableOpacity>

      {/* Botón para registrar una venta */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegistroVenta')}
      >
        <Text style={styles.buttonText}>Registrar Venta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AdminFeedback')}
      >
        <Text style={styles.buttonText}>Sugerencias</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Fondo azul claro para un toque tropical
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#57a236',  // Color verde para todos los botones
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5, // Sombra para el botón
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Admin;
