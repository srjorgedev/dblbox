# dblboxv5 Project Context

## Project Overview
`dblboxv5` is a Node.js/TypeScript backend application, likely serving as an API for a "Dragon Ball Legends Box" type application. It provides endpoints to retrieve game unit data and assets. The application uses a local SQLite database for structured data and serves static image assets.

## Technology Stack
*   **Runtime:** Node.js
*   **Language:** TypeScript (Target: ES2022, Module: NodeNext)
*   **Framework:** Express.js
*   **Database:** SQLite (via `@libsql/client`)
*   **Development Tools:** `tsx` (execution), `typescript` (compilation)

## Architecture
The project follows a classic layered architecture (Dependency Injection):
1.  **Controllers (`src/http/controllers`):** Handle HTTP requests and responses.
2.  **Services (`src/domain/service`):** Contain business logic.
3.  **Repositories (`src/domain/repository`):** Handle data access and database interaction.
4.  **Database (`src/db`):** Manages the SQLite connection and raw SQL queries.

### Key Directories
*   `src/app.ts`: Application entry point. Sets up the server, database connection, and dependency injection.
*   `src/http/routes/`: Defines API endpoints (e.g., `unit.routes.ts`, `assets.routes.ts`).
*   `src/db/queries/`: Contains raw SQL queries (e.g., `unit.query.ts`).
*   `data/db/dblbox.db`: The local SQLite database file.
*   `data/assets/`: Directory containing static image assets (WebP format).

## Building and Running

### Prerequisites
*   Node.js installed.
*   `npm install` to install dependencies.

### Scripts
*   **Development (Hot Reload):**
    ```bash
    npm run dev
    ```
    Runs the app using `tsx watch src/app.ts`.

*   **Development (Single Run):**
    ```bash
    npm run dev_single
    ```
    Runs the app once using `tsx src/app.ts`.

*   **Build:**
    ```bash
    npm run build
    ```
    Compiles TypeScript to JavaScript in the `dist/` directory.

*   **Production Run:**
    ```bash
    npm run app
    ```
    Runs the compiled application from `dist/app.js`.

## Data Model & Conventions
*   **Database:** The application uses raw SQL queries with `@libsql/client`.
*   **Localization:** The database schema appears to support multiple languages, using `LEFT JOIN`s to fetch localized text (e.g., `unit_name`, `rarity_texts`) based on language keys.
*   **Complex Queries:** `GROUP_CONCAT` is heavily used to aggregate related attributes (names, tags, colors) into single string fields which are then likely parsed by the application.
*   **Port:** Default port is `1110` (or defined in `process.env.PORT`).
