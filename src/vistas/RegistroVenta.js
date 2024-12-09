// src/vistas/RegistroVenta.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de tener la navegación configurada

const RegistroVenta = () => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechaVenta, setFechaVenta] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const navigation = useNavigation();

  // Manejo de la fecha
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFechaVenta(currentDate.toLocaleDateString([], { dateStyle: 'medium' }));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleRegisterVenta = async () => {
    if (!producto || !cantidad || !precio || !fechaVenta) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Agregar la venta a la colección "ventas" en Firestore
    try {
      await conexion.collection('Ventas').add({
        producto,
        cantidad,
        precio,
        fechaVenta,
      });
      Alert.alert('Venta Registrada', 'La venta se ha registrado correctamente.');

      // Limpiar los campos después de registrar la venta
      setProducto('');
      setCantidad('');
      setPrecio('');
      setFechaVenta('');
    } catch (error) {
      console.error('Error al registrar la venta: ', error);
      Alert.alert('Error', 'Hubo un problema al registrar la venta.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botones para navegación */}
      <View style={styles.navigationButtonsContainer}>
        {/* Botón Panel de Administración */}
        <TouchableOpacity
          style={styles.navigationButtonAdmin}
          onPress={() => navigation.navigate('Admin')}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
          <Text style={styles.navigationButtonText}>Regresar</Text>
        </TouchableOpacity>

        {/* Botón Consultar Ventas */}
        <TouchableOpacity
          style={styles.navigationButtonConsult}
          onPress={() => navigation.navigate('VisConsultaVentas')}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text style={styles.navigationButtonText}>Consultar Ventas</Text>
        </TouchableOpacity>
      </View>

      {/* Campos de Entrada con Iconos */}
      <View style={styles.inputContainer}>
        <Ionicons name="pricetag-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Producto"
          value={producto}
          onChangeText={setProducto}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="list" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Precio"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.dateButtonText}>Seleccionar Fecha de Venta</Text>
        </TouchableOpacity>
        {fechaVenta !== '' && <Text style={styles.fecha}>Fecha: {fechaVenta}</Text>}
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

      <TouchableOpacity style={styles.registrarButton} onPress={handleRegisterVenta}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.registrarButtonText}>Registrar Venta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#E3F2FD',
    flexGrow: 1,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navigationButtonAdmin: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',  // Color verde para el Panel de Administración
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navigationButtonConsult: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',  // Color naranja para Consultar Ventas
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navigationButtonText: {
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
    elevation: 3,
    shadowColor: '#000',
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
    elevation: 3,
    shadowColor: '#000',
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

export default RegistroVenta;
