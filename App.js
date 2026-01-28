import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, StyleSheet} from 'react-native';


import { InscripcionProvider } from './src/context/InscripcionContext';
import { auth } from './src/services/firebase'; 
import { signOut } from 'firebase/auth';

import HomeScreen from './src/screens/HomeScreen';
import DatosClubScreen from './src/screens/DatosClubScreen';
import ListaEquiposScreen from './src/screens/ListaEquiposScreen';
import ListaBuenaFe from './src/screens/ListaBuenaFe';
import ResumenInscripcion from './src/screens/ResumenInscripcion';
import MisInscripcionesScreen from './src/screens/MisInscripcionesScreen';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import DetalleInscripcionScreen from './src/screens/DetalleInscripcionScreen';
import FixtureScreen from './src/screens/FixtureScreen';
import AdminFixtureScreen from './src/screens/AdminFixtureScreen';


const Stack = createStackNavigator();

  export default function App() {
    return (
      <InscripcionProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: 'black' }, 
              headerTitleStyle: { fontWeight: 'bold' },
              headerTintColor: '#fff', 
            }}
        >
          <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Inicio' }} 
          />
         
          <Stack.Screen 
            name="DatosClub" 
            component={DatosClubScreen} 
            options={{ title: 'Registro de Club' }} 
          />
          <Stack.Screen 
            name="ListaEquipos" 
            component={ListaEquiposScreen} 
            options={{ title: 'Listado de Equipos' }} 
          />
          <Stack.Screen 
            name="FormularioBuenaFe" 
            component={ListaBuenaFe} 
            options={{ title: 'Carga de Datos' }} 
          />
          <Stack.Screen 
            name="ResumenInscripcion" 
            component={ResumenInscripcion} 
            options={{ title: 'Finalizar Inscripción' }} 
          />
          <Stack.Screen 
            name="MisInscripciones" 
            component={MisInscripcionesScreen} 
            options={{ title: 'Historial' }} 
          />
          <Stack.Screen 
            name="Fixture" 
            component={FixtureScreen} 
            options={{ title: '🏆Fixture y Posiciones' }} 
          />
          <Stack.Screen 
            name="DetalleInscripcion" 
            component={DetalleInscripcionScreen} 
            options={{ title: 'Detalle de la Lista' }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Acceder' }} 
          />
          <Stack.Screen 
            name="AdminDashboard" 
            component={AdminDashboard} 
            options={({ navigation }) => ({ 
              title: 'Panel de Control',
              headerRight: () => (
                <TouchableOpacity 
                  style={{ marginRight: 15, backgroundColor: '#D32F2F', padding: 5, borderRadius: 5 }}
                  onPress={async () => {
                    try {
                      await signOut(auth);
                      navigation.replace('Home'); 
                    } catch (error) {
                      console.error("Error al cerrar sesión", error);
                    }
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>SALIR</Text>
                </TouchableOpacity>
              ),
              headerLeft: () => null, 
            })} 
          />
          <Stack.Screen 
          name="AdminFixture" 
          component={AdminFixtureScreen} 
          options={{ title: 'Cargar Resultados' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </InscripcionProvider>
  );
}


const styles = StyleSheet.create({
  map: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginVertical: 10,
  },
});