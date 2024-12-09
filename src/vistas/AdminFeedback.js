// src/vistas/AdminFeedback.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importar el hook
import { firebase } from '../../Control/FireBase';

const AdminFeedback = () => {
  const navigation = useNavigation(); // Utilizar el hook para acceder a navigation
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respuesta, setRespuesta] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('Feedback')
      .orderBy('fecha', 'desc')
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFeedbacks(data);
          setLoading(false);
        },
        error => {
          console.error('Error al cargar feedbacks:', error);
          Alert.alert('Error', 'No se pudieron cargar los feedbacks.');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  const handleResponder = async () => {
    if (respuesta.trim() === '') {
      Alert.alert('Error', 'Por favor, ingresa una respuesta.');
      return;
    }

    try {
      await firebase.firestore().collection('Feedback').doc(selectedFeedback.id).update({
        respuesta,
        estado: 'resuelto',
      });
      Alert.alert('Éxito', 'Respuesta enviada correctamente.');
      setRespuesta('');
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Error al responder feedback:', error);
      Alert.alert('Error', 'No se pudo enviar la respuesta.');
    }
  };

  const renderFeedback = ({ item }) => (
    <View style={styles.feedbackCard}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.feedbackTipo}>{item.tipo.toUpperCase()}</Text>
        <Text style={styles.feedbackFecha}>{item.fecha?.toDate().toLocaleString()}</Text>
      </View>
      <Text style={styles.feedbackComentario}>{item.comentario}</Text>
      {item.respuesta ? (
        <View style={styles.respuestaContainer}>
          <Text style={styles.respuestaTitulo}>Respuesta:</Text>
          <Text style={styles.respuestaTexto}>{item.respuesta}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.responderButton} onPress={() => setSelectedFeedback(item)}>
          <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
          <Text style={styles.responderButtonText}>Responder</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando feedbacks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botón para regresar al Panel Admin */}
      <TouchableOpacity
        style={styles.adminButton}
        onPress={() => navigation.navigate('Admin')} // Asegúrate de que 'Admin' sea el nombre correcto de la pantalla
      >
        <Ionicons name="settings-outline" size={20} color="#fff" />
        <Text style={styles.adminButtonText}>Regresar</Text>
      </TouchableOpacity>

      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id}
        renderItem={renderFeedback}
        contentContainerStyle={styles.list}
      />

      {selectedFeedback && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Responder Feedback</Text>
            <Text style={styles.modalComentario}>{selectedFeedback.comentario}</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              numberOfLines={4}
              placeholder="Escribe tu respuesta aquí..."
              value={respuesta}
              onChangeText={setRespuesta}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.enviarButton} onPress={handleResponder}>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.enviarButtonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelarButton} onPress={() => setSelectedFeedback(null)}>
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.cancelarButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AdminFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 10,
  },
  adminButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start', // Posiciona el botón en la esquina superior izquierda
    marginBottom: 10,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 20,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedbackTipo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
  },
  feedbackFecha: {
    fontSize: 14,
    color: '#777',
  },
  feedbackComentario: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  respuestaContainer: {
    backgroundColor: '#f1f8e9',
    padding: 10,
    borderRadius: 8,
  },
  respuestaTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 5,
  },
  respuestaTexto: {
    fontSize: 16,
    color: '#333',
  },
  responderButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  responderButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalComentario: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  modalInput: {
    height: 100,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enviarButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  enviarButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
  cancelarButton: {
    flexDirection: 'row',
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelarButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '600',
  },
});
