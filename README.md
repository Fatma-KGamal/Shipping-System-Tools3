# Shipping System Tools 3

## Getting Started

### Running the Go Backend
To start the Go backend, navigate to your project directory and run:
```bash
go run main.go
```

### Running the Angular Frontend
1. Navigate to the Angular project directory:
   ```bash
   cd my-app
   ```
2. Serve the Angular application:
   ```bash
   ng serve
   ```

## API Endpoints

### User Registration
- **Endpoint:** [Register Page] http://localhost:4200/register 
- **Feature:** User registration functionality

### User Login
- **Endpoint:** [Login Page] http://localhost:4200/login
- **Feature:** User login functionality

### Order Management

- **Create Order**
  - **Endpoint:** [Create Order] http://localhost:4300/create-order
  - **Feature:** Create new orders

- **My Orders**
  - **Endpoint:** [My Orders] http://localhost:4300/get-user-orders?user_id=1
  - **Feature:** Retrieve all orders for the logged-in user

- **Order Details**
  - **Endpoint:** [Order Details] http://localhost:4300/get-order-details?order_id=1 
  - **Feature:** View details of a specific order

- **Delete Order**
  - **Endpoint:** [Delete Order] http://localhost:4300/delete-order?order_id=<ID> 
  - **Feature:** Delete pending orders

## Smoke Testing
To run smoke tests on your application, follow these steps:

1. Install Axios:
   ```bash
   npm install axios
   ```

2. Execute the smoke test script:
   ```bash
   node smokeTest.js
   ```

---

