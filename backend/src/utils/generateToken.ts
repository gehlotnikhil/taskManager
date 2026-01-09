import  jwt  from "jsonwebtoken";
import crypto from "crypto"

function generateJwtToken(payload){
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const  generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex")
};

const generateSessionToken = ()=>{

    return crypto.randomBytes(40).toString("hex")
}
const generateRandomCode=(size)=>{
  return crypto.randomBytes(size).toString("hex")
}
const generateExpiryOfOtp=()=>{
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 1); 
  return currentDate;

}
export {
    generateJwtToken,
    generateAccessToken,
    generateRandomCode,
    generateRefreshToken,
    generateSessionToken,
    generateExpiryOfOtp
}