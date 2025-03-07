const { message } = require("./Middlewares/joivalidation");

const authantication = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:'you are not logged in'})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const customer = await customer.findById(decoded.id)

        if(!customer){
            return res.status(400).json({message:'not authorized'})
        }

        req.customer = customer

        next();
    } catch (error) {
        return res.status(401).json({message:'invalid or expired token'})
    }
}

const authorize = async (req,res,next) => {
    if(customer.role === admin){
        next()
    }
    else{
        return res.status(401).json({message:'you do not have admin privilage'})
    }
}

const generatetoken = (customer_id) => {
    return jwt.sign({id:customer_id},process.env.JWT_SECRET,{expiresIn:'1d'})
}

const setCookie = (res,token) =>{
    const options = {
        expires:new Date(Date.now()+24*60*60*1000),
        httponly:true
    }
    res.coolkie('token',token,options)
}