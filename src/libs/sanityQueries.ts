import { groq } from 'next-sanity';

// Featured Estate Query
export const getFeaturedEstateQuery = groq`
    *[_type == "Estate" && isFeatured == true][0] {
        _id,
        description,
        discount,
        images,
        isFeatured,
        name,
        price,
        slug,
        coverImage
    }
`;

// All Estates Query
export const getEstatesQuery = groq`
    *[_type == "Estate"] {
        _id,
        coverImage,
        description,
        dimension,
        isBooked,
        isFeatured,
        name,
        price,
        slug,
        type
    }
`;

// Estate by Slug Query
export const getEstate = groq`
    *[_type == "Estate" && slug.current == $slug][0] {
        _id,
        coverImage,
        description,
        dimension,
        discount,
        images,
        isBooked,
        isFeatured,
        name,
        numberOfBeds,
        offeredAmenities,
        price,
        slug,
        specialNote,
        type
    }
`;

// User Bookings Query
export const getUserBookingsQuery = groq`
    *[_type == 'Booking' && user._ref == $userId] {
        _id,
        Estate -> {
            _id,
            name,
            slug,
            price
        },
        checkinDate,
        checkoutDate,
        numberOfDays,
        adults,
        children,
        totalPrice,
        discount
    }
`;

// User Data Query
export const getUserDataQuery = groq`
    *[_type == 'user' && _id == $userId][0] {
        _id,
        name,
        email,
        isAdmin,
        about,
        _createdAt,
        image
    }
`;

// Estate Reviews Query
export const getEstateReviewsQuery = groq`
    *[_type == "review" && Estate._ref == $EstateId] {
        _createdAt,
        _id,
        text,
        user -> {
            name
        },
        userRating
    }
`;
