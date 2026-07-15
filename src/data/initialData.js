export const initialItinerary = [
  {
    id: "day-1",
    date: "2026-07-17",
    dayOfWeek: "Viernes",
    city: "En tránsito",
    title: "Vuelo Barcelona (BCN) - Shanghái (PVG)",
    transport: {
      type: "flight",
      details: "Vuelo internacional Air China CA840. BCN 12:10 -> PVG 06:45 (+1).",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Noche a bordo del avión",
      address: "Vuelo CA840",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-1-1", time: "09:10", title: "Llegada al Aeropuerto de Barcelona-El Prat", description: "Llegar con 3 horas de antelación al terminal T1 para facturar equipaje y pasar control de seguridad.", category: "transit" },
      { id: "act-1-2", time: "12:10", title: "Despegue del vuelo CA840", description: "Vuelo directo operado por Air China hacia Shanghái Pudong (PVG) en un Airbus A350-900. ¡Buen vuelo!", category: "transit" }
    ],
    notes: "Lleva encima tu pasaporte original y comprueba que has descargado e instalado tu eSIM/VPN antes de despegar."
  },
  {
    id: "day-2",
    date: "2026-07-18",
    dayOfWeek: "Sábado",
    city: "Shanghái",
    title: "Llegada a Shanghái",
    transport: {
      type: "taxi",
      details: "Taxi o Maglev (tren de levitación magnética) desde el Aeropuerto PVG al hotel.",
      bookingStatus: "pending"
    },
    lodging: {
      name: "Youli Hotel (Shanghai People's Square)",
      nameChinese: "友里酒店(上海人民广场店)",
      address: "No. 41-47 Yunnan Middle Road, Huangpu, Shanghai, China",
      addressChinese: "上海市黄浦区云南中路41-47号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-2-1", time: "06:45", title: "Aterrizaje en Shanghái Pudong (PVG)", description: "Llegada al Terminal 2. Inmigración (toma de huellas), recogida de maletas. Activar eSIM y VPN.", category: "transit" },
      { id: "act-2-2", time: "10:30", title: "Llegada al Youli Hotel", description: "Registro con pasaporte físico original. El hotel está fantásticamente ubicado cerca de la Plaza del Pueblo.", category: "hotel" },
      { id: "act-2-3", time: "18:00", title: "Paseo por The Bund al atardecer", description: "Primer contacto visual con el espectacular skyline iluminado de Pudong y los edificios de Puxi.", category: "sightseeing" },
      { id: "act-2-4", time: "20:00", title: "Cena en Nanjing Road", description: "Probar dumplings y comida local en la concurrida calle peatonal.", category: "dining" }
    ],
    notes: "Usa el botón 🚕 Taxista en la tarjeta de hotel si coges taxi en el aeropuerto para mostrar la dirección en chino gigante."
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
      name: "Youli Hotel (Shanghai People's Square)",
      nameChinese: "友里酒店(上海人民广场店)",
      address: "No. 41-47 Yunnan Middle Road, Huangpu, Shanghai, China",
      addressChinese: "上海市黄浦区云南中路41-47号",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-3-1", time: "09:00", title: "Jardín Yuyuan y Ciudad Vieja", description: "Recorrer el jardín tradicional del siglo XVI y los bazares tradicionales de madera.", category: "sightseeing" },
      { id: "act-3-2", time: "13:00", title: "Almuerzo de Xiao Long Bao", description: "Probar los famosos dumplings rellenos de caldo en Nanxiang Steamed Bun Restaurant.", category: "dining" },
      { id: "act-3-3", time: "15:30", title: "Cruzar a Pudong y subir a la Torre de Shanghái", description: "Subir al segundo rascacielos más alto del mundo (632m) para disfrutar de vistas panorámicas.", category: "sightseeing" },
      { id: "act-3-4", time: "19:00", title: "Cena y paseo en la Concesión Francesa", description: "Pasear bajo los árboles plátanos en Xintiandi o Tianzifang, llenos de boutiques y cafés.", category: "sightseeing" }
    ],
    notes: "Compra las entradas para la Torre de Shanghái con antelación en WeChat o Trip.com."
  },
  {
    id: "day-4",
    date: "2026-07-20",
    dayOfWeek: "Lunes",
    city: "Shanghái - Chongqing",
    title: "Vuelo a Chongqing: La Ciudad de Montaña",
    transport: {
      type: "flight",
      details: "Vuelo Sichuan Airlines 3U8974. PVG T2 19:40 -> CKG 22:30.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "TheMoss High-altitude Viewing Hotel",
      nameChinese: "TheMoss木肆之野酒店(解放碑洪崖洞店)",
      address: "35th Floor, Xinhua International Building, No. 27 Minquan Road, Yuzhong District, Chongqing, China (+86-23-68896663)",
      addressChinese: "重庆市渝中区民权路27号新华国际大厦35楼 (电话: +86-23-68896663)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-4-1", time: "12:00", title: "Check-out y tiempo libre", description: "Hacer el check-out en el Youli Hotel, dejar el equipaje en recepción y almorzar por la zona de People's Square antes de salir.", category: "hotel" },
      { id: "act-4-2", time: "16:30", title: "Traslado a Shanghái-Pudong (PVG) T2", description: "Recoger equipaje e ir al aeropuerto de Pudong (T2). Se puede ir en taxi o en la línea 2 de metro / tren Maglev.", category: "transit" },
      { id: "act-4-3", time: "19:40", title: "Despegue del vuelo 3U8974", description: "Vuelo de Sichuan Airlines con destino al Aeropuerto de Chongqing Jiangbei (CKG). Llegada prevista a las 22:30.", category: "transit" },
      { id: "act-4-4", time: "23:45", title: "Check-in tardío en TheMoss Hotel", description: "Traslado en taxi desde el aeropuerto de Chongqing hasta el hotel (planta 35, vistas espectaculares). El hotel está avisado de la llegada tardía.", category: "hotel" }
    ],
    notes: "Usa el botón 🚕 Taxista para el trayecto desde el aeropuerto de Chongqing. El número del hotel es +86-23-68896663."
  },
  {
    id: "day-5",
    date: "2026-07-21",
    dayOfWeek: "Martes",
    city: "Chongqing",
    title: "Explorando la ciudad tridimensional",
    transport: {
      type: "metro",
      details: "Metro de Chongqing.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "TheMoss High-altitude Viewing Hotel",
      nameChinese: "TheMoss木肆之野酒店(解放碑洪崖洞店)",
      address: "35th Floor, Xinhua International Building, No. 27 Minquan Road, Yuzhong District, Chongqing, China (+86-23-68896663)",
      addressChinese: "重庆市渝中区民权路27号新华国际大厦35楼 (电话: +86-23-68896663)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-5-1", time: "09:30", title: "Estación de metro Liziba (Línea 2)", description: "Ver el monorraíl atravesando por dentro el edificio residencial de 19 plantas. Salir a la plaza del mirador.", category: "sightseeing" },
      { id: "act-5-2", time: "11:30", title: "Pueblo Antiguo de Ciqikou", description: "Caminar por las empedradas calles comerciales tradicionales de Chongqing.", category: "sightseeing" },
      { id: "act-5-3", time: "16:00", title: "Teleférico del Río Yangtze", description: "Cruzar el río Yangtze en el teleférico colgante clásico.", category: "sightseeing" },
      { id: "act-5-4", time: "19:00", title: "Cena en Hongyadong y paseo por Jiefangbei", description: "Visitar el Monumento de la Liberación (Jiefangbei) al lado de vuestro hotel y pasear hasta el acantilado iluminado de Hongyadong para cenar un auténtico Hot Pot de Chongqing.", category: "sightseeing" }
    ],
    notes: "Lleva calzado con buena suela. Chongqing tiene pendientes y escaleras interminables."
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
      name: "TheMoss High-altitude Viewing Hotel",
      nameChinese: "TheMoss木肆之野酒店(解放碑洪崖洞店)",
      address: "35th Floor, Xinhua International Building, No. 27 Minquan Road, Yuzhong District, Chongqing, China (+86-23-68896663)",
      addressChinese: "重庆市渝中区民权路27号新华国际大厦35楼 (电话: +86-23-68896663)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-6-1", time: "10:00", title: "Sichuan Fine Arts Institute (Huangjueping)", description: "Calle del grafiti y campus artístico al aire libre con fachadas pintadas al completo.", category: "sightseeing" },
      { id: "act-6-2", time: "13:00", title: "Almuerzo de Fideos Picantes de Chongqing", description: "Probar fideos locales Chongqing Xiaomian en un local tradicional.", category: "dining" },
      { id: "act-6-3", time: "15:30", title: "Raffles City Chongqing", description: "Rascacielos horizontal flotante con vistas increíbles en la confluencia de los ríos.", category: "sightseeing" },
      { id: "act-6-4", time: "20:00", title: "Paseo nocturno en barco por el río", description: "Opcional: crucero de 1 hora para admirar los rascacielos iluminados desde el agua.", category: "sightseeing" }
    ],
    notes: "Puedes reservar el crucero en el mismo hotel o usando Trip.com."
  },
  {
    id: "day-7",
    date: "2026-07-23",
    dayOfWeek: "Jueves",
    city: "Chongqing - Chengdu",
    title: "Viaje a Chengdu: Tierra de Pandas y Té",
    transport: {
      type: "train",
      details: "Tren rápido G8628. Chongqingbei 16:38 -> Chengdudong 18:14. Asientos: Vagón 03, 008D y 008F. Localizador: E037613102.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "GINLAN SONG Qingtang Hotel (Chengdu Chunxi Road & Taikoo Li)",
      nameChinese: "景澜青棠酒店(成都春熙路太古里店)",
      address: "No. 70 Shuwa North 2nd Street, Jinjiang District, Chengdu, Sichuan, China (+86-28-83503666)",
      addressChinese: "四川省成都市锦江区暑袜北二街70号 (电话: +86-28-83503666)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-7-1", time: "12:00", title: "Check-out y almuerzo en Chongqing", description: "Hacer el check-out en TheMoss Hotel, dejar el equipaje en recepción y almorzar por la zona de Jiefangbei.", category: "hotel" },
      { id: "act-7-2", time: "15:30", title: "Traslado a la estación Chongqingbei", description: "Ir a la estación de Chongqing Norte (Chongqingbei) en metro o taxi para pasar el control de acceso: 24B25B.", category: "transit" },
      { id: "act-7-3", time: "16:38", title: "Tren bala G8628 a Chengdu", description: "Salida del tren rápido hacia Chengdu Este (Chengdudong). Duración: 1h 36min.", category: "transit" },
      { id: "act-7-4", time: "19:00", title: "Llegada al Ginlan Song Hotel en Chengdu", description: "Check-in en el hotel. Ubicado a pocos pasos de Chunxi Road y Taikoo Li.", category: "hotel" },
      { id: "act-7-5", time: "20:00", title: "Paseo nocturno por Taikoo Li y cena", description: "Primer contacto con la moderna zona peatonal de Chengdu y cena en la zona.", category: "dining" }
    ],
    notes: "El email del hotel es ginlansong.4531wovtyab30rt@htlpartner.trip.com y el teléfono es +86-28-83503666."
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
      name: "GINLAN SONG Qingtang Hotel (Chengdu Chunxi Road & Taikoo Li)",
      nameChinese: "景澜青棠酒店(成都春熙路太古里店)",
      address: "No. 70 Shuwa North 2nd Street, Jinjiang District, Chengdu, Sichuan, China (+86-28-83503666)",
      addressChinese: "四川省成都市锦江区暑袜北二街70号 (电话: +86-28-83503666)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-8-1", time: "07:00", title: "Base de Cría de Pandas Gigantes", description: "Llegar a primera hora para ver a los pandas desayunando bambú fresco en libertad.", category: "sightseeing" },
      { id: "act-8-2", time: "12:30", title: "Almuerzo en Chen Mapo Tofu", description: "Comer el famoso plato Mapo Tofu en el legendario restaurante local original.", category: "dining" },
      { id: "act-8-3", time: "15:00", title: "Relajarse en People's Park (Teahouse)", description: "Sentarse en una casa de té clásica, pedir té verde y ver a los jubilados jugar Mahjong.", category: "sightseeing" },
      { id: "act-8-4", time: "17:30", title: "Caminar por Kuanzhai Xiangzi", description: "Callejones anchos y estrechos tradicionales restaurados con fachadas históricas, al lado de la ópera.", category: "sightseeing" },
      { id: "act-8-5", time: "19:30", title: "Ópera de Sichuan en Shufeng Yayun", description: "Espectáculo tradicional que incluye el famoso cambio de máscaras mágico ('Face Changing') en el parque cultural Shufeng Yayun.", category: "sightseeing" }
    ],
    notes: "¡Imprescindible! Reservar las entradas de la Base de Pandas en WeChat con 7 días de antelación exacta."
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
      name: "GINLAN SONG Qingtang Hotel (Chengdu Chunxi Road & Taikoo Li)",
      nameChinese: "景澜青棠酒店(成都春熙路太古里店)",
      address: "No. 70 Shuwa North 2nd Street, Jinjiang District, Chengdu, Sichuan, China (+86-28-83503666)",
      addressChinese: "四川省成都市锦江区暑袜北二街70号 (电话: +86-28-83503666)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-9-1", time: "08:30", title: "Tren bala a Leshan", description: "Excursión de un día al Buda de piedra más grande del mundo esculpido en acantilado.", category: "sightseeing" },
      { id: "act-9-2", time: "10:30", title: "Paseo en barco para ver el Buda", description: "Ver el Buda frontalmente desde el barco para evitar las masivas colas de escaleras.", category: "sightseeing" },
      { id: "act-9-3", time: "14:00", title: "Almuerzo en Leshan y regreso", description: "Probar especialidades de Leshan y volver en tren bala a Chengdu.", category: "transit" },
      { id: "act-9-4", time: "19:00", title: "Cena de Chuan Chuan Xiang", description: "Cenar brochetas hervidas en caldo picante Sichuan, divertido e informal.", category: "dining" }
    ],
    notes: "El barco de Leshan tarda unos 30 minutos y tiene una fila de espera muy rápida."
  },
  {
    id: "day-10",
    date: "2026-07-26",
    dayOfWeek: "Domingo",
    city: "Chengdu - Xi'an",
    title: "Rumbo a la antigua capital imperial",
    transport: {
      type: "train",
      details: "Tren rápido G3140. Chengdudong 16:02 -> Xi'anbei 19:33. Asientos: Vagón 06, 011D y 011F. Localizador: E080622787.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Jinjiang · Xi'an Bell Tower Original Copy Hotel",
      nameChinese: "锦江·西安钟楼原拓酒店",
      address: "1st Floor, Unit 1, Tower A, Jinzhong Building, No. 290 West 1st Road, Xincheng, Xi'an, Shaanxi, China (+86-29-87352266)",
      addressChinese: "陕西省西安市新城区西一路290号金钟大厦A座1单元1楼 (电话: +86-29-87352266)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-10-1", time: "10:00", title: "Caminar por Jinli Ancient Street", description: "Pasear por la pintoresca calle peatonal tradicional de Chengdu, llena de farolillos y tiendas de artesanía y souvenirs.", category: "sightseeing" },
      { id: "act-10-2", time: "13:00", title: "Almuerzo y check-out en Chengdu", description: "Hacer el check-out en el Ginlan Song Hotel y comer algo ligero.", category: "hotel" },
      { id: "act-10-3", time: "14:45", title: "Traslado a la estación de Chengdudong", description: "Ir a la estación de Chengdu Este para tomar el tren bala. Control de acceso: A13.", category: "transit" },
      { id: "act-10-4", time: "16:02", title: "Tren rápido G3140 a Xi'an", description: "Salida del tren rápido hacia la antigua capital Xi'an, cruzando túneles y montañas de Shaanxi.", category: "transit" },
      { id: "act-10-5", time: "19:33", title: "Llegada a Xi'an y check-in", description: "Llegada a la estación Xi'anbei. Traslado en metro al Jinjiang Original Copy Hotel en el centro de la ciudad y registro.", category: "hotel" },
      { id: "act-10-6", time: "21:00", title: "Cena nocturna en el Barrio Musulmán", description: "Disfrutar de los olores y deliciosa comida callejera en el vibrante Barrio Musulmán para una cena tardía.", category: "dining" }
    ],
    notes: "El teléfono del hotel es +86-29-87352266. Muy buena zona comercial."
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
      name: "Jinjiang · Xi'an Bell Tower Original Copy Hotel",
      nameChinese: "锦江·西安钟楼原拓酒店",
      address: "1st Floor, Unit 1, Tower A, Jinzhong Building, No. 290 West 1st Road, Xincheng, Xi'an, Shaanxi, China (+86-29-87352266)",
      addressChinese: "陕西省西安市新城区西一路290号金钟大厦A座1单元1楼 (电话: +86-29-87352266)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-11-1", time: "08:30", title: "Museo de los Guerreros de Terracota", description: "Contemplar las excavaciones del primer emperador con miles de figuras a tamaño real.", category: "sightseeing" },
      { id: "act-11-2", time: "13:30", title: "Almuerzo de Biang Biang Noodles", description: "Fideos anchos hechos a mano con abundante ajo y aceite picante.", category: "dining" },
      { id: "act-11-3", time: "16:00", title: "Gran Pagoda de la Oca Salvaje", description: "Histórica pagoda budista de la dinastía Tang y jardines adyacentes.", category: "sightseeing" },
      { id: "act-11-4", time: "18:00", title: "Bici por la Muralla Antigua de Xi'an", description: "Subir a la muralla medieval de Xi'an, alquilar unas bicicletas y recorrer parte de su perímetro de 14km disfrutando del atardecer.", category: "sightseeing" },
      { id: "act-11-5", time: "20:30", title: "Fuentes de la Plaza Norte", description: "Disfrutar del espectáculo de agua, luces y música clásica en la plaza norte de la Gran Pagoda de la Oca Salvaje.", category: "sightseeing" }
    ],
    notes: "Es obligatorio llevar el pasaporte original físico para poder acceder a los Guerreros de Terracota."
  },
  {
    id: "day-12",
    date: "2026-07-28",
    dayOfWeek: "Martes",
    city: "Xi'an - Pekín",
    title: "Viaje a Pekín: El centro del imperio",
    transport: {
      type: "train",
      details: "Tren rápido G368. Xi'anbei 14:26 -> Beijingxi 18:37. Asientos: Vagón 06, 018D y 018F. Localizador: E052762051.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Bolly Wood Hotel (Beijing Wangfujing Street Palace Museum)",
      nameChinese: "北京天安门故宫宝欐酒店",
      address: "No. 189 Dongsi South Street, Dongcheng, Beijing, China (+86-10-65228888)",
      addressChinese: "北京市东城区东四南大街189号 (电话: +86-10-65228888)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-12-1", time: "09:30", title: "Visita a la Gran Mezquita de Xi'an", description: "Visitar este singular e histórico templo islámico del siglo VIII con patios de arquitectura tradicional china.", category: "sightseeing" },
      { id: "act-12-2", time: "11:30", title: "Check-out y almuerzo ligero", description: "Hacer el check-out en el hotel y almorzar por el centro de Xi'an.", category: "hotel" },
      { id: "act-12-3", time: "13:00", title: "Traslado a la estación de Xi'anbei", description: "Ir a la estación de Xi'an Norte para el control de acceso y pasaportes. Control de acceso: 1B.", category: "transit" },
      { id: "act-12-4", time: "14:26", title: "Tren rápido G368 a Pekín", description: "Salida del tren bala que conecta Xi'an con Pekín (Beijingxi) en 4 horas y 11 minutos.", category: "transit" },
      { id: "act-12-5", time: "19:30", title: "Llegada al Bolly Wood Hotel y check-in", description: "Traslado en metro o taxi desde la estación Pekín Oeste (Beijingxi) al hotel e instalación.", category: "hotel" },
      { id: "act-12-6", time: "20:30", title: "Paseo y cena en Wangfujing", description: "Cenar y pasear por la peatonal Wangfujing Road al lado del hotel.", category: "dining" }
    ],
    notes: "El teléfono del hotel en Pekín es +86-10-65228888."
  },
  {
    id: "day-13",
    date: "2026-07-29",
    dayOfWeek: "Miércoles",
    city: "Pekín",
    title: "La Ciudad Prohibida y el Templo del Cielo",
    transport: {
      type: "metro",
      details: "Metro de Pekín.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Bolly Wood Hotel (Beijing Wangfujing Street Palace Museum)",
      nameChinese: "北京天安门故宫宝欐酒店",
      address: "No. 189 Dongsi South Street, Dongcheng, Beijing, China (+86-10-65228888)",
      addressChinese: "北京市东城区东四南大街189号 (电话: +86-10-65228888)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-13-1", time: "08:00", title: "Plaza de Tiananmén y Ciudad Prohibida", description: "Acceso al monumental Palacio Imperial de los emperadores chinos. Visitar pabellones interiores.", category: "sightseeing" },
      { id: "act-13-2", time: "12:30", title: "Parque Jingshan (Colina del Carbón)", description: "Subida al mirador de la colina para contemplar los tejados dorados completos del palacio.", category: "sightseeing" },
      { id: "act-13-3", time: "15:00", title: "Visita al Templo del Cielo", description: "Visitar el majestuoso pabellón circular donde el emperador rezaba por las cosechas.", category: "sightseeing" },
      { id: "act-13-4", time: "20:00", title: "Cena de Pato Pekín", description: "Cenar el crujiente pato laqueado tradicional en un restaurante especializado de Pekín.", category: "dining" }
    ],
    notes: "¡ATENCIÓN! La Ciudad Prohibida abre reservas con 7 días de antelación exacta a las 20:00 hora local china. Se agotan inmediatamente."
  },
  {
    id: "day-14",
    date: "2026-07-30",
    dayOfWeek: "Jueves",
    city: "Pekín",
    title: "La Gran Muralla en Mutianyu",
    transport: {
      type: "taxi",
      details: "Coche privado contratado / Didi hacia Mutianyu.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Bolly Wood Hotel (Beijing Wangfujing Street Palace Museum)",
      nameChinese: "北京天安门故宫宝欐酒店",
      address: "No. 189 Dongsi South Street, Dongcheng, Beijing, China (+86-10-65228888)",
      addressChinese: "北京市东城区东四南大街189号 (电话: +86-10-65228888)",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-14-1", time: "07:30", title: "Traslado a la Gran Muralla de Mutianyu", description: "Trayecto de hora y media al norte de Pekín.", category: "transit" },
      { id: "act-14-2", time: "09:30", title: "Paseo por las torres de la muralla", description: "Subida en teleférico y recorrer las secciones de piedra rodeadas de vegetación en verano.", category: "sightseeing" },
      { id: "act-14-3", time: "12:30", title: "Descenso en Tobogán", description: "Bajar de la muralla deslizándote por el divertido tobogán metálico gigante.", category: "sightseeing" },
      { id: "act-14-4", time: "16:00", title: "Visita exterior al Estadio Olímpico (Nido de Pájaro)", description: "Parada exterior para fotos de la famosa estructura del estadio iluminándose al atardecer.", category: "sightseeing" },
      { id: "act-14-5", time: "17:30", title: "Paseo por los Hutongs de Houhai", description: "Caminar por los pintorescos callejones antiguos alrededor de los lagos de Houhai, hoy llenos de ambiente nocturno y cafeterías.", category: "sightseeing" },
      { id: "act-14-6", time: "19:30", title: "Cena de despedida junto al lago Houhai", description: "Disfrutar de una agradable cena de comida tradicional con vistas al lago para celebrar la última noche del viaje.", category: "dining" }
    ],
    notes: "Lleva ropa fresca, calzado deportivo de buen agarre y agua de sobra para subir la muralla."
  },
  {
    id: "day-15",
    date: "2026-07-31",
    dayOfWeek: "Viernes",
    city: "Pekín - Barcelona",
    title: "Regreso a Barcelona",
    transport: {
      type: "flight",
      details: "Vuelo internacional de vuelta Air China CA571. PEK 11:50 -> BCN 18:20.",
      bookingStatus: "booked"
    },
    lodging: {
      name: "Tu casa",
      address: "Barcelona",
      bookingStatus: "booked"
    },
    activities: [
      { id: "act-15-1", time: "08:50", title: "Llegada al Aeropuerto de Pekín (PEK)", description: "Llegar con 3 horas de antelación al Terminal 3 para facturación internacional.", category: "transit" },
      { id: "act-15-2", time: "11:50", title: "Despegue del vuelo CA571", description: "Vuelo directo operado por Air China hacia Barcelona (BCN) en un Airbus A350. Almuerzo y cena a bordo.", category: "transit" },
      { id: "act-15-3", time: "18:20", title: "Aterrizaje en Barcelona-El Prat (BCN)", description: "Llegada a Barcelona por la tarde hora local. ¡Fin de la increíble aventura por China!", category: "transit" }
    ],
    notes: "El vuelo CA571 sale a las 11:50 AM del viernes 31. Procura salir del hotel en Pekín sobre las 07:30 - 08:00 AM para ir con tiempo de sobra."
  }
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
  { id: "exp-1", title: "Vuelos transcontinentales Air China (CA840 / CA571)", amountCny: 6300, amountEur: 800, category: "Vuelos", date: "2026-07-17" },
  { id: "exp-2", title: "Youli Hotel Shanghái (2 noches)", amountCny: 1575, amountEur: 200, category: "Hoteles", date: "2026-07-18" },
  { id: "exp-3", title: "Vuelo doméstico 3U8974 Shanghái - Chongqing", amountCny: 860, amountEur: 110, category: "Vuelos", date: "2026-07-20" },
  { id: "exp-4", title: "TheMoss Hotel Chongqing (3 noches)", amountCny: 2362, amountEur: 300, category: "Hoteles", date: "2026-07-20" },
  { id: "exp-5", title: "Tren bala G8628 Chongqing - Chengdu", amountCny: 118, amountEur: 15, category: "Trenes", date: "2026-07-23" },
  { id: "exp-6", title: "Ginlan Song Hotel Chengdu (3 noches)", amountCny: 2200, amountEur: 280, category: "Hoteles", date: "2026-07-23" },
  { id: "exp-7", title: "Tren bala G3140 Chengdu - Xi'an", amountCny: 220, amountEur: 28, category: "Trenes", date: "2026-07-26" },
  { id: "exp-8", title: "Jinjiang Bell Tower Hotel Xi'an (2 noches)", amountCny: 1180, amountEur: 150, category: "Hoteles", date: "2026-07-26" },
  { id: "exp-9", title: "Tren bala G368 Xi'an - Pekín", amountCny: 430, amountEur: 55, category: "Trenes", date: "2026-07-28" },
  { id: "exp-10", title: "Bolly Wood Hotel Pekín (3 noches)", amountCny: 2750, amountEur: 350, category: "Hoteles", date: "2026-07-28" }
];
export const initialPacking = [];
