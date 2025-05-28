## Descripción de archivos

---

### LoginScreen.tsx  
Este archivo define la pantalla de inicio de sesión (LoginScreen) para una aplicación móvil construida con React Native, Firebase y Expo Router.  
Su función principal es permitir que los usuarios ingresen con su correo y contraseña utilizando el contexto de autenticación (AuthContext).  
Si el usuario es nuevo, será redirigido a una pantalla de selección de intereses; si no, será enviado al menú principal.  
El componente gestiona el estado de carga de la autenticación y proporciona retroalimentación visual mediante un ActivityIndicator.  
Además, incluye navegación hacia una pantalla de registro para nuevos usuarios.  
La interfaz está diseñada con estilos personalizados e incluye un logo institucional en la parte superior.

---

### RegisterScreen.tsx  
Este archivo define la pantalla de registro de usuarios (RegisterScreen) dentro de una aplicación desarrollada con React Native, Firebase y Expo.  
Su propósito es permitir que nuevos usuarios creen una cuenta mediante correo electrónico y contraseña, utilizando el método register del contexto de autenticación (AuthContext).  
Una vez completado el registro, se muestra una alerta indicando el éxito del proceso.  
El archivo también incluye navegación hacia la pantalla de inicio de sesión para usuarios ya registrados.  
La interfaz visual presenta un diseño limpio, con campos de entrada, un botón de registro y el logo institucional, todo dentro de un contenedor desplazable (ScrollView).  
También maneja el estado de carga (authLoading) para desactivar el botón y mostrar un ActivityIndicator durante el proceso.

---

### SeleccionIntereses.tsx  
Este archivo define la pantalla de selección de intereses para usuarios nuevos (SeleccionIntereses), en una aplicación construida con React Native, Firebase y Expo.  
Su propósito es permitir que los usuarios seleccionen categorías de interés (como Gastronomía, Cultura, Shopping, etc.) luego de registrarse.  
Los intereses seleccionados se almacenan en Firebase Firestore bajo el documento del usuario autenticado, y también se guarda la sesión del usuario en AsyncStorage para persistencia local.  
Una vez guardadas las preferencias, el usuario es redirigido al menú principal sin posibilidad de retroceder.  
Además, se actualiza el estado de autenticación marcando al usuario como no nuevo (setIsNewUser(false)), lo que evita que vuelva a ver esta pantalla en sesiones futuras.  
La interfaz utiliza botones táctiles estilizados para representar cada interés y un botón de confirmación para finalizar el proceso.

---

### ChatCultura.tsx  
Este archivo define el componente ChatCultura, una pantalla de chat interactivo que permite al usuario recibir información detallada sobre un lugar cultural local utilizando la API de Gemini (modelo de lenguaje de Google).  
El componente recibe como parámetro un objeto lugar con información básica del sitio seleccionado.  
Al montarse, genera automáticamente una consulta detallada sobre dicho lugar que es enviada al modelo, y muestra la respuesta del bot como un mensaje en pantalla.  
El usuario también puede enviar sus propios mensajes y recibir respuestas generadas dinámicamente.  
Toda la interacción se muestra mediante una lista de mensajes tipo chat.  
Incluye un botón para regresar a la pantalla anterior, un input de texto y un botón de envío.  
También muestra un ActivityIndicator cuando se está esperando respuesta del modelo.  
La funcionalidad está basada en fetch, gestionando tanto errores como estados de carga de forma sencilla.

---

### ViewCultura.tsx  
Este archivo define el componente ViewCultura, una pantalla de exploración interactiva que permite al usuario descubrir lugares culturales en su entorno utilizando datos obtenidos de la Overpass API (basada en OpenStreetMap) y la API de geocodificación de OpenCageData.  
Al montarse, el componente realiza una consulta a Overpass para obtener lugares con etiquetas relevantes como museos, monumentos, centros de arte, entre otros.  
Por cada lugar recuperado, se realiza una consulta adicional para obtener su dirección exacta a partir de sus coordenadas.  
Los resultados se visualizan en un mapa interactivo mediante marcadores.  
La pantalla incluye un panel deslizante (bottom sheet) animado que permite explorar la lista completa de lugares culturales encontrados, mostrando su nombre, dirección y un botón que permite abrir un chat contextual sobre dicho lugar.  
También se incluye una navegación inferior hacia otras categorías de lugares como gastronomía, entretenimiento y compras.  
El componente gestiona de forma animada la expansión y contracción del panel inferior mediante react-native-reanimated y react-native-gesture-handler, adaptando dinámicamente la altura del mapa según el estado del panel.  
Además, se emplea control de carga y errores para asegurar una experiencia fluida, y se muestra un mensaje informativo en caso de que no se encuentren resultados.

