import { HTTP } from "./codeResponses"



export const USERMSG = {
    USER_LOGIN : "Login Successfully",
    USER_LOGOUT:"Logout Successfully",
    USER_EXIST: 'User already exist',
    USER_NOT_EXIST: 'User not exist',
    USER_REGISTER: 'User register successfully',
    USER_DELETE: 'Profile delete successfully',
    USER_UPDATED: "User details updated successfully",
    USER_UPDATE_FAILED:"Failed to update the user details",
    EMAIL_NOT_REGISTERED: `Sorry, we don't recognize that email. Please try again or contact us with any questions.`,
    USER_EMAIL_ALREADY:'This email is already registered. Please try again.',
    RESET_PASSWORD: 'Reset password successfully',
    OTP_SEND: 'Otp send successfully',
    INVALID_OTP: `Sorry, we don't recognize that code. Please try again or contact us for help.`,
    ERROR: 'Something went wrong',
    WRONG_PASSWORD:"You have enterd wrong password",
    LOGGED_OUT_ALREADY: "you are logged out.... Please login again for the further access",
    PASSWORD_MISSMATCH:"Your Password is miss-match.. Please try again"
    }


    export const USERRESPONSE = {
        USER_LOGIN: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_LOGIN,
        },
        USER_PROFILE_UPDATED: {
            httpCode: HTTP.SUCCESS,
            statusCode: HTTP.SUCCESS,
            message: USERMSG.USER_UPDATED,
          },
          USER_EXIST: {
            httpCode: HTTP.BAD_REQUEST,
            statusCode: HTTP.BAD_REQUEST,
            message: USERMSG.USER_EXIST,
          },
          USER_NOT_EXIST: {
            httpCode: HTTP.BAD_REQUEST,
            statusCode: HTTP.BAD_REQUEST,
            message: USERMSG.USER_NOT_EXIST,
          },
    }