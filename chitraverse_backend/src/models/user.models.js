//User Database Schema
import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:[true,"Username is required"],
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            trim:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true,
        },
        coverImage:{
            type:String,
        },
       watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
       ],
       password:{
            type:String,
            required:[true,"Password is required"],
       },
       refreshToken:{
            type:String,
       }

    },
    {
        timestamps:true,
    }
)

// Encrypting Password Before Saving or Updating on Database
userSchema.pre("save", async function (next){
    if(!this.modified("password")) return next();
    this.password = bcrypt.hash(this.password,10);
    next();
})

export const User = mongoose.model("User",userSchema);