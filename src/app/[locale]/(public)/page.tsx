import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import PropertiesSection from "@/components/home/PropertiesSection";
import AmenitiesSection from "@/components/home/AmenitiesSection";
import LocationSection from "@/components/home/LocationSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BookingCTASection from "@/components/home/BookingCTASection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <PropertiesSection />
      <AmenitiesSection />
      <LocationSection />
      <TestimonialsSection />
      <BookingCTASection />
    </main>
  );
}
