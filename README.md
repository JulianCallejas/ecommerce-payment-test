![Logo de E-Commerce](https://res.cloudinary.com/dphleqb5t/image/upload/v1749355793/ecommerce/ecomm-logo_1_ymy5nm.svg)

Esta aplicación muestra el flujo completo de compra de un artículo, desde la visualización del producto hasta el pago y envío. Implementa una arquitectura full stack moderna con un backend en NestJS y un frontend en React.

---

## 🚀 Características principales

- Página de descripción del producto.
- Botón **\"Pay with credit card\"** que despliega un modal de compra.
- Verificación de tipo de tarjeta (Visa, MasterCard u otras) mediante ícono al ingresar el número.
- Formulario de cliente, tarjeta de crédito y datos de envío con validaciones.
- Confirmación de términos y condiciones antes del pago.
- Resumen del pedido con botón **\"Pay Now\"**.
- Creación de orden, transacción mediante **Wompi**, registro de envío y actualización de stock.
- Mensaje de confirmación o rechazo según resultado de la transacción.

---

## 🗄️ Estructura de la Base de Datos

La base de datos está gestionada con **PostgreSQL** y el ORM **Prisma**, e incluye las siguientes entidades principales:

### 🧾 Tablas y Relaciones

#### `Product`
- `id`: UUID (PK)
- `slug`: String único
- `product`: Nombre del producto
- `description`: Descripción
- `stock`: Stock disponible
- `unitPrice`: Precio unitario (Decimal)
- `images`: Arreglo de URLs
- `version`: Control de versiones (optimistic locking)
- `createdAt`, `updatedAt`: Fechas de creación y actualización
- 🔗 Relación: `Product` tiene muchas `Order`

#### `Customer`
- `id`: UUID (PK)
- `customerId`: ID único generado (ej. tipo + número)
- `fullname`: Nombre completo
- `email`: Correo electrónico
- `createdAt`, `updatedAt`
- 🔗 Relación: `Customer` tiene muchas `Order`

#### `Order`
- `id`: UUID (PK)
- `productId`: FK a `Product`
- `customerId`: FK a `Customer`
- `addressId`: FK a `OrderAddress`
- `quantity`: Cantidad
- `unitPrice`: Precio por unidad en la orden
- `deliveryFee`: Costo de envío
- `createdAt`, `updatedAt`
- 🔗 Relación: una `Order` tiene una `Delivery` y muchas `Transaction`

#### `OrderAddress`
- `id`: UUID (PK)
- `addressLine1`, `addressLine2`: Dirección
- `country`, `region`, `city`, `postalCode`
- `contactName`, `phoneNumber`
- `createdAt`, `updatedAt`
- 🔗 Relación: una dirección puede estar en varias órdenes

#### `Delivery`
- `id`: UUID (PK)
- `orderId`: FK a `Order`
- `status`: Enum (`PROCESSING`, `SHIPPING`, `RETURNED`, `COMPLETED`, `CANCELED`)
- `createdAt`, `updatedAt`

#### `Transaction`
- `id`: UUID (PK)
- `reference`: Referencia única (UUID)
- `externalId`: ID de Wompi
- `orderId`: FK a `Order`
- `status`: Estado de la transacción (ej. `APPROVED`, `DECLINED`)
- `amount`: Monto total
- `details`: Objeto JSON con detalles del proveedor de pago
- `createdAt`, `updatedAt`

### 📘 Notas
- Todas las relaciones están definidas explícitamente con claves foráneas.
- Prisma usa convenciones para nombres de columnas en snake_case y pluralización de tablas.
- El manejo de estados de entrega y transacciones permite trazabilidad y consistencia.

---


## 🧱 Tecnologías utilizadas

### Backend

- ⚙️ NestJS
- 🛢️ PostgreSQL
- 🧬 Prisma ORM
- 🔌 API REST documentada con Swagger
- 🧪 Tests con Jest

> 🔗 API URL: [https://ecomm-api-5463.onrender.com/api](https://ecomm-api-5463.onrender.com/api)

---

## 🧪 Resultados de Pruebas del Backend

Las pruebas del backend se realizaron con **Jest**, abarcando controladores, casos de uso, servicios y repositorios clave. Esto garantiza la confiabilidad del flujo de creación de pedidos, transacciones, entregas y consultas a través de la API REST.

### ✅ Resumen General

- **Suites de pruebas ejecutadas:** 29
- **Total de tests:** 117
- **Tests exitosos:** ✅ 117
- **Snapshots:** 0
- **Duración total:** ⏱ 27.85 segundos


---


### 📊 Cobertura de Código Completa

| Archivo                                                                 | % Stmts | % Branch | % Funcs | % Lines | Líneas sin cubrir         |
|-------------------------------------------------------------------------|---------|----------|---------|---------|----------------------------|
| **Todos los archivos**                                                  | 96.91   | 82.85    | 100     | 96.66   |                            |
| `application/checkout/checkout.controller.ts`                          | 100     | 100      | 100     | 100     |                            |
| `application/common/seeding-products.ts`                               | 100     | 100      | 100     | 100     |                            |
| `application/customers/customers.controller.ts`                        | 100     | 100      | 100     | 100     |                            |
| `application/deliveries/deliveries.controller.ts`                      | 100     | 66.66    | 100     | 100     | 71–72                      |
| `application/orders/orders.controller.ts`                              | 100     | 100      | 100     | 100     |                            |
| `application/seed/seed.controller.ts`                                  | 100     | 100      | 100     | 100     |                            |
| `application/stock/stock.controller.ts`                                | 100     | 100      | 100     | 100     |                            |
| `application/transactions/transactions.controller.ts`                  | 100     | 77.77    | 100     | 100     | 52–53                      |
| `core/common/check-or-throw-bad-request.ts`                            | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/checkout/checkout-data.use-case.ts`                    | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/customers/get-all-customers.use-case.ts`               | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/customers/get-customer-with-orders.use-case.ts`        | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/deliveries/get-all-deliveries.use-case.ts`             | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/deliveries/get-customer-deliveries.use-case.ts`        | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/orders/create-order.use-case.ts`                       | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/orders/get-order-id.use-case.ts`                       | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/seed/seed-products.use-case.ts`                        | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/stock/get-all-products.use-case.ts`                    | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/stock/get-product-stock.use-case.ts`                   | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/transactions/create-transaction.use-case.ts`           | 91.07   | 72.72    | 100     | 90.56   | 148–157, 232–236           |
| `core/use-cases/transactions/get-all-transactions.use-case.ts`        | 100     | 100      | 100     | 100     |                            |
| `core/use-cases/transactions/get-transaction-status.use-case.ts`       | 93.47   | 77.77    | 100     | 93.02   | 90–93, 142                 |
| `infrastructure/database/prisma.service.ts`                            | 100     | 100      | 100     | 100     |                            |
| `infrastructure/database/repositories/prisma-customer.repository.ts`   | 92.3    | 50       | 100     | 95.45   | 38                         |
| `infrastructure/database/repositories/prisma-delivery.repository.ts`   | 82.6    | 100      | 100     | 78.94   | 27, 57–76, 86              |
| `infrastructure/database/repositories/prisma-order-address.repository.ts` | 86.66 | 100      | 100     | 83.33   | 21, 31                     |
| `infrastructure/database/repositories/prisma-order.repository.ts`      | 100     | 100      | 100     | 100     |                            |
| `infrastructure/database/repositories/prisma-product.repository.ts`    | 93.33   | 100      | 100     | 92.59   | 29, 85                     |
| `infrastructure/database/repositories/prisma-transaction.repository.ts`| 100     | 100      | 100     | 100     |                            |
| `infrastructure/mocks/*.mock.ts`                                       | 100     | 100      | 100     | 100     |                            |
| `infrastructure/wompi-gateway/wompi-gateway.service.ts`                | 100     | 100      | 100     | 100     |                            |
| `tests/mocks/*.ts`                                                     | 100     | 100      | 100     | 100     |                            |

---

### 🧩 Casos de Prueba Cubiertos

- Controladores REST (`orders`, `transactions`, `checkout`, `stock`, `deliveries`, `customers`)
- Casos de uso de dominio (`create-order`, `create-transaction`, `get-customer-with-orders`, etc.)
- Integración con **Wompi** como pasarela de pagos
- Validaciones y excepciones
- Repositorios personalizados con **Prisma**
- Mocking completo para pruebas unitarias

> 🔍 La aplicación cuenta con **alta cobertura y pruebas robustas**, garantizando calidad y estabilidad en producción.


---


### Frontend

- ⚛️ React
- 🧰 Redux con persistencia encriptada (localStorage)
- 🎨 Material UI + Tailwind CSS
- 📝 React Hook Form + Zod para validaciones
- 🧪 Tests con Jest

> 🌐 Aplicación Web: [https://ecomm-sbtj.onrender.com](https://ecomm-sbtj.onrender.com)

⏳ *Nota:* La API está desplegada en un servidor gratuito. Si no ha recibido solicitudes en los últimos 15 minutos, puede tardar hasta 1 minuto en reiniciarse.


---

## 🧪 Resultados de Pruebas del Frontend

Las pruebas fueron realizadas utilizando **Jest** en los componentes clave para garantizar el correcto funcionamiento del flujo de compra. A continuación se muestran los resultados obtenidos:

### ✅ Resumen General

- **Suites de pruebas ejecutadas:** 3
- **Total de tests:** 21
- **Tests exitosos:** ✅ 21
- **Snapshots:** 0
- **Duración total:** ⏱ 17.316 segundos

---

### 📊 Cobertura de Código

| Carpeta / Archivo                      | Stmts (%) | Branch (%) | Funcs (%) | Lines (%) |
|----------------------------------------|-----------|------------|-----------|-----------|
| **Global**                             | **63.65** | **46.92**  | **45.03** | **64.2**  |
| `src/components/CardWhyBuy.tsx`        | 100       | 100        | 100       | 100       |
| `src/features/product/ProductPage.tsx` | 75.67     | 54.54      | 42.85     | 77.14     |
| `src/hooks/useTransaction.tsx`         | 94.87     | 86.66      | 100       | 97.05     |
| `src/config/env.ts`                    | 100       | 100        | 100       | 100       |
| `src/hooks/useCheckout.ts`            | 100       | 93.33      | 100       | 100       |
| `src/utils/currencyFormatter.ts`       | 83.33     | 50         | 100       | 100       |

---

### 🧩 Componentes Cubiertos

- Página del producto (`ProductPage`)
- Hooks de checkout y transacciones


<p>Estos componentes se encargan de gestionar la lógica de captura de información y procesamiento de pago. Se agregarían más tests a otros componentes y funciones según las necesidades del proyecto y el tiempo disponible.
</p>

---

## 📦 Instalación del Backend

### Requisitos

- Node.js v18+
- Docker y Docker Compose
- PostgreSQL (se ejecutará en contenedor)

### Pasos

1. Clona el repositorio:

```bash
git clone https://github.com/JulianCallejas/ecommerce-payment-test.git
cd ecommerce-api
```

2. Inicia la base de datos en Docker:

```bash
docker compose up -d
```

3. Instala las dependencias del backend:

```bash
npm install
```

4. Ejecuta las migraciones con Prisma:

```bash
npx prisma migrate dev --name \"Initial Schema\"
```

5. Ejecuta el seed para poblar la base de datos:

```bash
npm run seed
```

6. Inicia el servidor de desarrollo:

```bash
npm run start:dev
```

7. Abre la documentación de la API en:

```text
https://ecomm-api-5463.onrender.com/api
```

---

## 💻 Instalación del Frontend

1. Clona el repositorio:

```bash
cd ecomm-front
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia la aplicación:

```bash
npm run dev
```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## ✅ Pruebas

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## 📌 Notas adicionales

- La aplicación utiliza Wompi como pasarela de pagos.
- El resumen del pedido se genera antes de pagar.
- Se actualiza el stock disponible al finalizar la transacción.
- La persistencia del estado se realiza con Redux Persist y almacenamiento cifrado en localStorage.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

#### 🌟 You’re the superstar of our show! Thanks for lighting up our repository with your presence. We hope you enjoy exploring our code as much as we enjoyed writing it.

<p align="center">
<a href="https://github.com/JulianCallejas">
  <img src="https://res.cloudinary.com/dphleqb5t/image/upload/v1740784502/github-jc-develop/JC-LOGO-Horizontal-170-50-thin-github_uu3b5n.svg" width="170" alt="{ jc - develop }"  /> 
</a>
</p>