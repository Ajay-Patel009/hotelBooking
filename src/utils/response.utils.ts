// import { ExceptionMessage, HTTP, HttpResponse, HttpStatusCode, HttpStatusMessage } from "../common/codeResponses";



// class ResponseUtils{
//     successResponse(
//         data: any,
//         message: string = HttpStatusMessage.OK,
//         status: string = HttpStatusMessage.OK
//     ): HttpResponse {
//         const response : HttpResponse = {
//             code: this.getStatusCode(<keyof typeof HttpStatusCode> status),                               //  is a type assertion that is used to convert the status parameter into a type that represents the keys of the HttpStatusCode enum ( here we find httpstatuscode using the httpstatusmessage)
//             status: status,
//             message: message,
//             timestamp: new Date().getTime(),
//             data: data,
//             error: null,
//         };
//         return response;
//     }


//     errorResponse(
//         error: any,
//         message: ExceptionMessage = ExceptionMessage.ERROR,
//         status : HttpStatusMessage = HttpStatusMessage.BAD_REQUEST
//     ): HttpResponse {
//         const response: HttpResponse = {
//             code: error?.code || this.getStatusCode(<keyof typeof HttpStatusCode> status),
//             status: error?.status || status,
//             message: error?.message || message,
//             timestamp: new Date().getTime(),
//             data: null,
//             error: error?.data || error
//         };

//         return response;
//     }

//     private getStatusCode(status: keyof typeof HttpStatusCode): number {
//         return HttpStatusCode[status] || HttpStatusCode.BAD_GATEWAY
//     }

// }

// export const responseUtils = new ResponseUtils();