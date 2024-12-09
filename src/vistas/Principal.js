// src/vistas/Principal.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Principal = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../imagenes/LaTropical.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.titulo}>Bienvenido a La Tropical</Text>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate('CatalogoProductos')}
        >
          <Text style={styles.textoBoton}>Catalogo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate('VisPromo')}
        >
          <Text style={styles.textoBoton}>Promociones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.navigate('AcercaDe')}
        >
          <Text style={styles.textoBoton}>Acerca de</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ocupar todo el espacio disponible
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semi-transparente oscuro
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste
    marginBottom: 40,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#FFA500', // Color naranja para los botones
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Principal;
