// src/vistas/EditarUsuarios.js

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../../Control/FireBase';

const EditarUsuarios = () => {
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    sexo: '',
    fotoURL: '',
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const handlerChangeText = (field, value) => {
    setUsuario({ ...usuario, [field]: value });
  };

  const actualizarUsuario = async (id) => {
    if (
      !usuario.nombre.trim() ||
      !usuario.apellido.trim() ||
      !usuario.email.trim() ||
      !usuario.telefono.trim() ||
      !usuario.direccion.trim() ||
      !usuario.sexo.trim()
    ) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const userRef = firebase.firestore().collection('usuarios').doc(id);

      await userRef.update({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        sexo: usuario.sexo,
        fotoURL: usuario.fotoURL,
      });
      Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      navigation.navigate('VisConsultaUsuarios');
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al actualizar el usuario.');
      console.error(e);
    }
  };

  const eliminarUsuario = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await firebase.firestore().collection('usuarios').doc(id).delete();
              Alert.alert('Éxito', 'Usuario eliminado correctamente.');
              navigation.navigate('VisConsultaUsuarios');
            } catch (e) {
              Alert.alert('Error', 'Hubo un problema al eliminar el usuario.');
              console.error(e);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    obtenerUsuarioPorId(id);
  }, [id]);

  const obtenerUsuarioPorId = async (id) => {
    try {
      const documentSnapshot = await firebase.firestore().collection('usuarios').doc(id).get();
      if (documentSnapshot.exists) {
        const data = documentSnapshot.data();
        console.log('Datos del usuario:', data); // Añade este console.log para depurar
        setUsuario({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || data.correo || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          sexo: data.sexo || '',
          fotoURL: data.fotoURL || '',
        });
      } else {
        Alert.alert('Error', 'El usuario no existe.');
        navigation.navigate('VisConsultaUsuarios');
      }
      setLoading(false);
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
      console.error(e);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a las fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Usar MediaTypeOptions.Images
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUsuario({ ...usuario, fotoURL: result.uri || result.assets[0].uri });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Cargando datos del usuario...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Usuario</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.consultarButton}
            onPress={() => navigation.navigate('VisConsultaUsuarios')}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
            <Text style={styles.consultarButtonText}>Consultar Usuarios</Text>
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

      {usuario.fotoURL ? (
        <Image source={{ uri: usuario.fotoURL }} style={styles.selectedImage} />
      ) : (
        <Text>No hay imagen seleccionada</Text>
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={usuario.nombre}
          onChangeText={(value) => handlerChangeText('nombre', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-add-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={usuario.apellido}
          onChangeText={(value) => handlerChangeText('apellido', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          value={usuario.email}
          keyboardType="email-address"
          onChangeText={(value) => handlerChangeText('email', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={usuario.telefono}
          keyboardType="phone-pad"
          onChangeText={(value) => handlerChangeText('telefono', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={usuario.direccion}
          onChangeText={(value) => handlerChangeText('direccion', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="male-female-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          value={usuario.sexo}
          onChangeText={(value) => handlerChangeText('sexo', value)}
        />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={styles.actualizarButton} 
          onPress={() => actualizarUsuario(id)}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.actualizarButtonText}>Actualizar Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.eliminarButton} 
          onPress={() => eliminarUsuario(id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.eliminarButtonText}>Eliminar Usuario</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


export default EditarUsuarios;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
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
    elevation: 3,
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
    elevation: 3,
    marginLeft: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 75,
    resizeMode: 'cover',
    alignSelf: 'center',
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
    marginBottom: 25,
    alignSelf: 'center',
    elevation: 3,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    elevation: 2,
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
    elevation: 3,
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
    elevation: 3,
  },
  eliminarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
