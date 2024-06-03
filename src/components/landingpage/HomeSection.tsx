import React from "react";

function HomeSection() {
  return (
    <section
      id="HomeSection"
      className="h-screen bg-white flex items-center justify-center "
      style={{
        backgroundImage: "linear-gradient(to right, #FFFBF5, #ACE2E1, #F3CCF3)",
      }}
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/2 flex justify-center ">
          <img
            className="w-40 md:w-80 px-4 pt-3 pb-2  hidden md:block"
            src="/images/nft4.png"
            alt="logo"
          />
        </div>
        <div className="md:w-2/2 text-center md:text-left">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-5xl lg:text-7xl mb-2">
            How to use our platform
          </h1>
          <p className="text-purple-400 text-xl mb-4">
            Just three steps and you're ready to go!
          </p>
          <div className="flex flex-col  md:items-start">
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/create.png"
                alt="create account"
              />
              <h4 className="text-black text-lg ml-4">
                Create Account and Connect wallet
              </h4>
            </div>
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/explore.png"
                alt="explore"
              />
              <h4 className="text-black text-lg ml-4">
                Explore and connect with others
              </h4>
            </div>
            <div className="flex items-center mb-4">
              <img
                className="h-15 w-20 md:w-20 px-4 pt-3 pb-2"
                src="/images/upload2.png"
                alt="upload"
              />
              <h4 className="text-black text-lg ml-4">Upload Post and NFTs</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeSection;
