"use client";
import GetStarted from "@/components/landingpage/GetStarted";
import Landingpage_nav from "@/components/landingpage/Landingpage_nav";
import AboutSection from "@/components/landingpage/AboutSection";
import FeaturesSection from "@/components/landingpage/FeaturesSection";
import HomeSection from "@/components/landingpage/HomeSection";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <section>
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
