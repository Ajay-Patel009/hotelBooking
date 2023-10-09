import {ServerRoute } from "@hapi/hapi";
import authenticateJWT from "../middleware/jwtMiddleware";
import Joi from "joi";
import { addReview, cancelBooking, chatBot, deleteHotel, deleteReview, filterHotel, getAllHotel, getHotelReviewsWithUserNames, gethotelDetail, hotelBooking, searchHotels, searchit, updateHotel, uploadHotel, uploadImage, viewAllMyReviews, viewAllbookings, viewbookings } from "../controller/hotel.controller";
import { session } from "../middleware/session";







export const Hotelroutes: ServerRoute[] = [
    {
      method: 'POST',
      path: '/upload',
      options:{
        // auth:"jwt"
        tags: ['api',"hotel"],   
        description: 'owners/hotelAdmin can upload Hotel',
         pre: [{method: authenticateJWT},{method:session}],
         validate:{
          payload:Joi.object({
            name:Joi.string().required(),
            title:Joi.string().required(),
            type:Joi.number().required(),
            description:Joi.string(),
            price:Joi.number(),
            amenities:Joi.object({
              swimmingPool:Joi.bool(),
              wifi:Joi.bool(),
              spa:Joi.bool(),
              parking:Joi.bool(),
          }),
        
          address:Joi.object({
            area:Joi.string(),
            city:Joi.string(),
            country:Joi.string(),
            pincode:Joi.number()
            
          }).required(),
        })
      },
      handler:uploadHotel
    }},






    {
      method: 'DELETE',
      path: '/deleteRoom',
      options:{
        tags: ['api',"hotel"],   
        description: 'hotel owners/admins delete their Hotel from the application',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{
            query:Joi.object({
          
              id: Joi.string(),
        }
      )
      }
    },
      handler:deleteHotel
    },




    {
      method: 'GET',
      path: '/searchHotels',
      options:{
        tags: ['api',"hotel"],   
        description: 'users are able to search the hotels',
      
      },

      handler:searchHotels
    },

    {
      method: 'GET',
      path: '/searchit',
      options:{
        tags: ['api',"hotel"],   
        description: 'hotel owners/admins delete their Hotel from the application',
      
      },

      handler:searchit
    },







    {
      method: 'GET',
      path: '/getAllRooms',
      options:{
        auth:false,
        tags: ['api',"hotel"],   
        description: 'show all hotels',
        validate:{
        query:Joi.object({
          page: Joi.number(),
          limit: Joi.number()
        })
          
     }
   
      },
      handler:getAllHotel
    },





    {
      method: 'GET',
      path: '/filter',
      options:{
        auth:false,
        tags: ['api',"hotel"],   
        description: 'view list of hotels by applying filters',
        validate:{
          query:Joi.object({
           price: Joi.number(),
           type: Joi.number(),
           city:Joi.string()
      }
    )
    }
      },
      handler:filterHotel
    },





    {
      method: 'PUT',
      path: '/updateRoomDetails',
      options:{
        tags: ['api',"hotel"],   
        description: 'owners or hotel admin can update Hotel',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{
          payload:Joi.object({
              name:Joi.string().optional(),
              title:Joi.string().optional(),
              description:Joi.string().optional(),
              price: Joi.number().optional(),
              amenities:Joi.object({
                  wifi:Joi.bool().optional(),
                  spa:Joi.bool().optional(),
                  parking:Joi.bool().optional(),
                  swimmingPool:Joi.bool().optional()
              }).optional()
          }).optional(),
          query:Joi.object({
            hotel_id:Joi.string()
          })
          
      }
       
      },
    handler:updateHotel
    },
  
    {
      method: 'GET',
      path: '/getRoomDetails',
      options:{
        auth:false,
        tags: ['api',"hotel"],   
        description: 'user can see  hotel deatails',
        validate:{
          query:Joi.object({
          
            hotel_id: Joi.string(),
        }
      )
      }
        
      },
      handler:gethotelDetail
    },




  //   {
  //     method: 'POST',
  //     path: '/bookHotel',
  //     options:{
  //       tags: ['api',"hotel"],   
  //       description: 'hotel booking',
  //       pre: [{method: authenticateJWT},{method:session}],
  //       validate:{
  //         payload:Joi.object({check_in_date:Joi.string(), check_out_date:Joi.string()}),
  //         query:Joi.object({hotel_id: Joi.string(),})
  //       },
  //     handler:bookHotel
  //   },
  // },

  {
    method: 'POST',
    path: '/hotelBooking',
    options:{
      tags: ['api',"hotel"],   
      description: 'user can perform hotel booking',
      pre: [{method: authenticateJWT},{method:session}],
      validate:{
        payload:Joi.object({check_in_date:Joi.string(), check_out_date:Joi.string()}),
        query:Joi.object({hotel_id: Joi.string(),})
      },
    handler:hotelBooking
  },
},



    {
      method: 'DELETE',
      path: '/cancelBookings',
      options:{
        tags: ['api',"hotel"],   
        description: 'user can cancel booking',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{query:Joi.object({booking_id: Joi.string()})}
        },
      handler:cancelBooking
    },



    {
      method: 'GET',
      path: '/viewMyBookings',
      options:{
        tags: ['api',"hotel"],   
        description: 'user can view thier bookings',
        pre: [{method: authenticateJWT}],
        validate:{query:Joi.object({hotel_id: Joi.string()})}
        },
      handler:viewbookings
    },



    {
      method: 'GET',
      path: '/viewAllBookings',
      options:{
        tags: ['api',"hotel"],   
        description: 'owner can see list of all bookings on their  hotel',
        pre: [{method: authenticateJWT}],
        validate:{query:Joi.object({hotel_id: Joi.string()})}
        },
      handler:viewAllbookings
    },



    


    {
      method: 'POST',
      path: '/addReview',
      options:{
        tags: ['api',"hotel"],   
        description: 'user can add review to hotel',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{
          payload:Joi.object({rating:Joi.number(),text:Joi.string()}),
          query:Joi.object({hotel_id: Joi.string(),})
    }
        
      },
      handler:addReview
    },




    {
      method: 'DELETE',
      path: '/deleteReview',
      options:{
        tags: ['api',"hotel"],   
        description: 'user can delete review to hotel',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{query:Joi.object({hotel_id: Joi.string()})}
        },
      handler:deleteReview
    },




    {
      method: 'GET',
      path: '/viewReview',
      options:{
        tags: ['api',"hotel"],   
        description: 'view review of  hotel',
        // pre: [{method: authenticateJWT}]
        validate:{query:Joi.object({hotel_id: Joi.string()})}
       },
      handler:getHotelReviewsWithUserNames
    },



    {
      method: 'GET',
      path: '/viewAllMyReviews',
      options:{
        tags: ['api',"hotel"],   
        description: 'user can see all the reviews that he gave on the hotels',
        pre: [{method: authenticateJWT}]
        // validate:{query:Joi.object({hotel_id: Joi.string()})}
       },
      handler:viewAllMyReviews
    },

    {
      method: 'GET',
      path: '/chatBot',
      options:{
        tags: ['api',"hotel"],   
        description: 'solve users Queries by chatbot',
        validate:{query:Joi.object({query: Joi.string()})}
       },
      handler:chatBot
    },







  {
    method: 'POST',
    path: '/uploadImage',
    handler: (request, h) => {
      return uploadImage(request, h);
    },
    options: {
      tags: ['api', 'hotel'],
      
      payload: {
        output: 'stream',
        parse: true,
        multipart: {
          output: 'stream',
        },
        allow: 'multipart/form-data',
      },
      description:"File upload",
        	notes:'file-upload',
        	// tags:['api'],
			plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
      validate: {
        payload: Joi.object({
            file: Joi.any()
                .meta({ swaggerType: 'file' })
                .description('file')

        }),
        query: Joi.object({
                  
          room_id: Joi.string().required(),
      })
    }
    },
  },
    
//thi i to indto ou thetwe arr going to
  
    
    

]