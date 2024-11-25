import { CreateReviewDto, Review } from './../models/review';
import axios from 'axios';

import { CreateBookingDto, Estate } from '@/models/Estate';
import sanityClient from './sanity';
import * as queries from './sanityQueries';
import { Booking } from '@/models/Booking';
import { UpdateReviewDto } from '@/models/review';

// libs/apis.ts

// Define the function to fetch user activities from an API or database.
export const getUserActivities = async (userId: string) => {
  try {
    const response = await axios.get(`/api/activities/${userId}`); // Update with actual API endpoint
    return response.data; // Assuming the response data is an array of activities
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw new Error('Could not fetch user activities');
  }
};

export async function getFeaturedEstate() {
  const result = await sanityClient.fetch<Estate>(
    queries.getFeaturedEstateQuery,
    {},
    { cache: 'no-cache' }
  );

  return result;
}

export async function getEstates() {
  const result = await sanityClient.fetch<Estate[]>(
    queries.getEstatesQuery,
    {},
    { cache: 'no-cache' }
  );
  return result;
}

export async function getEstate(slug: string) {
  const result = await sanityClient.fetch<Estate>(
    queries.getEstate,
    { slug },
    { cache: 'no-cache' }
  );

  return result;
}

export const createBooking = async ({
  adults,
  checkinDate,
  checkoutDate,
  children,
  discount,
  Estate,
  numberOfDays,
  totalPrice,
  user,
}: CreateBookingDto) => {
  const mutation = {
    mutations: [
      {
        create: {
          _type: 'Booking',
          user: { _type: 'reference', _ref: user },
          Estate: { _type: 'reference', _ref: Estate },
          checkinDate,
          checkoutDate,
          numberOfDays,
          adults,
          children,
          totalPrice,
          discount,
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
  );

  return data;
};

export const updateEstate = async (EstateId: string) => {
  const mutation = {
    mutations: [
      {
        patch: {
          id: EstateId,
          set: {
            isBooked: true,
          },
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
  );

  return data;
};

export async function getUserBookings(userId: string) {
  const result = await sanityClient.fetch<Booking[]>(
    queries.getUserBookingsQuery,
    {
      userId,
    },
    { cache: 'no-cache' }
  );

  return result;
}

export async function getUserData(userId: string) {
  const result = await sanityClient.fetch(
    queries.getUserDataQuery,
    { userId },
    { cache: 'no-cache' }
  );

  return result;
}

export async function checkReviewExists(
  userId: string,
  EstateId: string
): Promise<null | { _id: string }> {
  const query = `*[_type == 'review' && user._ref == $userId && Estate._ref == $EstateId][0] {
    _id
  }`;

  const params = {
    userId,
    EstateId,
  };

  const result = await sanityClient.fetch(query, params);

  return result ? result : null;
}

export const updateReview = async ({
  reviewId,
  reviewText,
  userRating,
}: UpdateReviewDto) => {
  const mutation = {
    mutations: [
      {
        patch: {
          id: reviewId,
          set: {
            text: reviewText,
            userRating,
          },
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
  );

  return data;
};

export const createReview = async ({
  EstateId,
  reviewText,
  userId,
  userRating,
}: CreateReviewDto) => {
  const mutation = {
    mutations: [
      {
        create: {
          _type: 'review',
          user: {
            _type: 'reference',
            _ref: userId,
          },
          Estate: {
            _type: 'reference',
            _ref: EstateId,
          },
          userRating,
          text: reviewText,
        },
      },
    ],
  };

  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    mutation,
    { headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` } }
  );

  return data;
};

export async function getEstateReviews(EstateId: string) {
  const result = await sanityClient.fetch<Review[]>(
    queries.getEstateReviewsQuery,
    {
      EstateId,
    },
    { cache: 'no-cache' }
  );

  return result;
}

// Fetch saved properties for a user
export const getSavedProperties = async (userId: string) => {
  const query = `*[_type == 'savedProperty' && user._ref == $userId] {
    _id,
    Estate->{
      _id,
      name,
      price,
      description,
      images,
      slug
    }
  }`;

  const params = {
    userId,
  };

  const result = await sanityClient.fetch(query, params);

  return result;
};

// Fetch viewed properties for a user
export const getViewedProperties = async (userId: string) => {
  const query = `*[_type == 'viewedProperty' && user._ref == $userId] {
    _id,
    Estate->{
      _id,
      name,
      price,
      description,
      images,
      slug
    }
  }`;

  const params = {
    userId,
  };

  const result = await sanityClient.fetch(query, params);

  return result;
};
