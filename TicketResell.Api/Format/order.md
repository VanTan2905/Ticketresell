### **Create Order (`api/order/create`)**

- **Method:** `POST`
- **Input:**

  ```json
  {
    "OrderId": "ORD1",
    "BuyerId": "BUY1"
  }
  ```

- **Output:**
  ```json
  {
    "message": "Successfully created order: ORDER001"
  }
  ```

---

### **Get Order by ID (`api/order/{orderId}`)**

- **Method:** `GET`
- **Input:** orderId in URL
- **Output:**
  ```json
  {
    "OrderId": "ORD1",
    "BuyerId": "BUY1",
    "Total": 100.50,
    "Date": "2024-09-20T10:00:00Z",
    "Status": 1
  }
  ```

---

### **Get All Orders (`api/order`)**

- **Method:** `GET`
- **Input:** None
- **Output:**
  ```json
  [
    {
      "OrderId": "ORD1",
      "BuyerId": "BUY1",
      "Total": 100.50,
      "Date": "2024-09-20T10:00:00Z",
      "Status": 1
    },
    {
      "OrderId": "ORD2",
      "BuyerId": "BUY2",
      "Total": 75.25,
      "Date": "2024-09-21T11:30:00Z",
      "Status": 2
    }
  ]
  ```

---

### **Get Orders by Buyer ID (`api/order/buyer/{buyerId}`)**

- **Method:** `GET`
- **Input:** buyerId in URL
- **Output:**
  ```json
  [
    {
      "OrderId": "ORD1",
      "BuyerId": "BUY1",
      "Total": 100.50,
      "Date": "2024-09-20T10:00:00Z",
      "Status": 1
    },
    {
      "OrderId": "ORDER003",
      "BuyerId": "BUYER123",
      "Total": 50.75,
      "Date": "2024-09-22T09:15:00Z",
      "Status": 1
    }
  ]
  ```

---

### **Get Orders by Date Range (`api/order/daterange`)**

- **Method:** `POST`
- **Input:**
  ```json
  {
    "StartDate": "2024-09-20T00:00:00",
    "EndDate": "2024-09-21T23:59:59"
  }
  ```
- **Output:**
  ```json
  [
    {
      "OrderId": "ORDER001",
      "BuyerId": "BUYER123",
      "Total": 100.50,
      "Date": "2024-09-20T10:00:00Z",
      "Status": 1
    },
    {
      "OrderId": "ORDER002",
      "BuyerId": "BUYER456",
      "Total": 75.25,
      "Date": "2024-09-21T11:30:00Z",
      "Status": 2
    }
  ]
  ```

---

### **Get Orders by Total Price Range (`api/order/pricerange`)**

- **Method:** `POST`
- **Input:**
  ```json
  {
    "Min": 50.00,
    "Max": 200.00
  }
  ```
- **Output:**
  ```json
  [
    {
      "OrderId": "ORD1",
      "BuyerId": "BUY1",
      "Total": 100.50,
      "Date": "2024-09-20T10:00:00Z",
      "Status": 1
    },
    {
      "OrderId": "ORD2",
      "BuyerId": "BUY2",
      "Total": 75.25,
      "Date": "2024-09-21T11:30:00Z",
      "Status": 2
    }
  ]
  ```

---

### **Update Order (`api/order`)**

- **Method:** `PUT`
- **Input:**

  ```json
  {
    "OrderId": "ORD1",
    "BuyerId": "BUY1",
    "Total": 150.75,
    "Date": "2024-09-20T11:00:00Z",
    "Status": 2
  }
  ```

- **Output:**
  ```json
  {
    "message": "Successfully updated order: ORD1"
  }
  ```

---

### **Delete Order (`api/order/{orderId}`)**

- **Method:** `DELETE`
- **Input:** orderId in URL
- **Output:**
  ```json
  {
    "message": "Successfully deleted order: ORD1"
  }
  ```

---

### **Calculate Total Price for Order (`api/order/totalprice/{orderId}`)**

- **Method:** `GET`
- **Input:** orderId in URL
- **Output:**
  ```json
  {
    "totalPrice": 150.75
  }
  ```

---
