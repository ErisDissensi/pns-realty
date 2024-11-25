import FeaturedEstate from '@/components/FeaturedEstate/FeaturedEstate';
import Gallery from '@/components/Gallery/Gallery';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import PageSearch from '@/components/PageSearch/PageSearch';
import { getFeaturedEstate } from '@/libs/apis';

const Home = async () => {
  
  const featuredEstate = await getFeaturedEstate();

  return (
    <>
      <HeroSection />
      <PageSearch />
      <FeaturedEstate featuredEstate={featuredEstate} />
      <Gallery />
      <NewsLetter/>
    </>
  );
};

export default Home;