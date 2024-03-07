import { NextFunction, Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import User from "../schemas/User"
import bcrypt from 'bcrypt'


class authenticationController{

    //--------------------------------------CHECK TOKEN-------------------------------

    async checkToken(req: Request, res: Response, next: NextFunction){
        const authHeader = req.headers['authorization']
    
        const token = authHeader && authHeader.split(" ")[1]
    
        if(!token){
            return res.status(401).json({msg: "Acess denied"})
        }
    
        try {
    
            const secret: Secret = `${process.env.SECRET}`
    
            jwt.verify(token, secret)
    
            next()
    
        }catch (err){
            res.status(400).json({msg: "token invalid"})
        }
    }

    //--------------------------------------LOGIN-------------------------------

    async login(req: Request,res: Response){
        const {email, password} = req.body
    
        if(!email || !password){
            return res.status(422).json({ msg: "something is null..."})
        }
    
        const userExists = await User.findOne({ email: email })
    
        if(!userExists){
            return res.status(422).json({ msg: "user not found" })
        }
    
        const checkPassword = await bcrypt.compare(password, userExists.password)
    
        if(!checkPassword){
            return res.status(422).json({msg: "password incorrect"})
        }
    
        try{
    
            const secret: Secret = `${process.env.secret}`
            const token = jwt.sign({
                id: userExists._id
            },
            secret,
            {
                expiresIn: '300s'
            })
    
            return res.status(200).json({ 
                msg: "login with success",
                token
            })
    
        }catch(err){
    
            console.log(err)
    
            return res.status(500).json({ msg: "server error"})
        }
    }
}


export default new authenticationController()