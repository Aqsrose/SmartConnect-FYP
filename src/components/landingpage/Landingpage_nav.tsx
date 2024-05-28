"use client";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { SmallLogo } from "./Logo";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

type LandingPageNavProps = {};

function smoothScroll(target: string, duration: number): void {
  const targetElement = document.getElementById(target);
  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number): void {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOut(progress));

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOut(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  requestAnimationFrame(animation);
}

const Landingpage_nav: React.FC<LandingPageNavProps> = (props) => {
  const { isSignedIn } = useUser();

  const [header, setHeader] = useState<boolean>(false);

  const scrollHeader = (): void => {
    if (window.scrollY >= 20) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  const handleSmoothScroll = (target: string): void => {
    smoothScroll(target, 800);
  };

  return (
    <header className="min-w-[26rem] tb:mr-[-100px] mr-[-100px] lg:mr-0">
      <div
        className={
          header
            ? "fixed w-[100%] h-15 backdrop-blur-lg mt-2"
            : "bg-[transparent]"
        }
      >
        <nav className="pt-5 mt-0 flex justify-between w-[100%] mx-auto rounded-xl ">
          <Link
            href="#GetStarted"
            scroll={true}
            className="hidden tb:block md:block xl:block"
          >
            <Logo />
          </Link>
          <Link
            href="#GetStarted"
            scroll={true}
            className="w-14 h-14 tb:hidden md:hidden xl:hidden tbb:hidden"
          >
            <SmallLogo />
          </Link>
          <div className="md:block">
            <ul className="text-[12px] tb:text-[14px] tbb:text-[16px] tb:space-x-2 tbb:space-x-4 mt-4 tb:mt-5 flex mr-40 sb:mr-2 md:text-lg md:space-x-6 lg:space-x-8 xl:space-x-10 md:mr-30 mdd:mr-4">
              <p className=" md:hidden xl:hidden tbb:hidden">|</p>
              <li
                onClick={() => handleSmoothScroll("HomeSection")}
                className="cursor-pointer hover:text-[#85b3b6] mr-2"
              >
                Introduction
              </li>
              <p className=" md:hidden xl:hidden tbb:hidden">|</p>
              <li
                onClick={() => handleSmoothScroll("FeaturesSection")}
                className="cursor-pointer hover:text-[#85b3b6] mr-1"
              >
                What's new?
              </li>
              <p className=" md:hidden xl:hidden tbb:hidden">|</p>
              <li
                onClick={() => handleSmoothScroll("AboutSection")}
                className="cursor-pointer hover:text-[#85b3b6] mr-1"
              >
                About us
              </li>
              <p className=" md:hidden xl:hidden tbb:hidden">|</p>
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="cursor-pointer hover:text-[#85b3b6] rounded-xl hover:scale-110 duration-300 mr-2 tb:mr-2"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/explore"
                  className="cursor-pointer hover:text-[#85b3b6] rounded-xl hover:scale-110 duration-300 mr-2 tb:mr-2"
                >
                  Explore
                </Link>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Landingpage_nav;
