import  Boom  from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { createClient } from "redis";


const client=createClient()
client.connect();

export async function session(request:Request,h:ResponseToolkit)
{
    try{
   
    const uid=request.headers.userId
    if(uid.userId)
    { 
        const isSession=await client.hGet((uid.userId),"status");
        console.log(isSession)
        if(isSession==null)
        {
            
            return Boom.unauthorized("You are logged out");
        }
        return h.continue
        
    }
}
catch(err)
{
    return h.response({Message:"something went wrong"})
}
}
