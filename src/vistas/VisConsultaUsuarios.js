// src/vistas/VisConsultaUsuarios.js

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
import { firebase } from '../../Control/FireBase';

const VisConsultaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigation = useNavigation();

  const mostrarUsuarios = async () => {
    try {
      setCargando(true);
      const rsUsuarios = [];
      const querySnapshot = await firebase.firestore().collection('usuarios').get();
      querySnapshot.forEach((doc) => {
        const { nombre, apellido, email, telefono, direccion, sexo, fotoURL } = doc.data();
        rsUsuarios.push({
          id: doc.id,
          nombre: nombre || '',
          apellido: apellido || '',
          email: email || '',
          telefono: telefono || '',
          direccion: direccion || '',
          sexo: sexo || '',
          fotoURL: fotoURL || '',
        });
      });
      setUsuarios(rsUsuarios);
      console.log('Usuarios obtenidos:', rsUsuarios); // Para depuración
    } catch (e) {
      Alert.alert('Error', 'Mensaje: ' + e.message);
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', mostrarUsuarios);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => {
    const nombreInicial = item.nombre ? item.nombre.charAt(0).toUpperCase() : '';
    const apellidoInicial = item.apellido ? item.apellido.charAt(0).toUpperCase() : '';

    return (
      <ListItem
        bottomDivider
        containerStyle={styles.listItem}
        onPress={() => {
          console.log('ID del usuario seleccionado:', item.id);
          navigation.navigate('EditarUsuarios', {
            id: item.id,
          });
        }}
      >
        <Avatar
          rounded
          title={`${nombreInicial}${apellidoInicial}`}
          size="medium"
          overlayContainerStyle={{ backgroundColor: '#4CAF50' }}
          source={item.fotoURL ? { uri: item.fotoURL } : null}
        />
        <ListItem.Content>
          <ListItem.Title style={styles.userName}>{`${item.nombre} ${item.apellido}`}</ListItem.Title>
          <ListItem.Subtitle style={styles.userEmail}>{item.email}</ListItem.Subtitle>
          <Text style={styles.userTelefono}>Teléfono: {item.telefono}</Text>
          <Text style={styles.userDireccion}>Dirección: {item.direccion}</Text>
          <Text style={styles.userSexo}>Sexo: {item.sexo}</Text>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  return (
    <View style={styles.container}>
      {/* Centrado del botón */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AltaUsuarios')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Agregar Usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Mostrar indicador de carga mientras se obtienen los datos */}
      {cargando ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noUsersText}>No hay usuarios registrados.</Text>}
        />
      )}
    </View>
  );
};

export default VisConsultaUsuarios;

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
  noUsersText: {
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
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userTelefono: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  userDireccion: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userSexo: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
