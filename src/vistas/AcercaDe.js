// src/vistas/AcercaDe.js

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Linking, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MapView, { Marker, Callout } from 'react-native-maps'; // Asegúrate de tener react-native-maps instalado

const AcercaDe = () => {
  const handleLocationPress = () => {
    // Enlace a Google Maps con la ubicación
    Linking.openURL('https://www.google.com/maps?q=20.709947220092136,-105.21619055237112');
  };

  const handleSocialPress = () => {
    Linking.openURL('https://www.facebook.com/profile.php?id=61567252933645'); // Reemplaza con tu página de Facebook
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+523222667195'); // Reemplaza con tu número de teléfono
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.descripcion}>
          En <Text style={styles.resaltado}>La Tropical</Text>, nos dedicamos a ofrecer las <Text style={styles.resaltado}>mejores aguas</Text> del condado. 
          Nuestra misión es brindarte productos de calidad y un servicio excepcional que satisfaga todas tus necesidades.
        </Text>
        
        {/* Información de Contacto */}
        <View style={styles.contactoContainer}>
          {/* Facebook */}
          <View style={styles.contactoItem}>
            <FontAwesome name="facebook-square" size={28} color="#4267B2" />
            <TouchableOpacity onPress={handleSocialPress} style={styles.contactoButton}>
              <Text style={styles.contactoTexto}>Síguenos en Facebook</Text>
            </TouchableOpacity>
          </View>
          
          {/* Teléfono */}
          <View style={styles.contactoItem}>
            <Ionicons name="call-outline" size={28} color="#4CAF50" />
            <TouchableOpacity onPress={handlePhonePress} style={styles.contactoButton}>
              <Text style={styles.contactoTexto}>Llámanos: +52 322 266 7195</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dirección y Mapa */}
        <View style={styles.direccionContainer}>
          <Text style={styles.direccion}>C. Moras 355, 48280 Ixtapa, Jal.</Text>
          <TouchableOpacity onPress={handleLocationPress} style={styles.mapButton}>
            <Ionicons name="location-sharp" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver en el mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Mapa Interactivo */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 20.709947220092136,
            longitude: -105.21619055237112,
            latitudeDelta: 0.005, // Controla el zoom vertical
            longitudeDelta: 0.005, // Controla el zoom horizontal
          }}
        >
          <Marker 
            coordinate={{ latitude: 20.709947220092136, longitude: -105.21619055237112 }}
            title="La Tropical"
            description="C. Moras 355, 48280 Ixtapa, Jal."
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitulo}>La Tropical</Text>
                <Text style={styles.calloutDescripcion}>C. Moras 355, 48280 Ixtapa, Jal.</Text>
                <TouchableOpacity onPress={handleLocationPress} style={styles.calloutButton}>
                  <Ionicons name="location-sharp" size={16} color="#fff" />
                  <Text style={styles.calloutButtonText}>Ver en el mapa</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcercaDe;

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
    fontSize: 28,
    fontWeight: '800',
    color: '#FF5722', // Color vibrante para destacar
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  descripcion: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#555',
    lineHeight: 24, // Mejor legibilidad
  },
  resaltado: {
    fontWeight: '700',
    color: '#4CAF50',
  },
  contactoContainer: {
    width: '100%',
    marginBottom: 25,
  },
  contactoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactoButton: {
    marginLeft: 15,
  },
  contactoTexto: {
    fontSize: 16,
    color: '#333',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  direccionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  direccion: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',  // Naranja tropical
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginTop: 10,
  },
  callout: {
    width: 220,
  },
  calloutTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  calloutDescripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  calloutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9800',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
});
