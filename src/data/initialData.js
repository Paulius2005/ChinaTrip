export const initialItinerary = [
  {
    id: "day-1",
    date: "2026-07-17",
    dayOfWeek: "Viernes",
    city: "En tránsito",
    title: "Vuelo Barcelona (BCN) - Shanghái",
    transport: {
      type: "flight",
      details: "Vuelo transcontinental BCN - PVG (Shanghái). Llegada al día siguiente.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Noche a bordo del avión",
      address: "Cabina de vuelo",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-1-1", time: "12:00", title: "Llegada al Aeropuerto de Barcelona-El Prat", description: "Llegar con 3 horas de antelación. Facturación de equipaje y control de pasaportes.", category: "transit" },
      { id: "act-1-2", time: "15:30", title: "Salida del vuelo", description: "Vuelo con escala hacia Shanghái Pudong (PVG). ¡Comienza la aventura!", category: "transit" }
    ],
    notes: "Asegúrate de llevar el pasaporte físico, copia del visado (si aplica) y la confirmación de los vuelos. Descarga la eSIM o configura la VPN antes de despegar."
  },
  {
    id: "day-2",
    date: "2026-07-18",
    dayOfWeek: "Sábado",
    city: "Shanghái",
    title: "Llegada a Shanghái",
    transport: {
      type: "taxi",
      details: "Maglev (tren de levitación magnética) o Taxi desde el Aeropuerto PVG al hotel.",
      bookingStatus: "pending"
    },
    lodging: {
      name: "The Bund Hotel (o similar)",
      nameChinese: "上海外滩大酒店",
      address: "528 Henan Middle Rd, Huangpu, Shanghai",
      addressChinese: "上海市黄浦区河南中路528号 (近北京东路)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-2-1", time: "10:30", title: "Aterrizaje en Shanghái Pudong (PVG)", description: "Control sanitario, inmigración, recogida de maletas. Retirar yuanes en cajero del aeropuerto o pagar con Alipay/WeChat Pay.", category: "transit" },
      { id: "act-2-2", time: "13:00", title: "Check-in en el Hotel", description: "Registro con el pasaporte original (obligatorio en todos los hoteles de China). Descanso corto para recuperarse del jet lag.", category: "hotel" },
      { id: "act-2-3", time: "18:00", title: "Paseo atardecer por The Bund (El Malecón)", description: "Primer contacto visual con el skyline futurista de Pudong y los edificios coloniales de Puxi. Cruce en ferry público si hay tiempo.", category: "sightseeing" },
      { id: "act-2-4", time: "20:00", title: "Cena de bienvenida en Nanjing Road", description: "Probar las famosas empanadillas Shengjianbao (dumplings fritos de Shanghái).", category: "dining" }
    ],
    notes: "Instala el miniprograma de transporte de Shanghái en Alipay para pagar el metro fácilmente."
  },
  {
    id: "day-3",
    date: "2026-07-19",
    dayOfWeek: "Domingo",
    city: "Shanghái",
    title: "El Shanghái clásico y futurista",
    transport: {
      type: "metro",
      details: "Metro de Shanghái (Líneas 2 y 10).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "The Bund Hotel (o similar)",
      nameChinese: "上海外滩大酒店",
      address: "528 Henan Middle Rd, Huangpu, Shanghai",
      addressChinese: "上海市黄浦区河南中路528号 (近北京东路)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-3-1", time: "09:00", title: "Jardín Yuyuan y Ciudad Vieja", description: "Pasear por el jardín tradicional del siglo XVI y los bazares de madera colindantes. Tomar un té verde.", category: "sightseeing" },
      { id: "act-3-2", time: "13:00", title: "Almuerzo de Xiao Long Bao", description: "Comer los famosos dumplings de caldo en Nanxiang Steamed Bun Restaurant.", category: "dining" },
      { id: "act-3-3", time: "15:00", title: "Cruzar a Pudong y subir a la Torre de Shanghái", description: "Subir al segundo rascacielos más alto del mundo (632m) para contemplar las vistas panorámicas.", category: "sightseeing" },
      { id: "act-3-4", time: "18:30", title: "Paseo por la Concesión Francesa", description: "Caminar bajo los árboles plátanos en la zona de Xintiandi o Tianzifang, lleno de tiendas boutique y cafeterías.", category: "sightseeing" }
    ],
    notes: "Comprar las entradas de la Torre de Shanghái con antelación en WeChat/Trip.com si es posible."
  },
  {
    id: "day-4",
    date: "2026-07-20",
    dayOfWeek: "Lunes",
    city: "Shanghái - Chongqing",
    title: "Trayecto a Chongqing: La Ciudad de Montaña",
    transport: {
      type: "train",
      details: "Tren de alta velocidad Shanghái - Chongqing (aprox. 7-11 horas) o Vuelo doméstico (aprox. 3 horas).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Jiefangbei Mountain View Hotel",
      nameChinese: "重庆解放碑山景酒店",
      address: "Jiefangbei Pedestrian Street, Yuzhong District, Chongqing",
      addressChinese: "重庆市渝中区解放碑步行街/民族路",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-4-1", time: "08:00", title: "Traslado a la estación de tren / aeropuerto", description: "Check-out del hotel en Shanghái y transporte matutino.", category: "transit" },
      { id: "act-4-2", time: "15:30", title: "Llegada a Chongqing y Check-in", description: "Sorprenderse con la verticalidad de la ciudad construida sobre colinas y ríos.", category: "hotel" },
      { id: "act-4-3", time: "18:30", title: "Visita nocturna a Hongyadong", description: "Espectacular complejo de edificios tradicionales colgados en el acantilado iluminados de color dorado. Parece sacado de El Viaje de Chihiro.", category: "sightseeing" },
      { id: "act-4-4", time: "20:30", title: "Cena de Hot Pot de Chongqing", description: "Probar el famoso caldero picante (puedes pedir caldo partido no picante/picante). ¡Una experiencia obligatoria!", category: "dining" }
    ],
    notes: "Ojo: Google Maps no funciona bien aquí por la orografía y la falta de actualización. Usa Apple Maps o Baidu Maps."
  },
  {
    id: "day-5",
    date: "2026-07-21",
    dayOfWeek: "Martes",
    city: "Chongqing",
    title: "Explorando la ciudad tridimensional",
    transport: {
      type: "metro",
      details: "Metro flotante e intrincado de Chongqing.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Jiefangbei Mountain View Hotel",
      nameChinese: "重庆解放碑山景酒店",
      address: "Jiefangbei Pedestrian Street, Yuzhong District, Chongqing",
      addressChinese: "重庆市渝中区解放碑步行街/民族路",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-5-1", time: "09:30", title: "Estación de metro Liziba (Línea 2)", description: "Ver el metro que atraviesa un edificio residencial. Imprescindible para fotos.", category: "sightseeing" },
      { id: "act-5-2", time: "11:30", title: "Pueblo Antiguo de Ciqikou", description: "Pasear por calles tradicionales, comprar aperitivos y té.", category: "sightseeing" },
      { id: "act-5-3", time: "16:00", title: "Teleférico del Río Yangtze", description: "Cruzar el gran río en el teleférico histórico con vistas brutales.", category: "sightseeing" },
      { id: "act-5-4", time: "19:30", title: "Monumento de la Liberación (Jiefangbei)", description: "Zona comercial ultra-moderna rodeada de luces LED gigantes.", category: "sightseeing" }
    ],
    notes: "Prepárate para subir y bajar escaleras constantemente. Chongqing es conocida como la 'ciudad 8D'."
  },
  {
    id: "day-6",
    date: "2026-07-22",
    dayOfWeek: "Miércoles",
    city: "Chongqing",
    title: "Arte moderno y miradores de vértigo",
    transport: {
      type: "taxi",
      details: "Taxis locales / DiDi.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Jiefangbei Mountain View Hotel",
      nameChinese: "重庆解放碑山景酒店",
      address: "Jiefangbei Pedestrian Street, Yuzhong District, Chongqing",
      addressChinese: "重庆市渝中区解放碑步行街/民族路",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-6-1", time: "10:00", title: "Sichuan Fine Arts Institute", description: "Calle del grafiti y campus artístico con esculturas surrealistas.", category: "sightseeing" },
      { id: "act-6-2", time: "13:00", title: "Fideos picantes de Chongqing", description: "Almuerzo rápido de Chongqing Xiaomian.", category: "dining" },
      { id: "act-6-3", time: "15:30", title: "Raffles City Chongqing", description: "Visitar el masivo centro comercial y su mirador en las alturas.", category: "sightseeing" },
      { id: "act-6-4", time: "20:00", title: "Crucero nocturno Liangjiang", description: "Opcional: paseo en barco para ver el skyline iluminado.", category: "sightseeing" }
    ],
    notes: "Reserva las entradas del crucero con antelación si te interesa."
  },
  {
    id: "day-7",
    date: "2026-07-23",
    dayOfWeek: "Jueves",
    city: "Chongqing - Chengdu",
    title: "Viaje a Chengdu: Tierra de Pandas y Té",
    transport: {
      type: "train",
      details: "Tren rápido Chongqing - Chengdu East (1.5 horas).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Chengdu Zen Tea House Hotel",
      nameChinese: "成都禅茶一味酒店",
      address: "Wuhou District, Chengdu, Sichuan",
      addressChinese: "四川省成都市武侯区 (近武侯祠/锦里)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-7-1", time: "09:30", title: "Tren de alta velocidad a Chengdu", description: "Traslado a la estación y trayecto rápido.", category: "transit" },
      { id: "act-7-2", time: "12:00", title: "Llegada al hotel en Chengdu", description: "Hacer el check-in. Un ritmo de vida mucho más relajado.", category: "hotel" },
      { id: "act-7-3", time: "15:00", title: "Jinli Ancient Street", description: "Caminar por esta preciosa calle adornada con farolillos rojos.", category: "sightseeing" },
      { id: "act-7-4", time: "19:30", title: "Ópera de Sichuan (Face Changing)", description: "Espectáculo tradicional con acrobacias y cambio de máscaras en Shufeng Yayun.", category: "sightseeing" }
    ],
    notes: "Compra las entradas de la ópera con Trip.com antes del viaje para coger buenos asientos."
  },
  {
    id: "day-8",
    date: "2026-07-24",
    dayOfWeek: "Viernes",
    city: "Chengdu",
    title: "Base de Pandas Gigantes y Cultura del Té",
    transport: {
      type: "taxi",
      details: "Didi para ir a la base de pandas.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Chengdu Zen Tea House Hotel",
      nameChinese: "成都禅茶一味酒店",
      address: "Wuhou District, Chengdu, Sichuan",
      addressChinese: "四川省成都市武侯区 (近武侯祠/锦里)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-8-1", time: "07:00", title: "Base de Cría de Pandas Gigantes", description: "Ver a los pandas activos comiendo bambú fresco por la mañana.", category: "sightseeing" },
      { id: "act-8-2", time: "12:30", title: "Almuerzo de Mapo Tofu tradicional", description: "Comer en Chen Mapo Tofu, donde nació este mítico plato.", category: "dining" },
      { id: "act-8-3", time: "15:00", title: "Parque del Pueblo (People's Park)", description: "Sentarse en una casa de té tradicional, pedir té verde y relajarse.", category: "sightseeing" },
      { id: "act-8-4", time: "18:00", title: "Kuanzhai Xiangzi", description: "Callejones Anchos y Estrechos históricos con arquitectura tradicional.", category: "sightseeing" }
    ],
    notes: "La reserva para la base de pandas es obligatoria online y se agota rápido en verano. ¡Reservar con 7 días de antelación!"
  },
  {
    id: "day-9",
    date: "2026-07-25",
    dayOfWeek: "Sábado",
    city: "Chengdu",
    title: "Buda Gigante de Leshan",
    transport: {
      type: "train",
      details: "Tren rápido Chengdu - Leshan (1 hora) y bus local.",
      bookingStatus: "pending"
    },
    lodging: {
      name: "Chengdu Zen Tea House Hotel",
      nameChinese: "成都禅茶一味酒店",
      address: "Wuhou District, Chengdu, Sichuan",
      addressChinese: "四川省成都市武侯区 (近武侯祠/锦里)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-9-1", time: "08:30", title: "Tren bala a Leshan", description: "Visitar el Buda de piedra esculpido en acantilado más grande del mundo (71m).", category: "sightseeing" },
      { id: "act-9-2", time: "10:30", title: "Paseo en barco junto al Buda", description: "El barco ofrece vistas frontales increíbles sin tener que hacer colas.", category: "sightseeing" },
      { id: "act-9-3", time: "14:00", title: "Almuerzo en Leshan y regreso", description: "Probar especialidades locales de Leshan y tomar el tren de vuelta.", category: "transit" },
      { id: "act-9-4", time: "19:00", title: "Cena de Chuan Chuan Xiang", description: "Cenar brochetas hervidas en caldo Sichuan, divertido y barato.", category: "dining" }
    ],
    notes: "Si decides bajar a pie las escaleras al lado del Buda, prepárate para colas de 1 a 2 horas."
  },
  {
    id: "day-10",
    date: "2026-07-26",
    dayOfWeek: "Domingo",
    city: "Chengdu - Xi'an",
    title: "Rumbo a la antigua capital imperial",
    transport: {
      type: "train",
      details: "Tren rápido Chengdu - Xi'an North (aprox. 3-4 horas).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Bell Tower Hotel Xi'an",
      nameChinese: "西安钟楼饭店",
      address: "110 South Street, Beilin District, Xi'an",
      addressChinese: "陕西省西安市碑林区南大街110号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-10-1", time: "09:00", title: "Tren bala a Xi'an", description: "Cruzar las montañas Qinling en tren bala.", category: "transit" },
      { id: "act-10-2", time: "13:30", title: "Check-in en el Hotel de Xi'an", description: "Registro en un hotel al lado de la Torre de la Campana.", category: "hotel" },
      { id: "act-10-3", time: "16:00", title: "Bici por la Muralla Antigua", description: "Alquilar una bici arriba de la muralla del siglo XIV (14km).", category: "sightseeing" },
      { id: "act-10-4", time: "19:00", title: "Cena en el Barrio Musulmán", description: "Probar parrillas de cordero, Roujiamo (hamburguesa china) y Yangrou Paomo.", category: "dining" }
    ],
    notes: "Para alquilar la bici en la muralla se requiere dejar un depósito (puede ser digital por WeChat/Alipay)."
  },
  {
    id: "day-11",
    date: "2026-07-27",
    dayOfWeek: "Lunes",
    city: "Xi'an",
    title: "El Ejército de Terracota",
    transport: {
      type: "taxi",
      details: "Didi/Taxi o Bus turístico al museo.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Bell Tower Hotel Xi'an",
      nameChinese: "西安钟楼饭店",
      address: "110 South Street, Beilin District, Xi'an",
      addressChinese: "陕西省西安市碑林区南大街110号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-11-1", time: "08:30", title: "Guerreros de Terracota", description: "Ver los fosos de excavación con miles de figuras de arcilla a tamaño real.", category: "sightseeing" },
      { id: "act-11-2", time: "13:30", title: "Almuerzo de Biang Biang Noodles", description: "Probar estos fideos anchos famosos hechos a mano con abundante ajo.", category: "dining" },
      { id: "act-11-3", time: "16:00", title: "Gran Pagoda de la Oca Salvaje", description: "Templo budista de la dinastía Tang y pasear por los jardines.", category: "sightseeing" },
      { id: "act-11-4", time: "20:00", title: "Fuentes musicales en la Plaza de la Pagoda", description: "Show gratuito de agua y luces, el más grande de Asia.", category: "sightseeing" }
    ],
    notes: "La entrada a los Guerreros de Terracota requiere pasaporte físico original para acceder."
  },
  {
    id: "day-12",
    date: "2026-07-28",
    dayOfWeek: "Martes",
    city: "Xi'an - Pekín",
    title: "Viaje a Pekín: El centro del imperio",
    transport: {
      type: "train",
      details: "Tren rápido Xi'an - Beijing West (aprox. 4.5 horas).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Beijing Novotel Peace Hotel",
      nameChinese: "北京诺富特和平宾馆",
      address: "3 Jinyu Hutong, Wangfujing, Dongcheng, Beijing",
      addressChinese: "北京市东城区王府井金鱼胡同3号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-12-1", time: "08:30", title: "Tren bala hacia Pekín", description: "Traslado por la mañana y trayecto de alta velocidad.", category: "transit" },
      { id: "act-12-2", time: "14:30", title: "Check-in en Pekín", description: "Registro en el hotel situado en Wangfujing.", category: "hotel" },
      { id: "act-12-3", time: "17:00", title: "Paseo por los Hutongs de Houhai", description: "Caminar por callejones antiguos alrededor de los lagos de Houhai.", category: "sightseeing" },
      { id: "act-12-4", time: "19:30", title: "Cena en Wangfujing Street", description: "Cena en una zona peatonal vibrante rodeada de tiendas y comida.", category: "dining" }
    ],
    notes: "Para moverte por Pekín el metro es súper rápido y barato. Descarga el mapa offline de la app MetroMan."
  },
  {
    id: "day-13",
    date: "2026-07-29",
    dayOfWeek: "Miércoles",
    city: "Pekín",
    title: "La Ciudad Prohibida",
    transport: {
      type: "metro",
      details: "Metro de Pekín.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Beijing Novotel Peace Hotel",
      nameChinese: "北京诺富特和平宾馆",
      address: "3 Jinyu Hutong, Wangfujing, Dongcheng, Beijing",
      addressChinese: "北京市东城区王府井金鱼胡同3号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-13-1", time: "08:00", title: "Plaza de Tiananmén y Ciudad Prohibida", description: "Entrar al impresionante Palacio Imperial de las dinastías Ming y Qing.", category: "sightseeing" },
      { id: "act-13-2", time: "12:30", title: "Parque Jingshan (Colina del Carbón)", description: "Vistas panorámicas completas del tejado dorado de la Ciudad Prohibida.", category: "sightseeing" },
      { id: "act-13-3", time: "15:00", title: "Templo del Cielo", description: "Visitar el pabellón donde los emperadores rezaban por las cosechas.", category: "sightseeing" },
      { id: "act-13-4", time: "20:00", title: "Cena de Pato Pekín", description: "Probar el crujiente pato laqueado tradicional en restaurante local.", category: "dining" }
    ],
    notes: "¡ATENCIÓN! La Ciudad Prohibida cierra los lunes y las entradas salen a la venta con 7 días de antelación exacta a las 20:00 hora de China. Se agotan en SEGUNDOS."
  },
  {
    id: "day-14",
    date: "2026-07-30",
    dayOfWeek: "Jueves",
    city: "Pekín",
    title: "La Gran Muralla en Mutianyu",
    transport: {
      type: "taxi",
      details: "Coche privado / DiDi para ir a la Gran Muralla.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Beijing Novotel Peace Hotel",
      nameChinese: "北京诺富特和平宾馆",
      address: "3 Jinyu Hutong, Wangfujing, Dongcheng, Beijing",
      addressChinese: "北京市东城区王府井金鱼胡同3号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-14-1", time: "07:30", title: "Traslado a Mutianyu", description: "Trayecto de 1.5 horas al norte de Pekín para ir a la muralla.", category: "transit" },
      { id: "act-14-2", time: "09:30", title: "Paseo por la Gran Muralla", description: "Subida en teleférico y recorrer las torres de piedra rodeadas de vegetación.", category: "sightseeing" },
      { id: "act-14-3", time: "12:30", title: "Bajada en Tobogán", description: "Bajar deslizándote por el tobogán de metal gigante, divertidísimo.", category: "sightseeing" },
      { id: "act-14-4", time: "16:00", title: "Parada en el Estadio Olímpico", description: "Fotos exteriores del Nido de Pájaro iluminado de camino de vuelta.", category: "sightseeing" }
    ],
    notes: "Lleva calzado cómodo con buen agarre y agua de sobra; en julio hace bastante calor y humedad."
  },
  {
    id: "day-15",
    date: "2026-07-31",
    dayOfWeek: "Viernes",
    city: "Pekín - Barcelona",
    title: "Regreso a casa",
    transport: {
      type: "flight",
      details: "Vuelo internacional de vuelta Pekín - Barcelona.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Tu casa",
      address: "Barcelona",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-15-1", time: "09:00", title: "Compras de última hora", description: "Comprar té, palillos grabados o recuerdos en los hutongs.", category: "shopping" },
      { id: "act-15-2", time: "11:30", title: "Traslado al aeropuerto", description: "Check-out y trayecto al aeropuerto de Pekín.", category: "transit" },
      { id: "act-15-3", time: "14:50", title: "Vuelo de regreso a Barcelona", description: "Vuelo internacional aterrizando en Barcelona el mismo día.", category: "transit" }
    ],
    notes: "Asegúrate de tramitar Tax-Free en el aeropuerto si compraste artículos caros."
  }
];

