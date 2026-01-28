import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const inscripcionInicial = {
  club: {
    nombre: '',
    ciudad: '',
    cantSub14: 0,
    cantSub16: 0,
    responsable: '', 
    email: '',
    telefono: ''
  },
  equipos: [],
};

const InscripcionContext = createContext();

export const InscripcionProvider = ({ children }) => {
  const [datosInscripcion, setDatosInscripcion] = useState(inscripcionInicial);

  useEffect(() => {
    const recuperarDatos = async () => {
      try {
        const guardado = await AsyncStorage.getItem('@registro_tjv');
        if (guardado) {
          setDatosInscripcion(JSON.parse(guardado));
        }
      } catch (e) {
        console.error("Error recuperando persistencia", e);
      }
    };
    recuperarDatos();
  }, []);

  useEffect(() => {
    const guardarEnTelefono = async () => {
      try {
        await AsyncStorage.setItem('@registro_tjv', JSON.stringify(datosInscripcion));
      } catch (e) {
        console.error("Error guardando datos", e);
      }
    };
    if (datosInscripcion !== inscripcionInicial) {
        guardarEnTelefono();
    }
  }, [datosInscripcion]);

  const actualizarClub = (info) => {
    setDatosInscripcion(prev => ({ 
      ...prev, 
      club: { ...prev.club, ...info } 
    }));
  };

  const guardarEquipo = (equipoEditado) => {
    setDatosInscripcion(prev => {
      const existeIdx = prev.equipos.findIndex(e => e.id === equipoEditado.id);
      
      let nuevosEquipos;
      if (existeIdx > -1) {
        nuevosEquipos = [...prev.equipos];
        nuevosEquipos[existeIdx] = equipoEditado;
      } else {
        nuevosEquipos = [...prev.equipos, equipoEditado];
      }

      return { ...prev, equipos: nuevosEquipos };
    });
  };

  const limpiarRegistro = async () => {

    try {
      await AsyncStorage.removeItem('@registro_tjv');
    } catch (e) {
      console.error("Error al limpiar persistencia", e);
    }
    setDatosInscripcion(inscripcionInicial);
  };

  return (
    <InscripcionContext.Provider value={{ datosInscripcion, actualizarClub, guardarEquipo, limpiarRegistro }}>
      {children}
    </InscripcionContext.Provider>
  );
};

export const useInscripcion = () => useContext(InscripcionContext);