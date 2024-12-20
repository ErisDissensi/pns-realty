export type Booking = {
    _id: string;
    Estate: {
      _id: string;
      name: string;
      slug: { current: string };
      price: number;
    };
    checkinDate: string;
    checkoutDate: string;
    numberOfDays: number;
    adults: number;
    children: number;
    totalPrice: number;
    discount: number;
  };