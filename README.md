# China Trip Planner 🇨🇳

Una aplicación web moderna, interactiva y premium para gestionar tu itinerario y organizar todos los detalles de tu viaje a China (Barcelona - Shanghái - Chongqing - Chengdu - Xi'an - Pekín - Barcelona).

El proyecto está construido en **Next.js** y utiliza **Supabase** como base de datos en la nube para permitir la sincronización colaborativa en tiempo real entre múltiples dispositivos.

---

## ✨ Características Principales

1. **Itinerario Diario Interactivo**: 
   - Línea de tiempo vertical pre-poblada con tu ruta del **17 al 31 de Julio de 2026**.
   - Permite filtrar por ciudad para una navegación rápida.
   - Drawer/Cajón de edición para modificar alojamientos, transportes y notas sobre la marcha.
   - Posibilidad de añadir, reordenar y eliminar actividades detalladas dentro de cada día.
2. **Dashboard de Resumen**:
   - Cuenta atrás en tiempo real hasta la salida el 17 de Julio.
   - Reloj dual con la hora local de España y la hora oficial de Pekín (China, UTC+8).
   - Métricas clave del viaje (días, número de hoteles y medios de transporte reservados).
   - Checklist de preparativos críticos (Visa, configuración de eSIM/VPN, etc.).
   - Guía climática histórica para las ciudades a visitar en Julio.
3. **Gestión de Gastos**:
   - Registro inteligente de costes categorizados (Vuelos, Hoteles, Trenes, Comida, Entradas, Compras, Otros).
   - Conversor automático y dinámico de euros (€) a yuanes (¥) con tasa de cambio editable en pantalla.
   - Barra de progreso del presupuesto total y gráficos de desglose porcentual.
4. **Lista de Equipaje (Packing List)**:
   - Checklist interactiva organizada por categorías (Documentos, Ropa, Electrónica, Botiquín).
   - Añade y elimina artículos dinámicamente con barras de progreso de equipaje.
5. **Guía de Supervivencia China**:
   - Listado y explicación de las aplicaciones móviles imprescindibles en China (Alipay, WeChat, VPNs, Baidu Maps).
   - Consejos culturales prácticos sobre métodos de pago, agua, trenes bala y saneamiento.
   - Diccionario visual de frases esenciales en español y pinyin.
   - **Lector de audio integrado (Text-to-Speech)**: Haz clic en el botón de altavoz en cualquier frase para escuchar su pronunciación correcta en mandarín nativo.

---

## 🚀 Guía de Despliegue en la Nube (Vercel + Supabase)

### 1. Configurar Base de Datos en Supabase (Gratis)
Para almacenar tus datos compartidos en tiempo real:
1. Regístrate o inicia sesión en **[Supabase](https://supabase.com)**.
2. Crea un nuevo proyecto llamado `ChinaTrip`.
3. Una vez creado el proyecto, ve al **SQL Editor** en el menú lateral izquierdo de Supabase.
4. Haz clic en **New query** (Nueva consulta), pega el siguiente script SQL y haz clic en **Run** (Ejecutar):
   ```sql
   create table trips (
     id text primary key,
     data jsonb not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Habilitar lectura/escritura pública sencilla para compartir el enlace sin login
   alter table trips enable row level security;
   create policy "Permitir acceso publico" on trips for all using (true) with check (true);
   ```
5. Ve a **Project Settings** (icono de engranaje) ➔ **API** y copia los siguientes valores:
   - **Project URL** (ej. `https://xxxxxx.supabase.co`)
   - **API Key (service_role)** (copia la clave secreta `service_role` para poder guardar datos desde el servidor de Next.js de forma segura).

---

## 2. Desplegar la Web en Vercel (Gratis)
Vercel compilará tu aplicación Next.js y la conectará a tu cuenta de GitHub de forma que cualquier cambio que subas a este repositorio se actualizará automáticamente online:

1. Entra en tu panel de **[Vercel](https://vercel.com/dashboard)** e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **Add New** ➔ **Project** (Añadir nuevo ➔ Proyecto).
3. Busca e importa tu repositorio **`ChinaTrip`** de la lista.
4. En la sección **Environment Variables** (Variables de entorno), añade estas dos variables con las claves de Supabase que copiaste en el paso anterior:
   - Nombre: `SUPABASE_URL` | Valor: *(Tu Project URL)*
   - Nombre: `SUPABASE_SERVICE_ROLE_KEY` | Valor: *(Tu clave service_role)*
5. Haz clic en el botón **Deploy** (Desplegar).

¡Listo! En menos de un minuto tu aplicación estará publicada y Vercel te proporcionará un enlace permanente (`https://tu-viaje.vercel.app`).

### 🔗 Compartir y Sincronizar en Tiempo Real:
Carga la web añadiendo una ID secreta en el parámetro URL, por ejemplo:
`https://tu-viaje.vercel.app/?trip=nuria-viaje`

Cualquier persona que acceda a esa URL (tu pareja, amigos o tú desde el móvil) verá exactamente el mismo itinerario y podrá añadir gastos, cambiar actividades o tachar equipaje sincronizándose al instante. Si no se configuran variables de entorno, los datos se guardarán de forma local en la memoria de tu navegador (`localStorage`).
