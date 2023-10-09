import { HTTP } from "./codeResponses"



export const USERMSG = {
    USER_LOGIN : "Login Successfully",
    LOGOUT:"Logout Successfully",
    USER_EXIST: 'User already exist',
    USER_NOT_EXIST: 'User not exist',
    USER_BLOCKED:"You are blocked.....!!",
    USER_RE_REGISTER:"Welcome back to our plateform",
    USER_REGISTER: 'User register successfully',
    USER_DELETE: 'Profile delete successfully',
    USER_PROFILE_UPDATED: "User details updated successfully",
    USER_PROFILE_DETAILS:"User profile details",
    USER_UPDATE_FAILED:"Failed to update the user details",
    EMAIL_NOT_REGISTERED: `Sorry, we don't recognize that email. Please try again or contact us with any questions.`,
    USER_EMAIL_ALREADY:'This email is already registered. Please try again.',
    PASSWORD_CHANGED: ' Password changed successfully',
    OTP_SEND: 'Otp send successfully',
    INVALID_OTP: `Sorry, we don't recognize that code. Please try again or contact us for help.`,
    ERROR: 'Something went wrong',
    WRONG_PASSWORD:"You have enterd wrong password",
    LOGGED_OUT_ALREADY: "you are logged out.... Please login again for the further access",
    PASSWORD_MISSMATCH:"Your Password is miss-match.. Please try again",
    }


  export const OWNERMSG={
    NOT_VERIFIED:"Sorry You Cannot post Because You are not a verified Owner",
    NOT_OWNER:"You are not an owner",
  }


    export const USERRESPONSE = {
       RE_REGISTER_USER:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: USERMSG.USER_RE_REGISTER,
       },
       REGISTER_USER:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: USERMSG.USER_REGISTER,
       },

       USER_BLOCKED:{
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: USERMSG.USER_BLOCKED,
       },
      
        USER_LOGIN: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_LOGIN,
        },
        LOGOUT: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.LOGOUT,
        },
        OTP_SEND:{
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.OTP_SEND,
        },
        INVALID_OTP: {
          httpCode: HTTP.BAD_REQUEST,
          statusCode: HTTP.BAD_REQUEST,
          message: USERMSG.INVALID_OTP,
        },

        // SUCCESS: {
        //   httpCode: HTTP.SUCCESS,
        //   statusCode: HTTP.SUCCESS,
        //   message: USERMSG.SUCCESS,
        // },
        // USER_EMAIL_PASSWORD_DETAILS: {
        //   httpCode: HTTP.SUCCESS,
        //   statusCode: HTTP.SUCCESS,
        //   message: USERMSG.USER_EMAIL_PASSWORD_DETAILS,
        // },
   
        
        USER_PROFILE_DETAILS: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_PROFILE_DETAILS,
        },
        USER_PROFILE_UPDATED: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_PROFILE_UPDATED,
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
        USER_DELETE: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_DELETE,
        },
        USER_REGISTERED:{
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.USER_REGISTER,
        },
      
        ERROR: {
          httpCode: HTTP.BAD_REQUEST,
          statusCode: HTTP.BAD_REQUEST,
          message: USERMSG.ERROR,
        },
        PASSWORD_CHANGED: {
          httpCode: HTTP.SUCCESS,
          statusCode: HTTP.SUCCESS,
          message: USERMSG.PASSWORD_CHANGED,
        },
        // INCORRECT_PASSWORD: {
        //   httpCode: HTTP.BAD_REQUEST,
        //   statusCode: HTTP.BAD_REQUEST,
        //   message: USERMSG.INCORRECT_PASSWORD,
        // },
         PASSWORD_MISMATCH: {
          httpCode: HTTP.BAD_REQUEST,
          statusCode: HTTP.BAD_REQUEST,
          message: USERMSG.PASSWORD_MISSMATCH,
        },
        WRONG_PASSWORD: {
          httpCode: HTTP.BAD_REQUEST,
          statusCode: HTTP.BAD_REQUEST,
          message: USERMSG.WRONG_PASSWORD,
        },
    }