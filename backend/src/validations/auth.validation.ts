export   function register(req,res,next){
    const {name,email,password} = req.body;

    if(!name) return res.status(400).json({message:"Name is Required"})
    if(!email) return res.status(400).json({message:"Email is Required"})
    if(!password) return res.status(400).json({message:"Password is Required"})
    
    if(password.length < 6){
        res.status(400).json({message:"Password must br 6+ character"})
    }
    next()
};