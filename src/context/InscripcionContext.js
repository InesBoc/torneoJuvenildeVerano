import React, { createContext, useState, useContext } from 'react';

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

  // ELIMINAMOS los useEffect que usaban AsyncStorage

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

  const limpiarRegistro = () => {
    // Ahora es mucho más simple: solo resetea el estado en memoria
    setDatosInscripcion(inscripcionInicial);
  };

  return (
    <InscripcionContext.Provider value={{ datosInscripcion, actualizarClub, guardarEquipo, limpiarRegistro }}>
      {children}
    </InscripcionContext.Provider>
  );
};

export const useInscripcion = () => useContext(InscripcionContext);