import { ThemeProvider } from '../../contexts/ThemeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

const StoreFront = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </div>
  );
};

export const Store = () => {
  return (
    <ThemeProvider>
      <StoreFront />
    </ThemeProvider>
  );
};