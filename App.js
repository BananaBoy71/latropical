import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


import Login from './src/vistas/Login';
import NavegadorApp from './src/navegacion/NavegadorApp';

function MyStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen 
        name="VL" 
        component={Login} 
        options={{
          title: '', 
          headerShown: false, 
        }} 
      />
      
      <Stack.Screen 
        name="NA" 
        component={NavegadorApp} 
        options={{
          title: '', 
          headerShown: false, 
        }} 
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

export default App;
