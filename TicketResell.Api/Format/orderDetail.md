### **Create OrderDetail (`api/OrderDetail/create`)**

- **Method:** `POST`
- **Input:**
  ```json
  {
    "orderDetailId": "string",
    "OrderId": "string",
    "TicketId": "string",
    "Price": 100,
    "Quantity": "1"

  }
  ```
- **Output:**
  ```json
  {
    "message": "Successfully created orderDetail: {orderDetailId}"
  }
  ```

---

### **Get OrderDetail by ID (`api/OrderDetail/{id}`)**

- **Method:** `GET`
- **Input:** id in URL
- **Output:**
  ```json
  {
    "orderDetailId": "string",
    "OrderId": "string",
    "TicketId": "string",
    "Price": 100,
    "Quantity": "1"
  }
  ```

---

### **Get All OrderDetails (`api/OrderDetail`)**

- **Method:** `GET`
- **Input:** None
- **Output:**
  ```json
  [
    {
      "orderDetailId": "string",
      "OrderId": "string",
      "TicketId": "string",
      "Price": 100,
      "Quantity": "1"
    },...
  ]
  ```

---

### **Get OrderDetails by Buyer ID (`api/OrderDetail/buyer/{buyerId}`)**

- **Method:** `GET`
- **Input:** buyerId in URL
- **Output:**
  ```json
  [
    {
      "orderDetailId": "string",
      "OrderId": "string",
      "TicketId": "string",
      "Price": 100,
      "Quantity": "1"
    },...
  ]
  ```

---

### **Get OrderDetails by Seller ID (`api/OrderDetail/seller/{sellerId}`)**

- **Method:** `GET`
- **Input:** sellerId in URL
- **Output:**
  ```json
  [
    {
      "orderDetailId": "string",
      "OrderId": "string",
      "TicketId": "string",
      "Price": 100,
      "Quantity": "1"
    },...
  ]
  ```

---

### **Update OrderDetail (`api/OrderDetail`)**

- **Method:** `PUT`
- **Input:**
  ```json
  {
      "orderDetailId": "string",
      "OrderId": "string",
      "TicketId": "string",
      "Price": 100,
      "Quantity": "1"
  }
  ```
- **Output:**
  ```json
  {
    "message": "Successfully updated orderDetail: {orderDetailId}"
  }
  ```

---

### **Delete OrderDetail (`api/OrderDetail/{id}`)**

- **Method:** `DELETE`
- **Input:** id in URL
- **Output:**
  ```json
  {
    "message": "Successfully deleted orderDetail: {orderDetailId}"
  }
  ```

---
