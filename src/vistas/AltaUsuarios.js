// src/vistas/AltaUsuarios.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../../Control/FireBase';

const AltaUsuarios = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sexo, setSexo] = useState('');

  // Estados para DateTimePicker
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const navigation = useNavigation();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Mantener el picker abierto en iOS
    setDate(currentDate);
    setFechaRegistro(currentDate.toLocaleDateString([], { dateStyle: 'medium' }));
  };

  const showDatepicker = () => {
    setShow(true);
    setMode('date');
  };

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !telefono || !direccion || !fechaRegistro || !sexo) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await firebase.firestore().collection('usuarios').add({
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        fechaRegistro,
        sexo,
        fotoURL: '',
      });
      Alert.alert('Éxito', 'Usuario registrado correctamente.');
      // Limpiar los campos
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setFechaRegistro('');
      setSexo('');
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

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
          onPress={() => navigation.navigate('VisConsultaUsuarios')}
        >
          <Ionicons name="people-outline" size={20} color="#fff" />
          <Text style={styles.consultarButtonText}>Consultar Usuarios</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={apellido}
          onChangeText={setApellido}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          keyboardType="phone-pad"
          onChangeText={setTelefono}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={direccion}
          onChangeText={setDireccion}
        />
      </View>

      {/* Selección de género */}
      <View style={styles.radioContainer}>
        <Text style={styles.radioLabel}>Seleccione su género:</Text>
        <RadioButtonGroup 
          containerStyle={{ marginBottom: 10 }}
          selected={sexo}
          onSelected={(value) => setSexo(value)}
          radioBackground="gray"
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

      {/* Selector de fecha de registro */}
      <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
        <Ionicons name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.dateButtonText}>Seleccionar Fecha de Registro</Text>
      </TouchableOpacity>
      
      {fechaRegistro !== '' && (
        <Text style={styles.fecha}>Fecha: {fechaRegistro}</Text>
      )}

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

      {/* Botón de registrar */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding:25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  adminButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 2,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  consultarButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  consultarButtonText: {
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
    shadowColor: '#000',
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 50,
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
  dateButton: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  fecha: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AltaUsuarios;
