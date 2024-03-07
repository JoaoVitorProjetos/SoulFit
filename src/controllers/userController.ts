import { NextFunction, Request, Response } from "express";
import User from '../schemas/User';
import bcrypt from 'bcrypt'

class UserControler{

    //--------------------------------------CREATE------------------------------------

    async create(req: Request, res: Response){
        const { name, cpf, email, password, confirmPassword } = req.body;

        if(!name || !cpf || !email || !password || !confirmPassword){
            return res.status(422).json({
                msg: "something is null..."
            })
        };

        if(cpf.length != 11){
            return res.status(422).json({
                msg: "cpf is incorrect..."
            })
        }

        if(password != confirmPassword){
            return res.status(422).json({ msg: "the passwords doesn't match"  })
        }

        const userExists = await User.findOne({ email: email })

        if(userExists){
            return res.status(422).json({ msg: "this email is already in use" })
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            cpf,
            email,
            password: passwordHash
        })

        try{

            await user.save()
    
            res.status(201).json({ msg: "user registered"})
    
        } catch(err){
    
            console.log(err)
    
            res.status(500).json({ msg: "Server error, contact the support"})
        }
    }


    //--------------------------------------UPDATE------------------------------------

    async update(req: Request, res: Response){

        const id = req.params.id

        const user = await User.findById(id, '-password')

        if(!user){
            return res.status(404).json({msg: "user not found"})
        }

        const { name, cpf, email } = req.body

        if(!name || !cpf || !email){
            return res.status(422).json({
                msg: "something is null..."
            })
        }

        const userExists = await User.find({ email: email })

        if(user.email != email && userExists){
            return res.status(422).json({
                msg: "email already in use"
            })
        }

        try{
            user.updateOne({
                name: name,
                cpf: cpf,
                email: email
            }).then(() => {
                return res.status(201).json({
                    msg: "user updated"
                })
            })
        }catch(e){
            return res.status(500).json({
                msg: "sever error"
            })
        }
    }
}

export default new UserControler();