# Backend Developer — Skill Test

Backend API untuk mengelola User, Order, dan Truck menggunakan Node.js, Express.js, dan MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Turf.js

---

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/rafiizah/Test-Skill-PT.-Star-Karlo-Indonesia.git
cd be-skill-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Buat file `.env` di root project:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/be-skill-test
JWT_SECRET=super_secret_jwt_key_skill_test_2026
NODE_ENV=development
```

### 4. Seed Dummy Data

Jalankan:

```bash
npm run seed
```

Seeder akan membuat dummy data untuk User, Truck, dan Order.

Default user:

```text
Username: tester
Password: password123
```

### 5. Run Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

API berjalan pada:

```text
http://localhost:3000
```

---

# API Endpoints

## Authentication

| Method | Path | Description |
|---|---|---|
| POST | `/api/register` | Mendaftarkan user baru |
| POST | `/api/login` | Login dan mendapatkan JWT |
| PATCH | `/api/users/password` | Mengubah password |
| POST | `/api/logout` | Logout dan membatalkan session aktif |

---

## Orders

| Method | Path | Description |
|---|---|---|
| POST | `/api/orders` | Membuat order baru |
| GET | `/api/orders` | Mengambil order milik user yang login |
| GET | `/api/orders/:id` | Mengambil detail order |
| PUT | `/api/orders/:id` | Memperbarui order |
| PATCH | `/api/orders/:id/status` | Mengubah status order dan assign truck |
| DELETE | `/api/orders/:id` | Menghapus order |

Order menggunakan status:

```text
created → start → done
```

---

## Trucks

| Method | Path | Description |
|---|---|---|
| POST | `/api/trucks` | Membuat truck baru |
| GET | `/api/trucks` | Mengambil truck milik user yang login |
| GET | `/api/trucks/:id` | Mengambil detail truck |
| PUT | `/api/trucks/:id` | Memperbarui truck |
| PATCH | `/api/trucks/:id/location` | Memperbarui lokasi truck dan mengevaluasi geofencing |
| DELETE | `/api/trucks/:id` | Menghapus truck |

---

## Location

| Method | Path | Description |
|---|---|---|
| GET | `/api/locations/distance` | Menghitung jarak truck ke destination order menggunakan Turf.js |

Query parameter:

```text
truckId
orderId
```

Contoh:

```http
GET /api/locations/distance?truckId=<TRUCK_ID>&orderId=<ORDER_ID>
```

---

# Authentication

Endpoint yang membutuhkan authentication menggunakan JWT.

Header:

```http
Authorization: Bearer <TOKEN_JWT>
```

JWT diperoleh melalui:

```http
POST /api/login
```

---

# Assumptions

Berikut beberapa asumsi yang digunakan dalam implementasi:

1. Password user disimpan dalam bentuk hash menggunakan bcrypt.
2. Authentication menggunakan JWT.
3. Active login session disimpan di database.
4. User hanya dapat mengakses Order dan Truck miliknya sendiri.
5. Order memiliki reference terhadap Truck yang ditugaskan.
6. Location Truck menggunakan format GeoJSON `Point`.
7. Geospatial index menggunakan `2dsphere`.
8. Perhitungan jarak menggunakan Turf.js.
9. Geofencing dievaluasi ketika lokasi Truck diperbarui.
10. Radius geofencing yang digunakan adalah **100 meter**.
11. Order menggunakan status transition:
    
    ```text
    created → start → done
    ```

---

# Incomplete / Future Improvements

Jika masih terdapat waktu pengembangan, beberapa hal yang dapat ditingkatkan:

- Menambahkan automated testing.
- Menambahkan API documentation seperti Swagger/OpenAPI.
- Meningkatkan validation dan response error.
- Menambahkan logging yang lebih lengkap.
- Menambahkan pagination pada endpoint list.
- Real-Time Tracking: Integrasi WebSocket (Socket.io) untuk live tracking lokasi truk.
