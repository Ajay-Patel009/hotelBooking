import Joi from "joi";


export const uploadImageSchema = Joi.object({
  payload: Joi.object({
    image: Joi.object({
      _data: Joi.any().required(),
      hapi: Joi.object({
        filename: Joi.string().required(),
        headers: Joi.object({
          'content-type': Joi.string().valid('image/jpeg', 'image/png').required(),
        }).unknown(),
      }).unknown(),
    }).required(),
  }).required(),
});


