import exp from "constants"
import { HTTP } from "./codeResponses"

export const HOTELMSG = {


    HOTEL_UPLOAD:"Hotel listed successfully",
    HOTEL_DETAIL_UPDATED : "Details of the hotel updated Successfully",
    HOTEL_DETAIL_UPDATE_FAILED:"Failed to update the details of the hotel",
    HOTEL_DELETED:"deleted Successfully",
    HOTEL_DELETE_FAILED:"Failed to delete ",
    HOTEL_NOT_FOUND: 'Sorry..!! this hotel does not exist',
    ERROR: 'Something went wrong',
    BOOKING_SUCCESS:"You have successfully booked the room in this hotel",
    BOOKING_CANCELLED:"You have cancelled your booking successfully",
    BOOKING_NOT_FOUND:"No booking is found",
    GET_HOTELS:"All hotels list",
    HOTEL_DETAILS:"Details of a hotel",
    NOT_EXIST:"This hotel does not exist anymore",


}

export const REVIEW_MSG={


    REVIEW_ADDED:"Review added successfully",
    REVEW_DELETED:"You have successfully deleted the review",
    GET_REVIEW:"List of all the reviews",
    NOT_FOUND:"Review not found",
    NOT_EXIST:"Review not exist",
    ERROR:"Something went wrong",
}


// export const BOOKING_MSG={
//     BOOKING_SUCCESS:"Your booking is successfull",
//     BOKING_CANCEL:"You have cancelled your booking",
//     BOOKING_LIST:"List of bookings",
//     NOT_FOUND:"No booking found",
//     NOT_EXIST:"No bboking exist for this user",
//     ERROR:"Something went wrong on booking "

// }




// export const BOOKING_RESPONSE={
//     BOOKING_SUCCESS:{
//         httpCode: HTTP.SUCCESS,
//         statusCode: HTTP.SUCCESS,
//         message: BOOKING_MSG.BOOKING_SUCCESS
//     },
//     BOOKING_CANCEL:{
//         httpCode: HTTP.SUCCESS,
//         statusCode: HTTP.SUCCESS,
//         message: BOOKING_MSG.BOKING_CANCEL
//     },
//     BOOKING_NOT_FOUND:{
//         httpCode: HTTP.NOT_FOUND,
//         statusCode: HTTP.NOT_FOUND,
//         message: BOOKING_MSG.NOT_FOUND
//     },
//     BOOKING_NOT_EXIST:{
//         httpCode: HTTP.BAD_REQUEST,
//         statusCode: HTTP.BAD_REQUEST,
//         message: BOOKING_MSG.NOT_EXIST
//     },
//     ERROR:{
//         httpCode: HTTP.ERROR,
//         statusCode: HTTP.ERROR,
//         message: BOOKING_MSG.ERROR
//     },
// }









 export const REVIEW_RESPONSE={



    
    ADD_REVIEW:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: REVIEW_MSG.REVIEW_ADDED
    },
    DELETE_REVIEW:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: REVIEW_MSG.REVEW_DELETED
    },
    REVIEW_NOT_FOUND:{
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: REVIEW_MSG.NOT_FOUND
    }, 
    REVIEW_NOT_EXIST:{
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: REVIEW_MSG.NOT_EXIST
    },
    GET_REVIEWS:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: REVIEW_MSG.GET_REVIEW
    },
    ERROR:{
        httpCode: HTTP.ERROR,
        statusCode: HTTP.ERROR,
        message: REVIEW_MSG.ERROR
    }

 }


  export const HOTEL_RESPONSE={

    LIST_HOTELS:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: HOTELMSG.HOTEL_UPLOAD,
    },
    GET_HOTELS:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: HOTELMSG.GET_HOTELS,
    },
    HOTEL_DETAIL:{
        httpCode: HTTP.SUCCESS,
        message: HOTELMSG.HOTEL_DETAILS
    },
    NOT_FOUND:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: HOTELMSG.HOTEL_NOT_FOUND,
    },
    HOTEL_NOT_EXIST:{
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: HOTELMSG.NOT_EXIST,
    },
    DELETED:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: HOTELMSG.HOTEL_DELETED,
    },
    UPADTE_HOTEL:{
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: HOTELMSG.HOTEL_DETAIL_UPDATED,
    },
    ERROR:{
        httpCode: HTTP.ERROR,
        statusCode: HTTP.ERROR,
        message: HOTELMSG.ERROR,
    }
  }  


