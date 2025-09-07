### **Create Sell Config (`api/SellConfig/create`)**

- **Method:** `POST`
- **Input:**

```json
{
	"SellConfigId": "SeCo003",
	"Commision"	  : "0.1"
}
```

- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully create sell config",
    "data": {
        "sellConfigId": "SeCo003",
        "commision": 0.1,
        "users": []
    }
}
```

---

### **Read Sell Config (`api/SellConfig/read`)**

- **Method:** `GET`
- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully read sell config",
    "data": [
        {
            "sellConfigId": "S1",
            "commision": 0.1
        },
        {
            "sellConfigId": "SC001",
            "commision": 5
        },
        {
            "sellConfigId": "SC002",
            "commision": 7.5
        }
    ]
}
```

---

### **Update Sell Config (`api/SellConfig/update/"id"`)**

- **Method:**`PUT`
- **Input:**

```json
{
	"Commision"	  : "0.5""

}
```

- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success update sell config",
    "data": {
        "sellConfigId": "SeCo002",
        "commision": 0.5,
        "users": []
    }
}
```

---

### **Delete Sell Config (`api/SellConfig/delete/"id"`)**

- **Method:**`DELETE`
- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully delete sell config",
    "data": {
        "sellConfigId": "SeCo002",
        "commision": 0.5,
        "users": []
    }
}
```
