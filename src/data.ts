export type Product = {
  id: string
  name: string
  category: string
  description: string
  price: number
  image: string
  badge?: string
}

export type EditorialItem = {
  eyebrow: string
  title: string
  description: string
  image: string
  readTime: string
}

const photo = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const products: Product[] = [
  {
    id: 'nube',
    name: 'Cama Nube',
    category: 'Descanso',
    description: 'Un lugar suave para desaparecer durante horas.',
    price: 128000,
    image: photo('photo-1511044568932-338cba0ad803'),
    badge: 'Favorito felino',
  },
  {
    id: 'fuente',
    name: 'Fuente Serena',
    category: 'Comida y agua',
    description: 'Agua fresca en movimiento, menos ruido y más ronroneos.',
    price: 184000,
    image: photo('photo-1573865526739-10659fec78a5'),
    badge: 'Hidratacion feliz',
  },
  {
    id: 'cana',
    name: 'Cana Cazadora',
    category: 'Juego',
    description: 'Plumas naturales para activar su instinto explorador.',
    price: 39000,
    image: photo('photo-1533738363-b7f9aef128ce'),
  },
  {
    id: 'cepillo',
    name: 'Cepillo Mimo',
    category: 'Cuidado',
    description: 'Una rutina de cepillado que termina en caricias.',
    price: 52000,
    image: photo('photo-1514888286974-6c03e2ca1dba'),
    badge: 'Nuevo',
  },
]

export const categories = ['Todo', 'Descanso', 'Comida y agua', 'Juego', 'Cuidado']

export const wikiItems: EditorialItem[] = [
  {
    eyebrow: 'Guia esencial · 6 min',
    title: 'Un hogar nuevo, a su propio ritmo',
    description: 'El mapa amable para preparar su espacio y darle confianza desde el primer dia.',
    image: photo('photo-1495360010541-f48722b34f7d'),
    readTime: '6 min',
  },
  {
    eyebrow: 'Bienestar · 4 min',
    title: 'Agua: pequenas pistas, grandes habitos',
    description: 'Ideas sencillas para que hidratarse sea parte natural de su rutina.',
    image: photo('photo-1574158622682-e40e69881006'),
    readTime: '4 min',
  },
]

export const newsItems: EditorialItem[] = [
  {
    eyebrow: 'Diario Gatitools · 18 oct 2026',
    title: 'La casa tambien se diseña para ellos',
    description: 'Texturas, rincones tranquilos y objetos que conviven bien con todos.',
    image: photo('photo-1513360371669-4adf3dd7dff8'),
    readTime: 'Tendencias',
  },
  {
    eyebrow: 'Comunidad · 09 oct 2026',
    title: 'Cinco minutos de juego que cambian el dia',
    description: 'Una pequeña pausa compartida puede ser el mejor plan de la tarde.',
    image: photo('photo-1514888286974-6c03e2ca1dba'),
    readTime: 'Historias',
  },
]
