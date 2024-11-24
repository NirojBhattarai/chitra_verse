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

// Comparing Plain Text Password with Encrypted Password
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
}

//Function to Generate Access Token
userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACESS_TOKEN_EXPIRY}
    );
};

export const User = mongoose.model("User",userSchema);