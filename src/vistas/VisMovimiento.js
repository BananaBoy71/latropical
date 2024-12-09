// VisMovimiento.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '../../Bdatos/FireBase'; // Asegúrate de la ruta correcta

const VisMovimiento = () => {
  const [movimiento, setMovimiento] = useState(0);

  useEffect(() => {
    const movimientoRef = firebase.database().ref('/sensorPIR/estado');

    movimientoRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setMovimiento(data);
    });

    return () => {
      movimientoRef.off();
    };
  }, []);

  const isMovimiento = movimiento === 1;

  return (
    <View style={[styles.container, isMovimiento ? styles.bgWhite : styles.bgBlack]}>
      <View style={styles.lampContainer}>
        <Icon
          name={isMovimiento ? "bulb" : "bulb-outline"}
          size={100}
          color={isMovimiento ? "#FFD700" : "#FFFFFF"}
        />
        <Text style={[styles.statusText, isMovimiento ? styles.textBlack : styles.textWhite]}>
          {isMovimiento ? 'Movimiento Detectado' : 'Sin Movimiento'}
        </Text>
      </View>
    </View>
  );
};

export default VisMovimiento;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bgBlack: {
    backgroundColor: 'black',
  },
  bgWhite: {
    backgroundColor: 'white',
  },
  lampContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  textWhite: {
    color: 'white',
  },
  textBlack: {
    color: 'black',
  },
});
