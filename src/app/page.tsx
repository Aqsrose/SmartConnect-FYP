"use client";
import GetStarted from "@/components/landingpage/getStarted";
import Landingpage_nav from "@/components/landingpage/landingpage_nav";
import AboutSection from "@/components/landingpage/aboutSection";
import FeaturesSection from "@/components/landingpage/featuresSection";
import HomeSection from "@/components/landingpage/homeSection";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <section
      className="w-full"
      style={{
        backgroundImage: "linear-gradient(to right, #D0BFFF,#CEE6F3, #ACFADF)",
      }}
    >
      <div className="min-w-screen min-h-screen bg-white">
        <Landingpage_nav />
        <GetStarted />
      </div>
      <div className="min-w-screen min-h-screen bg-white">
        <HomeSection />
      </div>
      <div className="min-w-screen min-h-screen bg-white">
        <FeaturesSection />
      </div>
      <div className="min-w-screen min-h-screen bg-white">
        <AboutSection />
      </div>
    </section>
  );
}
