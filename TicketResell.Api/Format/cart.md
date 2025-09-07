http://localhost:5296/api/Cart/{id} (GET)
Input:

Output:
{
"id": 1,
"statusCode": 200,
"status": "Success",
"message": "Successfully retrieved cart for user: USER001",
"data": {
"buyerId": "USER001",
"orderDetails": [
{
"orderDetailId": "OD001",
"orderId": "ORD001",
"ticketId": "TICKET001",
"price": 100,
"quantity": 2
},
{
"orderDetailId": "OD002",
"orderId": "ORD001",
"ticketId": "TICKET002",
"price": 150,
"quantity": 1
}
]
}
}

http://localhost:5296/api/Cart/add (POST)
Input
{
"UserId": "USER001",
"TicketId": "TICKET002",
"Quantity": 7

}

Output:
{
"id": 1,
"statusCode": 200,
"status": "Success",
"message": "Successfully added item to cart for user: USER001",
"data": {
"orderDetailId": "OD002",
"orderId": "ORD001",
"ticketId": "TICKET002",
"price": 150,
"quantity": 8,
"order": null,
"ticket": null
}
}
