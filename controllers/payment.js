import midtrans from "midtrans-client"
// import {products} from "../models/models.js"

export const placeOrder = async(request, response) => {
    const {id, name, email, phone} = request.body;
    if (!name || !email || !phone) return response.status(403).json("please complete the data!")
    if (!email.includes('@gmail.com')) return response.status(403).json("please input a valid email!")

    const product = await products.findOne({where: {id : id}})
    if (!product) return response.status(404).json('product not found!')

    let random = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let orderId = ""
    for(let i = 0; i < 10; i++) {
        orderId += random.charAt(Math.floor(Math.random() * random.length))
    }

    let snap = new midtrans.Snap({
        isProduction : true,
        serverKey : `${process.env.serverKey}`,
    });

    let parameter = {
        "transaction_details": {
            "order_id": `${orderId}`,
            "gross_amount": product.price
        },
        "credit_card":{
            "secure" : true
        },
        "item_details" : {
            "id" : `${product.id}`,
            "name" : `${product.title}`,
            "price" : `${product.price}`,
            "quantity" : `1`,
        },
        "customer_details": {
            "first_name" : name,
            "last_name" : '',
            "email": email,
            "phone": phone
        }
    };

    snap.createTransaction(parameter)
        .then((transaction)=>{
            let transactionToken = transaction.token;
            response.status(200).json(transactionToken)
            console.log('transactionToken:',transactionToken);
        })
}