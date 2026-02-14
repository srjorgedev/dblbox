# Ranking System API Documentation

This document outlines all the API endpoints available for the community ranking system.

---

## 1. Get Ranking Groups
Retrieves a list of available ranking categories with localized titles and descriptions.

- **Endpoint**: `GET /api/v1/ranking/groups`
- **Query Parameters**:
  - `lang` (optional, string): Language code (e.g., `en`, `es`). Defaults to `en`.

---

## 2. Submit or Update a Vote
Allows a user to submit or update their daily vote for a unit within a specific ranking group.

- **Endpoint**: `POST /api/v1/ranking/vote`
- **Request Body (JSON)**:
  ```json
  {
    "userId": "string",
    "rankingGroupId": "string",
    "unitId": "string",
    "rankPosition": "number",
    "date": "YYYY-MM-DD"
  }
  ```

---

## 3. Get Full Ranking List
Retrieves the computed ranking for a group on a given date, with fallback to the latest available snapshot if the requested date's snapshot is missing.

- **Endpoint**: `GET /api/v1/ranking/:groupId`
- **URL Parameters**:
  - `groupId` (string): The ID of the ranking group.
- **Query Parameters**:
  - `date` (optional, `YYYY-MM-DD`): Date for the ranking. Defaults to today's UTC date.

---

## 4. Get Current Rank of a Specific Unit
Provides the current rank and statistics for a specific unit within a group and date, utilizing snapshot fallback.

- **Endpoint**: `GET /api/v1/ranking/:groupId/unit/:unitId`
- **URL Parameters**:
  - `groupId` (string): The ID of the ranking group.
  - `unitId` (string): The ID of the unit.
- **Query Parameters**:
  - `date` (optional, `YYYY-MM-DD`): Date for the unit's rank. Defaults to today's UTC date.

---

## 5. Get Last Vote of a User for a Specific Unit
Retrieves a specific user's most recent vote for a particular unit within a ranking group.

- **Endpoint**: `GET /api/v1/ranking/:groupId/user/:userId/unit/:unitId/last-vote`
- **URL Parameters**:
  - `groupId` (string): The ID of the ranking group.
  - `userId` (string): The ID of the user.
  - `unitId` (string): The ID of the unit.

---

## 6. Get Last Vote of a User (General)
Retrieves the most recent vote made by a user across all ranking groups.

- **Endpoint**: `GET /api/v1/ranking/user/:userId/last-vote`
- **URL Parameters**:
  - `userId` (string): The ID of the user.
- **Query Parameters**:
  - `groupId` (optional, string): Filters the search to a specific ranking group.

---

## 7. Generate Daily Snapshot (Admin/Cron Use)
Triggers the computation and storage of a ranking snapshot for a specified group and date. **This is a required step to see rankings.**

- **Endpoint**: `POST /api/v1/ranking/snapshot/generate`
- **Request Body (JSON)**:
  ```json
  {
    "rankingGroupId": "string",
    "date": "YYYY-MM-DD",
    "windowDays": "number"
  }
  ```
  - `windowDays` defaults to 14 if not provided.