export const initialPacking = [
  { id: "pack-1", category: "Documentos", item: "Pasaporte original (vigencia mínima de 6 meses)", checked: false },
  { id: "pack-2", category: "Documentos", item: "Visado de China impreso / captura (si aplica)", checked: false },
  { id: "pack-3", category: "Documentos", item: "Seguro médico de viaje (impreso y digital)", checked: false },
  { id: "pack-4", category: "Documentos", item: "Copias impresas de reservas de hoteles y billetes de tren", checked: false },
  { id: "pack-5", category: "Electrónica", item: "Adaptador de enchufe tipo A / I (enchufes chinos planos)", checked: false },
  { id: "pack-6", category: "Electrónica", item: "Batería externa (Powerbank) de máx 20.000 mAh", checked: false },
  { id: "pack-7", category: "Electrónica", item: "Móvil libre con eSIM instalada (Airalo, Holafly, etc.)", checked: false },
  { id: "pack-8", category: "Electrónica", item: "VPN configurada en móvil y portátil (Astrill, LetsVPN)", checked: false },
  { id: "pack-9", category: "Ropa", item: "Ropa ligera de algodón/lino (calor húmedo en julio)", checked: false },
  { id: "pack-10", category: "Ropa", item: "Zapatillas cómodas para caminar 20.000+ pasos diarios", checked: false },
  { id: "pack-11", category: "Ropa", item: "Chubasquero o paraguas pequeño (lluvias cortas de verano)", checked: false },
  { id: "pack-12", category: "Ropa", item: "Gorra y gafas de sol", checked: false },
  { id: "pack-13", category: "Botiquín", item: "Antidiarreicos (Fortasec) y suero oral (comida picante)", checked: false },
  { id: "pack-14", category: "Botiquín", item: "Medicamentos de uso personal con receta original", checked: false },
  { id: "pack-15", category: "Botiquín", item: "Protector solar alta graduación y repelente de mosquitos", checked: false }
];

