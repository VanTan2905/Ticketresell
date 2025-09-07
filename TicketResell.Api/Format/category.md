### **Create Category (`api/Category/create`)**

- **Method:** `POST`
- **Input:**

    ```json
    {
      "CategoryId" : "CAT04",
      "Name" : "Movie",
      "Description" : "The movie you can see"
    }
    ```
- **Output:**
    ```json
    {
        "message": "Successfully created Category"
    }
    ```

### **Get All Categories (`api/Category/read`)**

- **Method:** `GET`
- **Output:**
    ```json
    [
      {
        "statusCode": 200,
        "status": "Success",
        "message": "Successfully get categories",
        "data": 
          {
            "categoryId": "CAT01",
            "name": "Music",
            "description": "All music events and concerts"
          }
       } 
    ]
    ```

### **Get Category By Id**

**`api/Category/read/{id}`**

- **Method:** `GET`
- **Output:**
    ```json
    [
     {
      "statusCode": 200,
      "status": "Success",
      "message": "Successfully get categories",
      "data": {
                "categoryId": "CAT01",
                "name": "Music",
                "description": "All music events and concerts"
              }
      }
    ]
    ```

### **Update Category By Id**

(`api/Category/update/{id}`)

- **Method:** `PUT`
- **Input:**
    ```json
    {
      "Name" : "Football",
      "Description" : "The movie you can see"
    }
    ```
- **Output:**
    ```json
    {
      "statusCode": 200,
      "status": "Success",
      "message": "Successfully updated Category: CAT04",
      "data": null
  }
    ```

### **Delete Category by Id**

**`api/Category/delete/{id}`**

- **Method:** `DELETE`
- **Output:**

    ```json
    {
      "statusCode": 200,
      "status": "Success",
      "message": "Successfully deleted Category with id: CAT04",
      "data": null
    }
    ```

---
