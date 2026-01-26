import React, { useState } from 'react';
import { View, 
        Text, 
        TextInput, 
        TouchableOpacity, 
        Alert, 
        StyleSheet, 
        ActivityIndicator } from 'react-native';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa correo y contraseña.");
      return;
    }

    setCargando(true);
    console.log("LOG: Intentando conectar a Firebase con:", email);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      console.log("LOG: Login exitoso para el UID:", userCredential.user.uid);
      
      setCargando(false);
      navigation.replace('AdminDashboard');
      
    } catch (error) {
      setCargando(false);
      console.error("LOG: Error de Firebase ->", error.code, error.message);

      let mensajeError = "No se pudo iniciar sesión.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        mensajeError = "Correo o contraseña incorrectos.";
      } else if (error.code === 'auth/network-request-failed') {
        mensajeError = "Error de conexión. Revisa tu internet.";
      } else if (error.code === 'auth/too-many-requests') {
        mensajeError = "Demasiados intentos. Intenta más tarde.";
      }

      Alert.alert("Fallo de Acceso", mensajeError);
    }
  };

  return (
    <View style={globalStyles.mainContainer}>
      <View style={globalStyles.scrollContent}>
        <Text style={globalStyles.title}>Acceso Organizadores</Text>

        <TextInput 
          style={globalStyles.input}
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput 
          style={globalStyles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[globalStyles.input, { backgroundColor: '#000', opacity: cargando ? 0.7 : 1 }]}
          onPress={manejarLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={globalStyles.btnText}>ENTRAR</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' }
});