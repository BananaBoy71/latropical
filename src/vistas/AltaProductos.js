import React, { useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../../Control/FireBase';  // Asegúrate de que la conexión esté correcta

const AltaProductos = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [image, setImage] = useState(null);  // Nuevo estado para la imagen

  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFechaRegistro(currentDate.toLocaleDateString([], { dateStyle: 'medium' }));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
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
      setImage(result.assets[0].uri);  // Asignar la URI de la imagen seleccionada
    }
  };

  const handleRegister = async () => {
    if (!nombre || !descripcion || !precio || !fechaRegistro || !image) {
      Alert.alert('Error', 'Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    try {
      // Guardar el producto en Firestore (también podrías guardar la imagen en Firebase Storage)
      const productoRef = await firebase.firestore().collection('Productos').add({
        nombre,
        descripcion,
        precio,
        fechaRegistro,
        imagenUrl: image,  // Guardar la URL de la imagen en Firestore (o Firebase Storage si subes la imagen)
      });
      Alert.alert('Éxito', 'Producto registrado correctamente.');
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setFechaRegistro('');
      setImage(null);  // Limpiar la imagen después de registrar
    } catch (error) {
      console.error('Error al registrar el producto: ', error);
      Alert.alert('Error', 'Hubo un problema al registrar el producto.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.adminButtonText}>Regresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.consultarButton}
            onPress={() => navigation.navigate('VisConsultaProductos')}
          >
            <Ionicons name="list-outline" size={20} color="#fff" />
            <Text style={styles.consultarButtonText}>Consultar Productos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón para seleccionar imagen */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {/* Mostrar la imagen seleccionada */}
      {image && <Image source={{ uri: image }} style={styles.selectedImage} />}

      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del Producto"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="document-text-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={precio}
          keyboardType="numeric"
          onChangeText={setPrecio}
        />
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.dateButtonText}>Seleccionar Fecha de Registro</Text>
        </TouchableOpacity>
        {fechaRegistro !== '' && <Text style={styles.fecha}>Fecha: {fechaRegistro}</Text>}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <TouchableOpacity 
        style={styles.registrarButton} 
        onPress={handleRegister}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.registrarButtonText}>Registrar Producto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AltaProductos;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
  },
  header: {
    marginBottom: 15,
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
    justifyContent: 'space-between', // Esto asegurará que los botones estén en los extremos
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
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
    resizeMode: 'cover',
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
  datePickerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  fecha: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  registrarButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
    width: '80%',
    justifyContent: 'center',
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registrarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});
