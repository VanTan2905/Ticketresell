### **Create role (`api/Role/create`)**

- **Method:** `POST`
- **Input:**

```json
{
	"RoleId": "R002",
	"Rolename": "admin",
	"Description": "Control System"
}
```

- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully create sell config",
    "data": {
        "roleId": "R002",
        "rolename": "admin",
        "description": "Control System",
        "users": []
    }
}
```

---

### **Read Role (`api/Role/read`)**

- **Method:** `GET`
- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully read sell config",
    "data": [
        {
            "roleId": "R001",
            "rolename": "admin",
            "description": null
        },
        {
            "roleId": "R002",
            "rolename": "admin",
            "description": "Control System"
        },
        {
            "roleId": "R003",
            "rolename": "buyer",
            "description": null
        },
        {
            "roleId": "R004",
            "rolename": "seller",
            "description": null
        },
        {
            "roleId": "ROLE001",
            "rolename": "Admin",
            "description": "System Administrator with full permissions"
        },
        {
            "roleId": "ROLE002",
            "rolename": "Seller",
            "description": "Ticket seller with restricted permissions"
        },
        {
            "roleId": "ROLE003",
            "rolename": "Buyer",
            "description": "User who can buy tickets"
        }
    ]
}
```

---

### **Update Role (`api/Role/update/"id"`)**

- **Method:**`PUT`
- **Input:**

```json
{
	"Rolename"	  : "staff",
	"Description" : "User Manager"

}
```

- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Success update sell config",
    "data": {
        "roleId": "R002",
        "rolename": "staff",
        "description": "User Manager",
        "users": []
    }
}
```

---

### **Delete Role (`api/Role/delete/"id"`)**

- **Method:**`DELETE`
- **Output:**

```json
{
    "statusCode": 200,
    "status": "Success",
    "message": "Successfully delete sell config",
    "data": {
        "roleId": "R002",
        "rolename": "staff",
        "description": "User Manager",
        "users": []
    }
}
```