---

### ChatEntretenimiento.tsx  
Este archivo define el componente ChatEntretenimiento, una pantalla de chat interactiva que permite al usuario obtener información detallada y creativa sobre un lugar de entretenimiento local mediante la API de Gemini (modelo de lenguaje de Google).  
El componente recibe como parámetro un objeto lugar con información básica del sitio seleccionado desde ViewEntretenimiento.  
Al montarse, genera automáticamente un mensaje inicial que describe el lugar y solicita a la IA que lo expanda con detalles como actividades disponibles (cine, juegos, centros comerciales, etc.), historia posible, ubicación aproximada y otros datos interesantes.  
La respuesta del modelo se muestra como un mensaje de tipo "bot".  
El usuario también puede continuar la conversación enviando sus propias preguntas, y cada interacción se muestra en una lista de estilo chat.  
La pantalla incluye un botón para regresar, un campo de texto para ingresar preguntas, un botón de envío y un indicador de carga (ActivityIndicator) mientras se espera la respuesta.  
Toda la comunicación con el modelo se maneja mediante fetch, incluyendo el manejo de errores y el control de estado de carga para asegurar una experiencia fluida.

---

### ViewEntretenimiento.tsx  
Este archivo define el componente ViewEntretenimiento, una pantalla interactiva que muestra lugares de ocio y entretenimiento (como cines, parques, teatros y clubes nocturnos) en un mapa georreferenciado y una lista desplegable.  
El componente obtiene datos de OpenStreetMap mediante la API Overpass y enriquece la información con geocodificación inversa usando OpenCage para obtener direcciones legibles.  
La pantalla presenta un mapa con marcadores interactivos y un panel inferior deslizable que contiene una lista completa de lugares.  
Cada marcador puede seleccionarse para centrar el mapa en esa ubicación, mientras que cada ítem de la lista incluye un botón "Preguntar" que redirige a un chat de IA con los detalles del lugar.  
La interfaz incorpora animaciones fluidas para el panel desplegable, gestos táctiles para controlar su expansión/contracción, y un menú inferior de navegación entre categorías (Gastronomía, Cultura, etc.).  
El diseño responde dinámicamente a las interacciones del usuario, ajustando el tamaño del mapa según la posición del panel y mostrando indicadores de carga durante la obtención de datos.

---

### ChatGastronomia.tsx  
Este archivo define el componente ChatGastronomia, una interfaz de chat interactivo que permite al usuario obtener información detallada sobre restaurantes locales mediante la API de Gemini (modelo de lenguaje de Google).  
El componente recibe como parámetro un objeto restaurante con información básica del establecimiento seleccionado desde la pantalla anterior.  
Al iniciar, genera automáticamente una consulta estructurada solicitando detalles como tipo de cocina, historia, ubicación y datos curiosos, mostrando la respuesta como primer mensaje del chatbot.  
La pantalla incluye un historial de conversación estilo burbujas de chat (diferenciando mensajes del usuario y del bot), un campo de texto para nuevas preguntas, un botón de envío y un botón de retroceso.  
La comunicación con la API se maneja mediante fetch, con gestión de estados de carga y errores.  
Las respuestas del modelo se procesan y muestran en formato legible, permitiendo conversaciones extendidas sobre el restaurante seleccionado.  
El diseño utiliza estilos personalizados para una experiencia de usuario intuitiva, con indicadores visuales durante las solicitudes a la API.

---

### HomeScreen.tsx  
Este archivo define la pantalla principal de la aplicación (HomeScreen), que actúa como punto de entrada para mostrar distintos lugares según su categoría: gastronomía, cultura o entretenimiento.  
Al iniciarse, la pantalla solicita permisos de ubicación al usuario utilizando expo-location y, si se conceden, obtiene su ubicación actual.  
Una vez que se obtiene la ubicación, la pantalla hace una consulta a Firebase Firestore para traer los lugares almacenados, los cuales se filtran por categoría y se almacenan en el estado.  
Los lugares se muestran sobre un mapa interactivo (MapView) como marcadores personalizados con íconos diferentes según la categoría.  
Además, se implementa un componente tipo bottom sheet (BottomSheet) que muestra los lugares de la categoría seleccionada con una imagen y nombre.  
Al tocar un marcador o un lugar del bottom sheet, el usuario es navegado a la pantalla de detalles correspondiente (ViewGastronomia, ViewCultura, o ViewEntretenimiento), dependiendo del tipo de lugar.  
El archivo también contiene animaciones para los botones flotantes de categoría (gastronomía, cultura y entretenimiento), que se expanden o contraen al presionarlos.  
Se hace uso de useRef, useEffect, useState, Animated, y navegación con useNavigation para lograr una experiencia fluida e interactiva.

