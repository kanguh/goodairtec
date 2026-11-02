import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Pricing from "@/components/Pricing";
import Booking from "@/components/Booking";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import { isDemo } from "@/lib/store";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Pricing />
        <Booking demo={isDemo} />
        <Process />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
