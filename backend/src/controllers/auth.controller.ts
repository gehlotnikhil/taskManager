import * as authService from "../services/auth.service"

export  async function register(req,res){
    try {
        const user = await authService.registerUser(req.body);
        return res.status(200).json({success:true,message:"User Registered Successfully",data:user})
    } catch (error) {
        return res.status(400).json({success:false,message: error.message})
    }
}
export async function login(req,res){
    try {
      console.log(1)
      const {email,password} = req.body;
      console.log(2)
      
      const result  = await authService.loginUser(email,password)
  
      res
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: result.user,
        token: result.token
      });
      console.log(3)

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
export async function verifycode(req,res){
  try {
      const {email,otpCode} = req.body
      const result  =  await authService.verifycode(email,otpCode)
  
      return res.status(200).json({success:true,message:"OTP Verified",user:result.user,token:result.token})
  } catch (error) {
    res.status(400).json({success:false,message:error.message})
  }
}

export async function verifytoken(req,res){
  try {
    console.log(1)
    console.log(1.1,req.user)
      const id = req.user.id
      const result  =  await authService.verifytoken(id)
      return res.status(200).json({success:true,message:"Token Verified",user:result.user})
  } catch (error) {
    res.status(400).json({success:false,message:error.message})
  }
}

export async function logout(req, res) {
 

  res.json({ success: true });
  
}

