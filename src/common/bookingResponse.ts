import { HTTP } from "./codeResponses"



export const BOOKING_MSG={
    BOOKING_SUCCES:"You have successfully booked the hotel",
    NOT_FOUND:"No bookings found for this user",
    NOT_EXIST:"Booking does not exist",
    BOOKING_CANCEL:"Booking cancelled successfully",
    GET_BOOKINGS:"List of all bookings",
    ERROR:"Something went wrong",

}


export const BOOKING_RESPONSE={
    BOOKING_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: BOOKING_MSG.BOOKING_SUCCES,
      },
      NOT_FOUND: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: BOOKING_MSG.NOT_FOUND,
      },
      NOT_EXIST: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: BOOKING_MSG.NOT_EXIST,
      },
      BOOKING_CANCEL: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: BOOKING_MSG.BOOKING_CANCEL,
      },
      GET_BOOKING: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: BOOKING_MSG.GET_BOOKINGS,
      },
      ERROR: {
        httpCode: HTTP.ERROR,
        statusCode: HTTP.ERROR,
        message: BOOKING_MSG.ERROR,
      },
      
}