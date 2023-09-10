// import { ResponseToolkit, Server } from '@hapi/hapi';
// import Jwt, { Options } from 'hapi-auth-jwt2';
// const SECRET_KEY = process.env.SECRET_KEY;
// // import  from '@hapi/hapi'


// const plugin = {
//     name: "jwt-authentication",
//     version: '1.0.0',
//     register: async function(server:Server, options:Options){
//         await server.register(Jwt);

//         server.auth.strategy('jwtAuth', 'jwt', {
//             key: "hh",
//             validate: async (decoded,request:any, h:ResponseToolkit) =>{
//                 // console.log(decoded);
//                 request.user = decoded;
//                 return {isValid: true};
//             }
//         })
//     }
// }

// export default plugin;