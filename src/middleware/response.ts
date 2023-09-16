import { ResponseToolkit } from '@hapi/hapi';


export class SuccessResponse {
    constructor(public data:any,public statusCode: number = 500, public message: string = 'Success',) {}
  }



  export class ErrorResponse {
    constructor(public message: string, public statusCode: number = 500) {}
  }

  export class BadRequestResponse {
    constructor(public message: string = 'Bad Request') {}
  }
  export class UnauthorizedResponse {
    constructor(public message: string = 'Unauthorized') {}
  }
  export class ForbiddenResponse {
    constructor(public message: string = 'Forbidden') {}
  }
  export class NotFoundResponse {
    constructor(public message: string,public statusCode:number=404) {}
  }
  export class InternalServerErrorResponse {
    constructor(public message: string = 'Internal Server Error') {}
  }
  export class ConflictResponse {
    constructor(public message: string,public statusCode:number=400) {}
  }
  
  
    
    
  



 

  export class ResponseUtil {
    public static success(data: any, h: ResponseToolkit, statusCode: number = 200) {
      return h.response(new SuccessResponse(data,statusCode)).code(statusCode);
    }
  
    public static error(message: string, h: ResponseToolkit, statusCode: number = 500) {
      return h.response(new ErrorResponse(message, statusCode)).code(statusCode);
    }

    public static badRequest(message: string, h: ResponseToolkit) {
        return h.response(new BadRequestResponse(message)).code(400);
      }
    
      public static unauthorized(message: string, h: ResponseToolkit) {
        return h.response(new UnauthorizedResponse(message)).code(401);
      }
    
      public static forbidden(message: string, h: ResponseToolkit) {
        return h.response(new ForbiddenResponse(message)).code(403);
      }
    
      public static notFound(message: string, h: ResponseToolkit,statusCode: number=404) {
        return h.response(new NotFoundResponse(message,statusCode)).code(404);
      }
    
      public static internalServerError(message: string, h: ResponseToolkit) {
        return h.response(new InternalServerErrorResponse(message)).code(500);
      }

      public static conflict(message: string, h: ResponseToolkit,statusCode: number=400) {
        return h.response(new ConflictResponse(message,statusCode)).code(400);
      }
  }
  