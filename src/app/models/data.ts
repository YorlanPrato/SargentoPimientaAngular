export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  artist: string;
  genre: string;
  description: string;
  image: string;
}

export const MENU_DATA: Record<string, MenuItem[]> = {
  'Entradas': [
    {
      id: '1',
      name: 'Tostadas de Hongos Silvestres',
      description: 'Hongos salteados con ajo, tomillo y aceite de trufa sobre pan artesanal',
      price: 12.50,
      image: 'https://images.unsplash.com/photo-1692197275441-40c874f40385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
    {
      id: '2',
      name: 'Carpaccio de Res',
      description: 'Láminas finas de res con rúcula, parmesano y reducción balsámica',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1692197275931-0793e08efcc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
  ],
  'Platos': [
    {
      id: '3',
      name: 'Steak Rock & Roll',
      description: 'Filete de res 300g con salsa de whisky, papas gratinadas y vegetales asados',
      price: 28.50,
      image: 'https://images.unsplash.com/photo-1663530761401-15eefb544889?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
    {
      id: '4',
      name: 'Risotto de Hongos',
      description: 'Arroz arborio con mezcla de hongos, parmesano y aceite de trufa',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1692197275441-40c874f40385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: false,
    },
  ],
  'Postres': [
    {
      id: '5',
      name: 'Brownie del Guitarrista',
      description: 'Brownie de chocolate con helado de vainilla y salsa de caramelo',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1590741664176-7fbd7e2592a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
    {
      id: '6',
      name: 'Tarta de Limón',
      description: 'Tarta de limón con merengue tostado y coulis de frutos rojos',
      price: 8.50,
      image: 'https://images.unsplash.com/photo-1637944220604-c5f28faac604?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
  ],
  'Cócteles': [
    {
      id: '7',
      name: 'Old Fashioned Rock',
      description: 'Whisky bourbon, azúcar, bitter angostura y cáscara de naranja',
      price: 11.00,
      image: 'https://images.unsplash.com/photo-1469234496837-d0101f54be3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
    {
      id: '8',
      name: 'Margarita Eléctrica',
      description: 'Tequila premium, triple sec, lima fresca y sal de mar',
      price: 10.00,
      image: 'https://images.unsplash.com/photo-1550520293-d34b3f2e116d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      available: true,
    },
  ],
};

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    title: 'Noche de Rock Clásico',
    date: 'Viernes 6 de Junio',
    time: '9:00 PM',
    artist: 'Los Rebeldes',
    genre: 'Rock Clásico',
    description: 'Un tributo a las mejores bandas de los 70s y 80s',
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  {
    id: 2,
    title: 'Blues & Soul Night',
    date: 'Sábado 7 de Junio',
    time: '8:30 PM',
    artist: 'María González Trío',
    genre: 'Blues/Soul',
    description: 'Una noche íntima con los mejores blues y soul',
    image: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  {
    id: 3,
    title: 'Indie Acoustic Sessions',
    date: 'Viernes 13 de Junio',
    time: '9:00 PM',
    artist: 'The Wanderers',
    genre: 'Indie/Acústico',
    description: 'Sonidos frescos y melodías inolvidables',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
];

export const OPERATING_HOURS = [
  '17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00','22:30',
  '23:00','23:30','00:00','00:30','01:00','01:30','02:00'
];
