# Chinook App Backend Enhancement

## Overview

The **Chinook App Backend** project demonstrates my ability to enhance and extend backend functionality to integrate seamlessly with a pre-existing frontend and database. This project involved developing robust RESTful APIs, managing database schema updates, implementing data validation, and ensuring a seamless user experience through efficient backend support.

---

## Key Features

### 1. Comprehensive API Development
- Created and optimized RESTful APIs using **Express.js** to support the full lifecycle of:
  - **Artists**: Add, update, delete, and search for artists.
  - **Albums**: Add, update, and delete albums, with automatic cascading changes to related tracks.
  - **Tracks**: Add, update, and delete individual tracks.
- Integrated case-insensitive search functionality for artists, ensuring enhanced user experience.

### 2. Database Integration and Schema Updates
- Worked with an updated database schema, including:
  - A new `ReleaseYear` column in the `albums` table.
  - A `themes` table to support dynamic frontend styling options.
- Leveraged SQL queries with advanced techniques like `LIKE` for search operations.

### 3. Robust Data Validation
- Implemented validation schemas using **Joi** to ensure data integrity for all API endpoints.
- Validated incoming requests for CRUD operations to prevent malformed or invalid data from affecting the database.

### 4. Enhanced Modularity
- Refactored server architecture:
  - Moved endpoint logic to modular **Express Routers** for improved readability and maintainability.
  - Transformed `app.js` into a configuration hub for middleware and server setup.

### 5. Frontend Integration
- Adapted backend logic to align with a pre-existing frontend:
  - Ensured all API endpoints were compatible with the final frontend implementation.
  - Supported dynamic theme selection by integrating with the `themes` table.

### 6. Thorough Testing
- Used **Postman** and browser developer tools to rigorously test API endpoints.
- Verified seamless functionality of backend services with frontend features.

---

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for creating RESTful APIs.
- **Sqlite**: Relational database management.
- **Joi**: Data validation library.
- **Postman**: API testing tool.
- **Git**: Version control.

---

## Challenges Overcome

- **Database Schema Changes**: Incorporated new fields and tables while ensuring backward compatibility with existing data.
- **Search Optimization**: Developed an efficient and user-friendly case-insensitive search mechanism for artists.
- **Modular Refactoring**: Transformed monolithic server code into a scalable and maintainable architecture.

---

## Key Takeaways

This project reflects my ability to:
- Enhance backend systems to integrate with existing frontend applications.
- Manage database updates and implement seamless API support for new features.
- Write clean, modular, and maintainable code.
- Collaborate effectively by adhering to provided frontend and database constraints.

---

## How to Run the Project

- **Clone the Repository**: 

         git clone <https://github.com/TamannaAnand/ChinookApp.git>

- **Install Dependencies**: 

         npm install
