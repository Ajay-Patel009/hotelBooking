import mongoose, { ObjectId } from "mongoose";
import User from "../models/user";
import Boom from "@hapi/boom";
import { HTTP } from "../common/codeResponses";
import Hotel from "../models/hotel.scema";
import Review from "../models/reviewSchema";
const stripe = require("stripe")(
  "sk_test_51NpnFqSDai0wLS7KMsQefprvlODc5hLdMRmdln5TdDKxBz6PnqXeBMoIVLeLDDVB5Xu2HVHHIaVqwdf6laQvLxRT00hu4x82QT"
);

import { payment_service } from "./payment.service";

export class hotel_service {
  static async uploadHotel(owner_id: string, requestBody: any) {
    // console.log(uid)
    const isOwnerPresent = await User.findById({
      _id: owner_id,
      userType: 2,
    });

    if (!isOwnerPresent) {
      throw Boom.notFound("Sorry You are not a Owner");
    }
    if (isOwnerPresent.isVerified == false) {
      throw Boom.unauthorized(
        "Sorry You Cannot post Because You are not a verified Owner"
      );
    }
    const propertyData = {
      ...requestBody,
      "contactInfo.name": isOwnerPresent.name,
      "contactInfo.email": isOwnerPresent.email,
      "contactInfo.phone": isOwnerPresent.phone,
      createdBy: owner_id,
    };
    const newProperty = await Hotel.create(propertyData);
    if (newProperty) return;
  }

  static async deleteHotel(house_id: string, owner_id: string) {
    const deleteRooms = await Hotel.findOneAndDelete({
      _id: house_id,
      createdBy: owner_id,
    });
    if (deleteRooms) {
      return true;
    } else {
      return false;
    }
  }

  static async hotelDetails(house_id: string) {
    const house_details = await Hotel.find({ _id: house_id });
    if (house_details) {
      return house_details;
    } else {
      return false;
    }
  }

  static async updateHotelDetails(
    hotel_id: string,
    owner_id: string,
    requestBody: any
  ) {
    const isUpdated = await Hotel.findOneAndUpdate(
      { _id: hotel_id, createdBy: owner_id },
      { $set: requestBody },
      { new: true }
    );
    if (isUpdated) {
      return isUpdated;
    } else {
      return false;
    }
  }

  static async getAllHotel(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const data = await Hotel.find(
        {},
        { name: 1, title: 1, type: 1, price: 1, images: 1, reviews: 1 }
      )
        .skip(skip)
        .limit(limit);

      const totalCount = await Hotel.countDocuments();

      if (data) {
        const totalPages = Math.ceil(totalCount / limit);
        const response = {
          hotels: data,
          currentPage: page,
          totalPages: totalPages,
        };
        return [response, HTTP.SUCCESS];
      } else {
        return [{}, HTTP.NOT_FOUND];
      }
    } catch (error) {
      console.error(error);
      return [{}, HTTP.NOT_FOUND];
    }
  }
}

export class hotel_review_service {
  static async giveReview(
    hotel_id: string,
    userId: string,
    rating: number,
    text: string
  ) {
    try {
      const user_id = new mongoose.Types.ObjectId(userId);
      const isHotel = await Hotel.findById(hotel_id);

      if (!isHotel) {
        return [{}, HTTP.NOT_FOUND];
      }

      const existingReview = await Review.findOne({ hotel_id: hotel_id });
      if (existingReview) {
        const newReview: any = {
          user_id: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
          rating: rating,
          text: text,
        };
        existingReview.reviews.push(newReview);
        await existingReview.save();
        const property = await Review.findOne({ hotel_id: hotel_id });
        const totalReviews = property?.reviews.reduce((total) => total + 1, 0);
        const totalratings = property?.reviews.reduce(
          (total, reviews) => total + reviews.rating,
          0
        );
        var avgRating: number;
        if (totalratings && totalReviews) {
          avgRating = totalratings / totalReviews;
          await Hotel.findByIdAndUpdate(
            { _id: hotel_id },

            {
              $set: {
                "reviews.total_reviews": totalReviews,
                "reviews.ratings": avgRating,
              },
            }
          );
        }

        return [existingReview, HTTP.SUCCESS];
      } else {
        const newReviewData = {
          hotel_id: hotel_id,
          reviews: [
            {
              user_id: new mongoose.Types.ObjectId(userId),
              rating: rating,
              text: text,
            },
          ],
        };
        const newReview = await Review.create(newReviewData);
        const property = await Review.findOne({ hotel_id: hotel_id });
        const totalReviews = property?.reviews.reduce((total) => total + 1, 0);
        const totalratings = property?.reviews.reduce(
          (total, reviews) => total + reviews.rating,
          0
        );
        console.log(totalReviews);
        console.log(totalratings);
        return [newReview, HTTP.SUCCESS];
      }
    } catch (error) {
      console.error(error);
      return [{}, HTTP.NOT_FOUND];
    }
  }

