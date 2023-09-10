import {ServerRoute } from "@hapi/hapi";
import authenticateJWT from "../middleware/jwtMiddleware";
import Joi, { string } from "joi";
import { addReview, bookHotel, cancelBooking, deleteHotel, deleteReview, filterHotel, getAllHotel, getHotelReviewsWithUserNames, gethotelDetail, updateHotel, uploadHotel, uploadImage, viewAllMyReviews, viewAllbookings, viewbookings } from "../controller/hotel.controller";
import { session } from "../middleware/session";







export const Hotelroutes: ServerRoute[] = [
    {
      method: 'POST',
      path: '/upload',
      options:{
        // auth:"jwt"
        tags: ['api',"hotel"],   
        description: 'uploadHotel',
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
        description: 'deleteHotel',
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
        description: 'filter hotel',
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
        description: 'updateHotel',
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
        description: 'show hotel deatails',
        validate:{
          query:Joi.object({
          
            hotel_id: Joi.string(),
        }
      )
      }
        
      },
      handler:gethotelDetail
    },




    {
      method: 'POST',
      path: '/bookHotel',
      options:{
        tags: ['api',"hotel"],   
        description: 'hotel booking',
        pre: [{method: authenticateJWT},{method:session}],
        validate:{
          payload:Joi.object({check_in_date:Joi.string(), check_out_date:Joi.string()}),
          query:Joi.object({hotel_id: Joi.string(),})
        },
      handler:bookHotel
    },
  },



    {
      method: 'DELETE',
      path: '/cancelBookings',
      options:{
        tags: ['api',"hotel"],   
        description: 'cancel booking',
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
        description: 'view my bookings',
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
        description: 'view my hotel bookings',
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
        description: 'add review to hotel',
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
        description: 'delete review to hotel',
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
        description: 'view review of hotel',
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
        description: 'view review of hotel',
        pre: [{method: authenticateJWT}]
        // validate:{query:Joi.object({hotel_id: Joi.string()})}
       },
      handler:viewAllMyReviews
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
    
 
  
    
    

]