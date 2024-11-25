'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';

import { Booking } from '@/models/Booking';

type Props = {
  BookingDetails: Booking[];
  setEstateId: Dispatch<SetStateAction<string | null>>;
  toggleRatingModal: () => void;
};

const Table: FC<Props> = ({ BookingDetails, setEstateId, toggleRatingModal }) => {
  const router = useRouter();

  return (
    <div className='overflow-x-auto max-w-[340px] rounded-lg mx-auto md:max-w-full shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
          <tr>
            <th className='px-6 py-3'>Estate name</th>
            <th className='px-6 py-3'>Unit Price</th>
            <th className='px-6 py-3'>Price</th>
            <th className='px-6 py-3'>Discount</th>
            <th className='px-6 py-3'>No. Days Booked</th>
            <th className='px-6 py-3'>Days Left</th>
            <th className='px-6 py-3'></th>
          </tr>
        </thead>
        <tbody>
          {BookingDetails.map(Booking => (
            <tr
              key={Booking._id}
              className='bg-white border-b hover:bg-gray-50'
            >
              <th
                onClick={() =>
                  router.push(`/Estates/${Booking.Estate.slug.current}`)
                }
                className='px-6 underline text-blue-600 cursor-pointer py-4 font-medium whitespace-nowrap'
              >
                {Booking.Estate.name}
              </th>
              <td className='px-6 py-4'>{Booking.Estate.price}</td>
              <td className='px-6 py-4'>{Booking.totalPrice}</td>
              <td className='px-6 py-4'>{Booking.discount}</td>
              <td className='px-6 py-4'>{Booking.numberOfDays}</td>
              <td className='px-6 py-4'>0</td>
              <td className='px-6 py-4'>
                <button
                  onClick={() => {
                    setEstateId(Booking.Estate._id);
                    toggleRatingModal()
                  }}
                  className='font-medium text-blue-600 hover:underline'
                >
                  Rate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
