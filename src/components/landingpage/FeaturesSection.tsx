import React from "react";

function FeaturesSection() {
  return (
    <section
      id="FeaturesSection"
      className="h-screen bg-white flex items-center justify-center "
      style={{
        backgroundImage: "linear-gradient(to left, #FFFBF5, #ACE2E1, #F3CCF3)",
      }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/2 flex justify-center ">
          <img
            className="w-40 md:w-80 px-4 pt-3 pb-2  hidden md:block"
            src="/images/features4.png"
            alt="logo"
          />
        </div>
        <div className="md:w-2/2 text-center md:text-left">
          <h1 className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent  text-5xl lg:text-7xl mb-2">
            Discover Our Unique Features
          </h1>
          <p className="text-orange-400 text-xl mb-4">
            Our features are designed to provide you with the best possible
            decentralizes experience
          </p>
          <div className="flex flex-col  md:items-start">
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/privacy.png"
                alt="create account"
              />
              <h4 className="text-black text-lg ml-4">
                Data privacy and Ownership
              </h4>
            </div>
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/marketplace.png"
                alt="explore"
              />
              <h4 className="text-black text-lg ml-4">NFT Maketplace</h4>
            </div>
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/censorship.png"
                alt="censorship"
              />
              <h4 className="text-black text-lg ml-4">Censorship Resistance</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