  static async deleteReview(user_id: string, hotel_id: string) {
    try {
      const id = new mongoose.Types.ObjectId(hotel_id);
      const review = await Review.findOne({ hotel_id: id });

      if (!review) {return [{}, HTTP.NOT_FOUND]}
      const reviewIndex = review.reviews.findIndex((review) => review.user_id.toString() == user_id);

      if (reviewIndex !== -1) {
        review.reviews.splice(reviewIndex, 1);
        await review.save();
        return [review, HTTP.SUCCESS];
      } else {
        return [{}, HTTP.NOT_FOUND];
      }
    } catch (error) {
      console.error(error);
      return [{}, HTTP.BAD_REQUEST];
    }
  }

  static async viewReview(hotelId: mongoose.Types.ObjectId) {
    const id = new mongoose.Types.ObjectId(hotelId);
    const aggregationPipeline = [
      {
        $match: { hotel_id: id },
      },

      {
        $unwind: "$reviews",
      },
      {
        $lookup: {
          from: "users",
          localField: "reviews.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          review: "$reviews.text",
          userName: "$user.name",
          rating: "$reviews.rating",
        },
      },
    ];

    const result = await Review.aggregate(aggregationPipeline);
    return result;
  }

  static async viewMyAllReview(userId: mongoose.Types.ObjectId) {
    try {
      // const { userId } = request.query;

      // Use MongoDB aggregation to join Review and Hotel collections
      const id = new mongoose.Types.ObjectId(userId);
      const userReviewsWithHotelNames: any[] = await Review.aggregate([
        {
          $match: {
            "reviews.user_id": id, //mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "hotels", // Collection name for hotels
            localField: "hotel_id",
            foreignField: "_id",
            as: "hotel",
          },
        },
        {
          $unwind: "$hotel",
        },
        {
          $project: {
            _id: 0,
            hotelName: "$hotel.name",
            review: "$reviews",
          },
        },
      ]);

      return { results: userReviewsWithHotelNames };
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      return { message: "Internal server error" };
    }
  }
}

export class hotel_booking_service {
  static async viewallBookings(hotelId: string) {
    const bookings = await User.find(
      { "booking.room_id": hotelId },
      { name: 1, booking: 1 }
    );
    // console.log(bookings);
    return bookings;
  }

  static async book_hotel(
    userId: string,
    hotelId: string,
    check_in_date: string,
    check_out_date: string
  ) {
    const userExist = await User.findById(userId);
    const hotelExist = await Hotel.findById({ _id: hotelId });
    if (userExist) {
      const newBooking: any = {
        room_id: hotelId,
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        bookedOn: new Date(),
      };
      userExist.booking.push(newBooking);
      await userExist.save();
      newBooking.email = userExist.email;
      const bookingIds = userExist.booking.map((booking) => booking._id);
      const bookingId = bookingIds[bookingIds.length - 1];
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: hotelExist?.name,
              },
              unit_amount: hotelExist?.price, // Amount in cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          ownerId: (hotelExist?.createdBy).toString(),
          userId: userId,
          hotelId: hotelId,
          check_in_date: check_in_date,
          check_out_date: check_out_date,
          bookingId: bookingId,
        },
        mode: "payment",
        success_url:
          "http://localhost:3000/paymentOnSuccess?sessionId={CHECKOUT_SESSION_ID}", // Redirect URL on success
        cancel_url:
          "http://localhost:3000/paymentOnFailed?sessionId={CHECKOUT_SESSION_ID}",
      });
      console.log(session);
      return { sessionUrl: session.url };
    }
  }
}
