import { Decimal } from "@prisma/client/runtime/library";

export interface SeedProductInput {
  slug: string;
  product: string;
  description?: string;
  stock: number;
  images: string[];
  unitPrice: Decimal;
}


export const seedingProducts: SeedProductInput[] = [
  {
    slug: 'horno-microondas-electrolux-07-emdo20-gris',
    product: 'Horno Microondas ELECTROLUX 0.7 EMDO20 Gris',
    description:
      'Con el Horno Microondas de 20 Litros Gris Electrolux calienta y descongela tus recetas favoritas. La circulación del aire que te entrega la Función Elimina Olor, te permite dejar tu microondas listo para preparar o calentar la siguiente receta. Integrado con opciones funcionales como el Menú para Niños, que viene con tres funciones preprogramadas que favorecen la preparación de sus recetas favoritas como palomitas y quesadillas. Los platos preparados regularmente, como arroz, papas y pastas ahora están preprogramados gracias al Menú Diario. ¡No lo pienses más, adquiere el tuyo ahora!',
    stock: 5,
    images: [
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061000/ecommerce/hornoelectro1_o42nse.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061000/ecommerce/hornoelectro2_u0aynq.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061000/ecommerce/hornoelectro3_ji4oxr.webp'
    ],
    unitPrice: Decimal(310000.00)
  },
  {
    slug: 'horno-tostador-oster-con-freidora-de-aire-2173940',
    product: 'Horno Tostador OSTER con Freidora de Aire 2173940',
    description:
      'El Horno Digital con Freidora de Aire Oster® está diseñado con puertas francesas que abren al mismo tiempo y liberan espacio en la superficie para mayor comodidad. Cuenta un panel digital con 10 funciones pre-determinadas para que cocine las comidas preferidas sin comprometer sabor o nutrición. Además, nuestro horno le ahorrará tiempo no solo al cocinar, sino también facilita la limpieza con su recubrimiento antiadherente interior. ¡Disfrute del sabor de varios alimentos de manera saludable con 99.9% menos grasa!',
    stock: 15,
    images: [
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061784/ecommerce/tostador1_rs66b7.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061784/ecommerce/tostador2_jxtygk.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748061784/ecommerce/tostador3_oshrie.webp'
    ],
    unitPrice: Decimal(1120000.00)
  },
  {
    slug: 'freidora-de-aire-oster-6lts-digital-diamondforce',
    product: 'Freidora de aire OSTER 6Lts Digital DiamondForce',
    description:
      'Descubre la excelencia culinaria con nuestra freidora de Aire con recubrimiento OSTER DiamondForce, limpieza sin esfuerzo, versatilidad con mayor capacidad 6L y 10 programas automáticos. Recubrimiento Diamondforce, que es hasta 12 veces más resistente a rayaduras y hasta 15 veces más fácil de limpiar, asegurando durabilidad y facilidad de limpieza incomparables. ¡Adquiere ya la tuya!',
    stock: 50,
    images: [
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748062154/ecommerce/freidora1_zowisx.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748062155/ecommerce/freidora3_laurwe.webp',
      'https://res.cloudinary.com/dphleqb5t/image/upload/v1748062154/ecommerce/freidora2_le5ily.webp'
    ],
    unitPrice: Decimal(500000.00)
  }
];