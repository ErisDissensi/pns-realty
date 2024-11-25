import { FC } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';

type Props = {
  rating: number;
};

const Rating: FC<Props> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  const fullStarElements = Array.from({ length: fullStars }, (_, index) => (
    <FaStar key={`full-${index}`} />
  ));

  return (
    <>
      {fullStarElements}
      {decimalPart > 0 && <FaStarHalf key="half-star" />}
    </>
  );
};

export default Rating;
