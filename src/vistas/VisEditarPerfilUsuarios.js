// src/vistas/VisEditarPerfilUsuarios.js

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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../../Control/FireBase';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button'; // Importar RadioButton

const VisEditarPerfilUsuarios = () => {
  const [userData, setUserData] = useState({
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

  const handlerChangeText = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = async () => {
    if (
      !userData.nombre.trim() ||
      !userData.apellido.trim() ||
      !userData.telefono.trim() ||
      !userData.direccion.trim() ||
      !userData.sexo.trim()
    ) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore().collection('usuarios').doc(user.uid).update({
          nombre: userData.nombre,
          apellido: userData.apellido,
          telefono: userData.telefono,
          direccion: userData.direccion,
          sexo: userData.sexo,
          fotoURL: userData.fotoURL,
        });
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
        navigation.navigate('VisUsuariosPerfil');
      }
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al actualizar tu perfil.');
      console.error(e);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = firebase.auth().currentUser;
              if (user) {
                // Primero, elimina el documento del usuario en Firestore
                await firebase.firestore().collection('usuarios').doc(user.uid).delete();
                console.log('Documento de usuario eliminado de Firestore.');

                // Luego, elimina el usuario de Firebase Authentication
                await user.delete();
                console.log('Usuario eliminado de Firebase Authentication.');

                Alert.alert('Éxito', 'Tu cuenta ha sido eliminada correctamente.');
                navigation.replace('VL'); // Navegar a la pantalla de Login
              }
            } catch (error) {
              console.error('Error al eliminar la cuenta:', error);
              // Manejar errores de reautenticación si es necesario
              if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Reautenticación Necesaria',
                  'Por favor, inicia sesión nuevamente para eliminar tu cuenta.',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Iniciar Sesión',
                      onPress: () => navigation.replace('VL'),
                    },
                  ]
                );
              } else {
                Alert.alert('Error', 'Hubo un problema al eliminar tu cuenta.');
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    obtenerUsuario();
  }, []);

  const obtenerUsuario = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const documentSnapshot = await firebase
          .firestore()
          .collection('usuarios')
          .doc(user.uid)
          .get();
        if (documentSnapshot.exists) {
          const data = documentSnapshot.data();
          console.log('Datos del usuario:', data); // Para depuración
          setUserData({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || data.correo || '',
            telefono: data.telefono || '',
            direccion: data.direccion || '',
            sexo: data.sexo || '',
            fotoURL: data.fotoURL || '',
          });
        } else {
          Alert.alert('Error', 'No se encontraron datos del usuario.');
        }
        setLoading(false);
      }
    } catch (e) {
      Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
      console.error(e);
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      console.log('pickImage called');
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
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
  
      console.log('ImagePicker result:', result);
  
      if (!result.canceled) {
        setUserData({ ...userData, fotoURL: result.uri || result.assets[0].uri });
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'Hubo un problema al seleccionar la imagen.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9CA48C" />
        <Text style={styles.loadingText}>Cargando datos del usuario...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      {/* Imagen de Perfil */}
      {userData.fotoURL ? (
        <Image source={{ uri: userData.fotoURL }} style={styles.selectedImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="person-circle-outline" size={100} color="#888" />
        </View>
      )}

      {/* Botón para Seleccionar Imagen */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {/* Campos de entrada */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={userData.nombre}
          onChangeText={(value) => handlerChangeText('nombre', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-add-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={userData.apellido}
          onChangeText={(value) => handlerChangeText('apellido', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={userData.telefono}
          onChangeText={(value) => handlerChangeText('telefono', value)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={userData.direccion}
          onChangeText={(value) => handlerChangeText('direccion', value)}
        />
      </View>

      {/* Selección de género */}
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Seleccione su género:</Text>
        <RadioButtonGroup 
          containerStyle={{ marginBottom: 10 }}
          selected={userData.sexo}
          onSelected={(value) => handlerChangeText('sexo', value)}
          radioBackground="grey"
        >
          <RadioButtonItem 
            value="Masculino" 
            label={<Text style={styles.radioText}>Masculino</Text>} 
          />
          <RadioButtonItem 
            value="Femenino" 
            label={<Text style={styles.radioText}>Femenino</Text>} 
          />
          <RadioButtonItem 
            value="Otro" 
            label={<Text style={styles.radioText}>Otro</Text>} 
          />
        </RadioButtonGroup>
      </View>

      {/* Botones */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      {/* Botón para Eliminar Cuenta */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
        <Text style={styles.deleteButtonText}>Eliminar Cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default VisEditarPerfilUsuarios;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  radioContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  radioLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
  radioText: {
    fontSize: 16,
    color: '#555',
  },
  selectedImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
    borderRadius: 75,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
