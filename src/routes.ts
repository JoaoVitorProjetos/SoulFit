import { Router } from 'express'
import UserControler from './controllers/userController'
import authenticationController from './controllers/authenticationController';

const route = Router();

//-------------------------------USUARIO------------------------------

route.post("/user/create", UserControler.create)
route.post("/user/update/:id", authenticationController.checkToken, UserControler.update)

//------------------------------AUTHENTICATION-------------------------

route.post("/auth/login", authenticationController.login)


export default route