---

### MainMenu.tsx  
Este archivo define el componente MainMenu, una pantalla principal de navegación que actúa como centro de bienvenida y acceso a diferentes secciones de la aplicación turística ChíaTur.  
Incluye información cultural y curiosidades sobre el municipio de Chía, además de opciones para explorar categorías como gastronomía, cultura, entretenimiento y compras.  
El componente integra funcionalidades avanzadas como el escaneo de códigos QR utilizando expo-camera.  
Cuando se activa la cámara y se escanea un código, se valida si el contenido corresponde a uno de los lugares predefinidos.  
Si es válido, se muestra un mensaje de aprobación y se redirige a la pantalla correspondiente. En caso contrario, se notifica al usuario que el código no es reconocido.  
Además, el MainMenu ofrece un botón para cerrar sesión usando el contexto de autenticación (useAuth), un botón flotante central de navegación hacia la pantalla de inicio, y un menú inferior que permite cambiar entre las secciones principales.  
Se utilizan useRouter y usePathname de expo-router para gestionar la navegación dinámica y resaltar el ítem activo del menú.  
También se presenta una sección superior con información educativa y cultural, utilizando elementos visuales como imágenes, íconos y texto para mejorar la experiencia del usuario.  
Toda la interfaz está estilizada con StyleSheet, asegurando una presentación visual coherente y atractiva.

---

### CasaDeLaCultura.tsx  
Este archivo define el componente CasaDeLaCultura, una pantalla informativa en React Native que muestra detalles sobre la Casa de la Cultura de Chía con un logo, título, texto descriptivo e imagen dentro de un ScrollView.  
Incluye un menú inferior fijo con botones para navegar a las secciones Gastronomía, Cultura, Entretenimiento y Compras, destacando el botón activo, y un botón flotante central que dirige al menú principal.  
La navegación se maneja con useRouter y usePathname de expo-router para detectar la pantalla actual y redirigir correctamente.  
Los estilos usan StyleSheet, predominando tonos verdes y bordes redondeados para garantizar una interfaz visual atractiva y fácil de usar.

---

### MiradorYerbabuena.tsx  
Este archivo define el componente MiradorYerbabuena, una pantalla en React Native que muestra información sobre el Mirador Yerbabuena, incluyendo un logo, título, texto descriptivo y una imagen dentro de un ScrollView.  
Contiene un menú inferior fijo con botones para navegar a las secciones Gastronomía, Cultura, Entretenimiento y Compras, resaltando el botón activo según la ruta actual.  
También incluye un botón flotante central que dirige al menú principal.  
La navegación se maneja con useRouter y usePathname de expo-router para controlar la navegación y el estilo activo.  
Los estilos están definidos con StyleSheet, usando tonos verdes y bordes redondeados para una presentación visual coherente y atractiva.

---

### ParqueOspina.tsx  
Este archivo define el componente ParqueOspina, una pantalla en React Native que muestra información sobre el Parque Ospina, incluyendo un logo, título, texto descriptivo y una imagen dentro de un ScrollView.  
Incluye un menú inferior fijo con botones para navegar a las secciones Gastronomía, Cultura, Entretenimiento y Compras, resaltando el botón activo según la ruta actual.  
También tiene un botón flotante central que dirige al menú principal.  
La navegación se gestiona con useRouter y usePathname de expo-router para controlar la navegación y el estilo activo.  
Los estilos están definidos con StyleSheet, utilizando colores verdes y bordes redondeados para una apariencia coherente y atractiva.

---

### ParquePuenteComun.tsx  
Componente React Native que presenta información sobre el Parque Puente Comun con texto, imágenes y estilo personalizado.  
Incluye un menú inferior fijo con navegación entre Gastronomía, Cultura, Entretenimiento y Compras, resaltando la sección activa.  
Cuenta con un botón flotante central para volver al menú principal.  
La navegación usa useRouter y usePathname para detectar y controlar la ruta activa.  
Los estilos usan tonos verdes y bordes redondeados para mantener la coherencia visual.

---

### CasaDelCampesino.tsx  
Componente React Native que muestra información de la Casa del Campesino, con texto, imagen y estilo personalizado.  
Incluye un menú inferior fijo para navegar entre las categorías principales, con el botón activo resaltado.  
Contiene un botón flotante central para regresar al menú principal.  
La navegación está gestionada con useRouter y usePathname de expo-router.  
Los estilos emplean tonos verdes y bordes redondeados para una interfaz consistente y agradable.

---

