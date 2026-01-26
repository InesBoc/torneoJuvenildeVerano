
# torneoJuvenildeVerano

Torneo Juvenil de Verano - TJV App
Tigres Rugby Club - Sistema de Inscripciones
Aplicación móvil y web desarrollada con React Native y Firebase para la gestión de inscripciones de clubes al Torneo Juvenil de Verano.
________________________________________
Características
•	Gestión de Inscripciones: Registro de datos del club, selección de categorías y carga de listas de buena fe.
•	Validaciones en Tiempo Real: Control de categorías por año de nacimiento (2010-2014), validación de DNI y cupos mínimos y máximos de jugadoras. No se puede finalizar la inscripción sin adjuntar un comprobante de pago.
•	Generación de Documentación: Creación automática de PDF con la lista de buena fe de jugadoras y cuerpo técnico.
•	Panel de Administración: Acceso restringido para organizadores donde pueden aprobar inscripciones y verificar comprobantes de pago.
•	Persistencia de Datos: Integración con Firebase Firestore para almacenamiento y Firebase Storage para archivos.
•	Multiplataforma: Funcionamiento garantizado en Android, iOS y Web (Fallback para alertas y navegación).
________________________________________
Tecnologías Utilizadas
•	Framework: React Native (Expo SDK)
•	Lenguaje: JavaScript (ES6+)
•	Base de Datos: Firebase Firestore
•	Autenticación: Firebase Auth
•	Navegación: React Navigation (Stack)
•	PDF & Sharing: Expo Print y Expo Sharing
•	Estilos: StyleSheet API (Diseño responsivo)

________________________________________
Estructura del Proyecto
Plaintext

├── App.js                 # Punto de entrada y configuración de Rutas
├── MapaProxy.js           # Componente puente para Mapas (Nativo/Web)
└── src/
    ├── components/        # Componentes reutilizables (Botones, Tarjetas)
    ├── context/           # Context API para el estado global de la inscripción
    ├── screens/           # Pantallas principales
    │   ├── HomeScreen.js
    │   ├── DatosClubScreen.js
    │   ├── ListaBuenaFe.js
    │   ├── AdminDashboard.js
    │   └── ...
    ├── services/          # Configuración de Firebase
    └── styles/            # Estilos globales y temas

Autor

María Inés Bocanera - Desarrollo Integral - [(https://github.com/InesBoc)]

