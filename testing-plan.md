# Swagger Testing Plan (Phase 2)

Use Swagger at `/api-docs`. For protected routes, click **Authorize** and set `Bearer <JWT>`.

## 0) Auth Setup

### POST /api/auth/login
- Access control: Public
- Success:
  - Login as `admin@example.com` / `Password123!`
  - Expect `200` with `token`
- Error:
  - Wrong password
  - Expect `401`

Repeat login for:
- `user@example.com` / `Password123!` (owner user)
- `not-owner@example.com` / `Password123!` (non-owner user)

## 1) Products

### GET /api/products
- Access control: Public
- Success: Expect `200` with product list

### GET /api/products/{id}
- Access control: Public
- Success: use existing product id, expect `200`
- 404: non-existent UUID, expect `404`
- 400: invalid UUID format, expect `400`

### POST /api/products
- Access control: Admin only
- Setup: Authorize with admin token
- Success: valid body, expect `201`
- 401: clear token, expect `401`
- 403: login as regular user, expect `403`
- 400: omit required field (`name`), expect `400`
- 409: reuse existing product name, expect `409`

### PUT /api/products/{id}
- Access control: Admin only
- Success: admin token + valid body, expect `200`
- 404: unknown id, expect `404`
- 400: invalid body or UUID, expect `400`
- 401: no token, expect `401`
- 403: regular user token, expect `403`

### DELETE /api/products/{id}
- Access control: Admin only
- Success: admin token + existing id, expect `200`
- 404: unknown id, expect `404`
- 401: no token, expect `401`
- 403: regular user token, expect `403`

## 2) Orders

### POST /api/orders
- Access control: Authenticated user
- Setup: user token
- Success: valid `items`, expect `201`
- 400: empty items or quantity <= 0, expect `400`
- 401: no token, expect `401`
- 404: unknown `productId`, expect `404`

### GET /api/orders
- Access control: Authenticated user
- Success: user token, expect `200`
- 401: no token, expect `401`

### GET /api/orders/{id}
- Access control: Owner or admin
- Success: owner token for own order, expect `200`
- 403: non-owner token, expect `403`
- 404: unknown id, expect `404`
- 400: invalid UUID, expect `400`
- 401: no token, expect `401`

### PUT /api/orders/{id}
- Access control: Owner or admin
- Success: owner token + status update, expect `200`
- 403: non-owner token, expect `403`
- 404: unknown id, expect `404`
- 400: invalid body/UUID, expect `400`
- 401: no token, expect `401`

### DELETE /api/orders/{id}
- Access control: Owner or admin
- Success: owner token + existing order, expect `200`
- 403: non-owner token, expect `403`
- 404: unknown id, expect `404`
- 400: invalid UUID, expect `400`
- 401: no token, expect `401`

## 3) Reviews

### GET /api/reviews
- Access control: Public
- Success: expect `200`

### GET /api/reviews/{id}
- Access control: Public
- Success: existing id, expect `200`
- 404: unknown id, expect `404`
- 400: invalid UUID, expect `400`

### POST /api/reviews
- Access control: Authenticated user
- Success: user token + valid body, expect `201`
- 401: no token, expect `401`
- 404: unknown product id, expect `404`
- 409: duplicate review for same user/product, expect `409`
- 400: invalid rating/body, expect `400`

### PUT /api/reviews/{id}
- Access control: Owner or admin
- Success: owner token, expect `200`
- 403: non-owner token, expect `403`
- 404: unknown id, expect `404`
- 400: invalid body/UUID, expect `400`
- 401: no token, expect `401`

### DELETE /api/reviews/{id}
- Access control: Owner or admin
- Success: owner token, expect `200`
- 403: non-owner token, expect `403`
- 404: unknown id, expect `404`
- 400: invalid UUID, expect `400`
- 401: no token, expect `401`
