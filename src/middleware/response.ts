import { ResponseToolkit, ResponseObject } from '@hapi/hapi';

export class httpResponse {
  async sendResponse(
    h: ResponseToolkit,
    b: any,
    d: any = {},
    statusCode: number = 200
  ) {
    const response: ResponseObject = h.response({ ...b, data: d });
    response.code(statusCode);
    return response;
  }
}

