import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Importa tus vistas desde la carpeta 'vistas/'
import Principal from '../vistas/Principal';
import AcercaDe from '../vistas/AcercaDe';
import AltaProductos from '../vistas/AltaProductos';
import AltaUsuarios from '../vistas/AltaUsuarios';
import AltaClientes from '../vistas/AltaClientes';
import Admin from '../vistas/Admin';
import VisConsultaProductos from '../vistas/VisConsultaProductos';
import VisConsultaClientes from '../vistas/VisConsultaClientes';
import VisConsultaUsuarios from '../vistas/VisConsultaUsuarios';
import EditarUsuarios from '../vistas/EditarUsuarios';
import EditarProductos from '../vistas/EditarProductos';
import EditarClientes from '../vistas/EditarClientes';
import RegistroVenta from '../vistas/RegistroVenta';
import VisConsultaVentas from '../vistas/VisConsultaVentas';
import EditarVentas from '../vistas/EditarVentas';
import CatalogoProductos from '../vistas/CatalogoProductos';
import VisUsuariosPerfil from '../vistas/VisUsuariosPerfil';
import VisEditarPerfilUsuarios from '../vistas/VisEditarPerfilUsuarios';
import VisPromo from '../vistas/VisPromo';
import Regalos from '../vistas/Regalos';
import Feedback from '../vistas/Feedback';
import AdminFeedback from '../vistas/AdminFeedback';
import VisMovimiento from '../vistas/VisMovimiento';



const Drawer = createDrawerNavigator();

// Componente para el botón del menú en el header
const MenuButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 30 }}>
    <Icon name="menu" size={24} color="#fff" />
  </TouchableOpacity>
);

const NavegadorApp = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Principal"
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#c80082',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        drawerActiveTintColor: '#083773',
        drawerInactiveTintColor: 'green',
        headerLeft: () => <MenuButton navigation={navigation} />,
        headerLeft: () => <MenuButton navigation={navigation} />,
        sceneContainerStyle: {
          backgroundColor: '#E8F5E9', // Fondo de las pantallas
        },
        drawerStyle: {
          backgroundColor: 'white',
          width: 277,
        },
      })}
    >
      <Drawer.Screen
        name="Principal"
        component={Principal}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CatalogoProductos"
        component={CatalogoProductos}
        options={{
          title: 'Catalogo',
          drawerIcon: ({ color, size }) => (
            <Icon name="cup" size={size} color={color} />
          ),
        }}
      />
      

      <Drawer.Screen
        name="AltaProductos"
        component={AltaProductos}
        options={{
          title: 'Registrar Producto', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="VisConsultaProductos"
        component={VisConsultaProductos}
        options={{
          title: 'Consultar Productos', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="EditarUsuarios"
        component={EditarUsuarios}
        options={{
          title: 'Editar Usuario', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditarProductos"
        component={EditarProductos}
        options={{
          title: 'Editar Producto', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditarClientes"
        component={EditarClientes}
        options={{
          title: 'Editar Cliente', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />


      <Drawer.Screen
        name="VisPromo"
        component={VisPromo}
        options={{
          title: 'Promociones',
          drawerIcon: ({ color, size }) => (
            <Icon name="ticket" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="VisConsultaUsuarios"
        component={VisConsultaUsuarios}
        options={{
          title: 'Consultar Usuarios', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="VisConsultaClientes"
        component={VisConsultaClientes}
        options={{
          title: 'Consultar Clientes', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="AltaUsuarios"
        component={AltaUsuarios}
        options={{
          title: 'Registrar Usuario', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="AltaClientes"
        component={AltaClientes}
        options={{
          title: 'Registrar Cliente', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="RegistroVenta"
        component={RegistroVenta}
        options={{
          title: 'Registrar venta', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="VisConsultaVentas"
        component={VisConsultaVentas}
        options={{
          title: 'Consultar ventas', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="EditarVentas"
        component={EditarVentas}
        options={{
          title: 'Editar ventas', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
<Drawer.Screen
        name="VisUsuariosPerfil"
        component={VisUsuariosPerfil}
        options={{
          title: 'Perfil',
          drawerIcon: ({ color, size }) => (
            <Icon name="v-card" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="VisEditarPerfilUsuarios"
        component={VisEditarPerfilUsuarios}
        options={{
          title: 'Editar Perfil', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Regalos"
        component={Regalos}
        options={{
          title: 'Regalos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="gift" size={size} color={color} />
          ),
        }}
      />
      
        <Drawer.Screen
        name="Feedback"
        component={Feedback}
        options={{
          title: 'Sugerencias', 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AdminFeedback"
        component={AdminFeedback}
        options={{
          title: 'Panel de sugerencias', // Cambiado aquí
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="VisMovimeinto"
        component={VisMovimiento}
        options={{
          title: 'Movimiento', 
          drawerIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AcercaDe"
        component={AcercaDe}
        options={{
          title: 'Acerca de la tropical',
          drawerIcon: ({ color, size }) => (
            <Icon name="info-with-circle" size={size} color={color} />
          ),
        }}
      />   
      
       <Drawer.Screen
        name="Admin"
        component={Admin}
        options={{
          title: 'Admin', // Cambiado aquí
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default NavegadorApp;
