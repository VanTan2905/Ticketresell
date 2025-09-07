### **Create User (`api/user/create`)**

- **Method:** `POST`
- **Input:**

  ```json
  {
    "UserId": "USER003",
    "Username": "johndsdsoe",
    "Password": "securepassword",
    "Status": 1,
    "Gmail": "johndoe@gmail.com"
  }
  ```

- **Output:**
  ```json
  {
    "message": "Username already exists"
  }
  ```

---

### **Register Seller (`api/user/updateseller/{id}`)**

- **Method:** `PUT`
- **Input:**

  ```json
  {
    "Gmail": "khang@gmail.com",
    "Fullname": "huynh vuong khang",
    "Sex": "Male",
    "Phone": "09898322",
    "Address": "123 hung dao",
    "Birthday": "1990-01-01T00:00:00"
  }
  ```

- **Output:**
  ```json
  {
    "message": "Successfull sign up seller"
  }
  ```

---
