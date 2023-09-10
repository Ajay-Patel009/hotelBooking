import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom'; // Import the Boom module for error handling

const secretKey = process.env.SECRET_KEY || 'default-secret-key';
type ValidateFuncType = (
  decoded: any,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => Promise<Hapi.Lifecycle.ReturnValueTypes>;
export const validateToken: ValidateFuncType = async (decoded, request, h) => {
  try {

    const credentials: Hapi.Lifecycle.ReturnValueTypes = {
      isValid: true,
      credentials: {
        userId: decoded.userId,
      },
    };

    return credentials;
  } catch (error) {
    throw Boom.unauthorized('Invalid token');
  }
};