export const initialSurvival = {
  apps: [
    { name: "Alipay", desc: "Esencial para pagos móviles, enlazar tarjeta Visa/Mastercard. Incluye DiDi (taxis) y transporte público local.", category: "Pagos" },
    { name: "WeChat", desc: "El WhatsApp de China. Se usa para chat, reservar entradas (Ciudad Prohibida) y pagar con WeChat Pay.", category: "Pagos y Chat" },
    { name: "Astrill / LetsVPN", desc: "VPNs para saltarse el Gran Cortafuegos de China. LetsVPN funciona de maravilla ahora mismo.", category: "Conectividad" },
    { name: "Apple Maps / Baidu Maps", desc: "Google Maps está obsoleto allí. Apple Maps funciona muy bien; si no, usa Baidu Maps.", category: "Navegación" },
    { name: "MetroMan", desc: "La mejor app de mapas de metro offline para todas las ciudades chinas.", category: "Navegación" },
    { name: "Microsoft Translator", desc: "Permite descargar diccionario offline de Chino para traducir con cámara y voz.", category: "Idioma" },
    { name: "Trip.com", desc: "Imprescindible para comprar billetes de tren bala con 15 días de antelación y reservar hoteles.", category: "Reservas" }
  ],
  phrases: [
    { esp: "Hola", pinyin: "Nǐ hǎo", hanzi: "你好" },
    { esp: "Gracias", pinyin: "Xièxie", hanzi: "谢谢" },
    { esp: "De nada", pinyin: "Bù kèqì", hanzi: "不客气" },
    { esp: "Adiós", pinyin: "Zàijiàn", hanzi: "再见" },
    { esp: "Por favor / Disculpe", pinyin: "Qǐng wèn", hanzi: "请问" },
    { esp: "Esto", pinyin: "Zhè ge", hanzi: "这个" },
    { esp: "¿Cuánto cuesta?", pinyin: "Duōshǎo qián?", hanzi: "多少钱？" },
    { esp: "No picante (muy importante)", pinyin: "Bù là", hanzi: "不辣" },
    { esp: "Tengo alergia a...", pinyin: "Wǒ duì ... guòmǐn", hanzi: "我对...过敏" },
    { esp: "Agua del grifo de agua hervida", pinyin: "Kāishuǐ", hanzi: "开水" },
    { esp: "La cuenta", pinyin: "Mǎidān", hanzi: "买单" },
    { esp: "Baño / Aseo", pinyin: "Cèsuǒ", hanzi: "厕所" },
    { esp: "No entiendo", pinyin: "Wǒ tīng bù dǒng", hanzi: "听不懂" }
  ],
  tips: [
    { title: "Pagos Digitales", content: "China apenas usa efectivo ni tarjetas tradicionales. Vincula tu Visa/Mastercard (como Revolut) en Alipay y WeChat Pay antes de entrar al país. El 99% de las transacciones son por códigos QR." },
    { title: "Billetes de Tren Bala", content: "Se ponen a la venta con 15 días exactos de antelación. Cómpralos en Trip.com con tu pasaporte. No hay billetes físicos; entras a la estación mostrando tu pasaporte físico original en los tornos." },
    { title: "Agua y Baños", content: "No bebas agua del grifo, compra siempre embotellada. Los baños públicos son de placa turca (cuclillas). Lleva siempre pañuelos/papel en el bolsillo, ya que nunca hay papel disponible en ellos." },
    { title: "Internet y Gran Cortafuegos", content: "Necesitarás VPN o una eSIM de datos con roaming internacional (como Holafly o Airalo) para usar WhatsApp, Instagram o Google Maps. LetsVPN es barata y funciona de maravilla." }
  ]
};

