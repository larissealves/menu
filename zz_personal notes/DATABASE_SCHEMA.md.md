# 🗃️ Database Schema – Menu App (Prisma + PostgreSQL)

This document describes the data model used by the **Menu** system, built with **Prisma ORM** and a **PostgreSQL** database.

## 📦 Models

---

### 🥘 `Dish`

| Field        | Type     | Notes                                |
|--------------|----------|---------------------------------------|
| `id`         | Int      | Primary key, autoincrement            |
| `name`       | String   | Dish name                             |
| `price`      | Float    | Price                                 |
| `description`| String   | Description                           |
| `categoryId` | Int      | Foreign key → Category.id             |
| `isActive`   | Boolean  | default: true                         |
| `createdAt`  | DateTime | default: now()                        |

**Relations:**
- `category`: belongs to `Category`
- `images`: has many `DishImage[]`
- `ingredients`: has many `DishIngredient[]`
- `tags`: has many `DishTag[]`

---

### 📁 `Category`

| Field       | Type     | Notes                                |
|-------------|----------|---------------------------------------|
| `id`        | Int      | Primary key, autoincrement            |
| `name`      | String   | Category name                         |
| `isActive`  | Boolean  | default: true                         |
| `createdAt` | DateTime | default: now()                        |
| `updatedAt` | DateTime | auto-updated on change                |

**Relations:**
- `dishes`: has many `Dish[]`

---

### 🧂 `Ingredient`

| Field       | Type     | Notes                                |
|-------------|----------|---------------------------------------|
| `id`        | Int      | Primary key, autoincrement            |
| `name`      | String   | Ingredient name                       |
| `isActive`  | Boolean  | default: true                         |
| `createdAt` | DateTime | default: now()                        |
| `updatedAt` | DateTime | auto-updated on change                |

**Relations:**
- `dishes`: used in many `DishIngredient[]`

---

### 🔗 `DishIngredient`

| Field         | Type     | Notes                                |
|---------------|----------|---------------------------------------|
| `id`          | Int      | Primary key, autoincrement            |
| `dishId`      | Int      | Foreign key → Dish.id                 |
| `ingredientId`| Int      | Foreign key → Ingredient.id           |
| `createdAt`   | DateTime | default: now()                        |
| `updatedAt`   | DateTime | auto-updated on change                |

**Relations:**
- `dish`: belongs to `Dish`
- `ingredient`: belongs to `Ingredient`

---

### 🖼️ `DishImage`

| Field       | Type     | Notes                                |
|-------------|----------|---------------------------------------|
| `i
