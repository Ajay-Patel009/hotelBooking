import  Boom  from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { createClient } from "redis";
import { USERMSG } from "../common/userResponse";


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
        if(isSession==null) return Boom.unauthorized(USERMSG.LOGGED_OUT_ALREADY);
        return h.continue
    }
}
catch(err)
{
    return h.response({Message:USERMSG.ERROR})
}
}