export const initialExpenses = [
  { id: "exp-1", title: "Vuelos transcontinentales Barcelona - Shanghái (ida/vuelta)", amountCny: 6300, amountEur: 800, category: "Vuelos", date: "2026-07-17" },
  { id: "exp-2", title: "Hoteles Shanghái - The Bund (2 noches)", amountCny: 1575, amountEur: 200, category: "Hoteles", date: "2026-07-18" },
  { id: "exp-3", title: "Tren bala Shanghái - Chongqing", amountCny: 630, amountEur: 80, category: "Trenes", date: "2026-07-20" },
  { id: "exp-4", title: "Hoteles Chongqing - Jiefangbei (3 noches)", amountCny: 2362, amountEur: 300, category: "Hoteles", date: "2026-07-20" },
  { id: "exp-5", title: "Tren bala Chongqing - Chengdu", amountCny: 118, amountEur: 15, category: "Trenes", date: "2026-07-23" },
  { id: "exp-6", title: "Hoteles Chengdu - Zen Tea House (3 noches)", amountCny: 2200, amountEur: 280, category: "Hoteles", date: "2026-07-23" },
  { id: "exp-7", title: "Tren bala Chengdu - Xi'an", amountCny: 220, amountEur: 28, category: "Trenes", date: "2026-07-26" },
  { id: "exp-8", title: "Hoteles Xi'an - Bell Tower (2 noches)", amountCny: 1180, amountEur: 150, category: "Hoteles", date: "2026-07-26" },
  { id: "exp-9", title: "Tren bala Xi'an - Pekín", amountCny: 430, amountEur: 55, category: "Trenes", date: "2026-07-28" },
  { id: "exp-10", title: "Hoteles Pekín - Novotel Peace (3 noches)", amountCny: 2750, amountEur: 350, category: "Hoteles", date: "2026-07-28" }
];
