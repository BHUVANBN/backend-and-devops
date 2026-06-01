import mongoose     from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {type:mongoose.Schema.Types.ObjectId, ref:"Product", required:true},
    quantity: {type:Number, required:true, default:1}
})

const orderSchema = new mongoose.Schema({
    orderItems: [orderItemSchema],
    /*orderItems : {
        type:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId, 
                    ref:"Product", 
                    required:true
                }, 
                quantity:{
                    type:Number, 
                    required:true, 
                    default:1
                }
            }
        ]
    }  
    */
    user: {type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    totalAmount: {type:Number, required:true},
    address: {type:String, required:true},
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "SHIPPED", "DELIVERED"],
        default: "PENDING"
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)