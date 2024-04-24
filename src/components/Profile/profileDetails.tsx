'use client'
import React, { useState, useEffect } from "react";
interface ProfileDetailsProps {
    activeLink?: string;  
  }
  
const ProfileDetails: React.FC<ProfileDetailsProps> = ({ activeLink = 'Posts' }) => {
    const [currentLink, setCurrentLink] = useState<string>(activeLink);
  
    useEffect(() => {
      if (activeLink) {
        setCurrentLink(activeLink);
      }
    }, [activeLink]);
  
    const renderDynamicContent = () => {
      switch (currentLink) {
        case 'Posts':
          return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Posts</p></div>;
        case 'About':
          return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">About</p></div>;
        case 'Friends':
          return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Friends</p></div>;
        case 'Media':
          return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Media</p></div>;
     default:
      <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Posts</p></div>;
      }
    };

return(
    <section className="flex flex-col md:flex-row">
      {/* Left dynamic div */}
      <div className="md:flex-1 border border-gray-50  -ml-4 mt-12 mdd:mt-0">
        <h2 className='text-lg mt-4 mb-4 text-gray-800 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]'>{currentLink}</h2>
        {renderDynamicContent()}
      </div>
      {/* Right static div */}
      <div className="md:flex-1 border border-gray-50 p-5 hidden mdd:block lg:block ">
        {/* create post */}
      </div>
    </section>
);
}

export default ProfileDetails;