### VistaCompras.tsx  
Componente React Native que presenta la sección de Compras, mostrando tiendas y comercios de Chía.  
Incluye navegación inferior fija para cambiar entre Gastronomía, Cultura, Entretenimiento y Compras, con resaltado del ítem activo.  
Cuenta con un botón flotante central que lleva al menú principal.  
La navegación usa useRouter y usePathname de expo-router.  
Los estilos están definidos con StyleSheet, usando colores verdes y bordes redondeados para coherencia visual.

---

### ViewGastronomia.tsx  
Componente React Native que muestra restaurantes y opciones gastronómicas en un mapa interactivo y lista desplegable.  
Obtiene datos de OpenStreetMap mediante Overpass API y geocodificación con OpenCage para direcciones legibles.  
Presenta un panel inferior deslizable con la lista de restaurantes, que se puede expandir o contraer con gestos táctiles.  
Incluye navegación a un chat con IA para consultas detalladas sobre cada restaurante.  
Incorpora animaciones fluidas, manejo de estados y carga, y navegación inferior para cambiar entre categorías.  
Utiliza react-native-reanimated, react-native-gesture-handler, y react-navigation para una experiencia interactiva.

---

### BottomSheetAnimated.tsx  
Componente React Native que implementa un bottom sheet animado con react-native-reanimated y react-native-gesture-handler.  
Permite mostrar contenido desplegable desde la parte inferior de la pantalla con animaciones suaves.  
Se usa para listar elementos como lugares culturales, gastronómicos o de entretenimiento.  
El componente gestiona el arrastre vertical y el snap a posiciones predefinidas para expandir o contraer el panel.  
Incluye soporte para controlar la altura dinámica del mapa o contenido visible según el estado del bottom sheet.

---

### iconGastronomia.tsx  
Archivo que exporta iconos SVG personalizados para representar la categoría gastronomía en el mapa y la interfaz.  
Incluye íconos como cubiertos, platos, o elementos culinarios diseñados para integrarse en la UI de la aplicación.

---

### iconCultura.tsx  
Archivo que exporta iconos SVG personalizados para representar la categoría cultura en la aplicación.  
Incluye símbolos culturales, monumentos o arte que se usan para marcar lugares culturales en el mapa y menús.

---

### iconEntretenimiento.tsx  
Archivo que exporta iconos SVG personalizados para la categoría entretenimiento.  
Incluye iconos como cine, teatro, juegos o eventos que ayudan a identificar lugares de ocio en la aplicación.

---

### FloatingButtonCentral.tsx  
Componente React Native que crea un botón flotante central en la interfaz, usado para navegar rápidamente al menú principal o pantalla home.  
Incluye animaciones para que el botón aparezca o desaparezca según el contexto y estado de navegación.  
Diseñado para mejorar la experiencia del usuario facilitando accesos rápidos en la aplicación.

---

### MenuInferior.tsx  
Componente React Native que implementa un menú inferior fijo con botones para navegar entre las categorías principales (Gastronomía, Cultura, Entretenimiento, Compras).  
Resalta el ítem activo basado en la ruta actual usando usePathname de expo-router.  
Incluye iconos personalizados para cada categoría.  
Complementa la navegación principal junto con el botón flotante central.

---

### MainRouter.tsx  
Archivo que define las rutas principales de la aplicación usando Expo Router y React Navigation.  
Establece rutas privadas y públicas, manejo de pantallas de login, registro, selección de intereses, y pantallas principales de la app.  
Configura los layouts de navegación y gestiona la autenticación para controlar acceso a contenido protegido.

---

### authContext.tsx  
Archivo que define el contexto de autenticación (AuthContext) para gestionar login, registro, estado de usuario y cierre de sesión usando Firebase Authentication.  
Proporciona funciones como login, register, logout y gestión de usuarios nuevos para controlar el flujo de autenticación en toda la app.  
Incluye manejo de estados de carga y errores para mejorar la experiencia de usuario.

---

### storage.tsx  
Archivo que contiene funciones utilitarias para almacenar y recuperar datos en AsyncStorage, incluyendo sesiones de usuario y preferencias.  
Permite persistir información localmente para mejorar la experiencia y mantener estado entre sesiones.

---

### useAuth.tsx  
Hook personalizado que consume AuthContext para exponer el estado de autenticación y funciones asociadas (login, logout, register).  
Simplifica el acceso al contexto de autenticación en cualquier componente funcional.

---

### utils.tsx  
Archivo con funciones auxiliares y utilidades varias usadas en la aplicación, como formateo de fechas, manejo de errores, validaciones y otros helpers comunes.

---

### firebaseConfig.tsx  
Archivo que configura la conexión con Firebase, incluyendo credenciales del proyecto, inicialización del SDK y exportación de instancias para Authentication y Firestore.

---

### README.md  
Archivo de documentación general del proyecto con instrucciones de instalación, uso, estructura de archivos y contribuciones.

---

## Fin de la descripción
