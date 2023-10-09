import jwt, { Secret } from 'jsonwebtoken';
import { Request,ResponseToolkit } from '@hapi/hapi'
import dotenv from 'dotenv';
import Boom from '@hapi/boom'
import Hapi from '@hapi/hapi'
import User, { Userstatus } from '../models/user';
import { USERMSG } from '../common/userResponse';




dotenv.config()
const SECRET_KEY=process.env.SECRET_KEY;

export const authenticateJWT = async(request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const token = request.headers.authorization;
    if (!token) throw Boom.unauthorized('Missing Token');
  
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY as Secret);
      if(!decodedToken) throw Boom.unauthorized('Invalid token');
      request.headers.userId= decodedToken;
      const id=request.headers.userId;
      const user=await User.findOne({_id:id.userId})
      if(user?.status==Userstatus.deleted) throw Boom.unauthorized(USERMSG.USER_NOT_EXIST);
      if(user?.status==Userstatus.blocked) throw Boom.unauthorized(USERMSG.USER_BLOCKED);
      // if(user?.status==Userstatus.inactive) throw Boom.unauthorized('this user is inactive');
      return h.continue
    }
    catch (err) {
      if(Boom.isBoom(err)) throw Boom.unauthorized(err)
    throw Boom.unauthorized(USERMSG.ERROR);
    }
  };





  export const adminJwtMiddlware = (request:Request, h:ResponseToolkit) => {
    const token = request.headers.authorization;
  
    if (!token) return h.response({ message: 'Missing JWT token.' });
    
    try {
      const decodedToken = jwt.verify(token, SECRET_KEY as Secret);
     if(decodedToken)
  
    console.log(decodedToken)
      request.headers.userId= decodedToken;
      console.log(request.headers.userId.type)
      
      if(request.headers.userId.type!="admin"||request.headers.userId.type==null)
      {
        return Boom.unauthorized("invalid token")
      }
      
      return h.continue
    }
    catch (err) {
      return h.response({ message: 'Invalid token' })
    }
  };
  export default authenticateJWT;