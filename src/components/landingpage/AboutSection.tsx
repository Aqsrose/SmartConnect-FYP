import React from "react";

function AboutSection() {
  return (
    <section
      id="AboutSection"
      className="h-screen bg-white flex items-center justify-center"
      style={{
        backgroundImage: "linear-gradient(to right, #D0BFFF,#CEE6F3, #FFFBF5)",
      }}
    >
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center md:text-left">
          <h1 className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent text-3xl md:text-5xl lg:text-7xl mb-4">
            About SmartConnect
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0">
              <img
                className="w-20 md:w-20 lg:w-20 mx-auto md:mx-0 "
                src="/images/about.svg"
                alt="logo"
              />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <p className="text-black text-sm md:text-lg">
                SmartConnect is a social media platform that integrates AI
                algorithms and blockchain technology. It will encompass features
                like personalized content recommendation, secure data storage,
                user-controlled privacy settings, and content filtering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
