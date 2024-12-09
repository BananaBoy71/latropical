// src/vistas/Feedback.js

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from '../../Control/FireBase';

const Feedback = () => {
  const [tipo, setTipo] = useState('sugerencia');
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const tiposFeedback = [
    { label: 'Sugerencia', value: 'sugerencia' },
    { label: 'Queja', value: 'queja' },
    { label: 'Elogio', value: 'elogio' },
  ];

  const handleSubmit = async () => {
    if (comentario.trim() === '') {
      Alert.alert('Error', 'Por favor, ingresa tu comentario.');
      return;
    }

    setLoading(true);
    const usuario = firebase.auth().currentUser;

    if (!usuario) {
      Alert.alert('Error', 'No estás autenticado. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const feedbackRef = firebase.firestore().collection('Feedback').doc();
      await feedbackRef.set({
        feedbackId: feedbackRef.id,
        clienteId: usuario.uid,
        tipo,
        comentario,
        fecha: firebase.firestore.FieldValue.serverTimestamp(),
        estado: 'nuevo',
        respuesta: ''
      });

      Alert.alert('Éxito', 'Tu feedback ha sido enviado correctamente.');
      setTipo('sugerencia');
      setComentario('');
    } catch (error) {
      console.error('Error al enviar el feedback:', error);
      Alert.alert('Error', 'No se pudo enviar tu feedback. Intenta nuevamente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.safeArea} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Selección del Tipo de Feedback usando ScrollView */}
        <View style={styles.tipoContainer}>
          <Text style={styles.label}>Tipo:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContainer}
          >
            {tiposFeedback.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.tipoButton,
                  tipo === item.value && styles.tipoButtonSelected
                ]}
                onPress={() => setTipo(item.value)}
              >
                <Ionicons 
                  name={
                    tipo === item.value 
                      ? 'checkmark-circle' 
                      : 'ellipse-outline'
                  } 
                  size={20} 
                  color={tipo === item.value ? '#fff' : '#4CAF50'} 
                />
                <Text 
                  style={[
                    styles.tipoButtonText, 
                    tipo === item.value && styles.tipoButtonTextSelected
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Campo de Comentario */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comentario:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChangeText={setComentario}
          />
        </View>

        {/* Botón de Envío */}
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  tipoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  tipoButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tipoButtonText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
  tipoButtonTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    height: 120,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
});
