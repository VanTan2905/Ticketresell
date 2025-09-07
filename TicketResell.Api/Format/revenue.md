### **Create Revenue (`api/Revenue/create`)**

- **Method:** `POST`
- **Input:**

  ```json
  {
    "RevenueId": "R01",
    "SellerId": "USER01",
    "Revenue1": "100000"
  }
  ```

- **Output:**
  ```json
  {
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully created Revenue",
    "data": null
  }
  ```

### **Get All Revenue (`api/Revenue/read`)**

- **Method:** `GET`
- **Output:**
  ```json
  [
  {
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully get revenues",
    "data": [
        
        {
            "revenueId": "R01",
            "sellerId": "USER01",
            "startDate": "2024-09-26T13:55:28.8415778",
            "endDate": "2024-10-26T13:55:28.8415778",
            "revenue1": 100000,
            "type": "Monthly"
        },
        {
            "revenueId": "R02",
            "sellerId": "USER01",
            "startDate": "2024-09-26T13:56:21.9403544",
            "endDate": "2024-10-26T13:56:21.9403544",
            "revenue1": 100000,
            "type": "Monthly"
        }
      ]
  }
  ]
  ```

### **Get Revenue By Id,SellerId**

**`api/Revenue/readbyid/{id}`**

**`api/Revenue/readbysellerid/{Sellerid}`**

- **Method:** `GET`
- **Output:**
  ```json
  [
    {
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully get revenues with id",
    "data": {
        "revenueId": "R01",
        "sellerId": "USER01",
        "startDate": "2024-09-26T13:55:28.8415778",
        "endDate": "2024-10-26T13:55:28.8415778",
        "revenue1": 100000,
        "type": "Monthly"
    }
  }
  ]
  ```

### **Update Revenue By SellerId**

(`api/Revenue/update/{id}`)

- **Method:** `PUT`
- **Input:**
  ```json
  {
    "revenue1": 3400000
  }
  ```
- **Output:**
  ```json
  {
    "message": "Successfully update revenue with id: USER01"
  }
  ```

### **Delete Revenue by Id,SellerId**

**`api/Revenue/delete/{id}`**

**`api/Revenue/deletebysellerid/{Sellerid}`**

- **Method:** `DELETE`
- **Output:**

  ```json
  {
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully deleted Revenue(s) with id: R02",
    "data": null
  }
  ```

---
