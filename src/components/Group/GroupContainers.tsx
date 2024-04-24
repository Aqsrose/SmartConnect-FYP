'use client'
import React, { useState, useEffect } from "react";
import { Eye, Lock } from "lucide-react";
interface LinkDetailsProps {
  activeLink?: string;  
}

const LinkDetails: React.FC<LinkDetailsProps> = ({ activeLink = 'Discussion' }) => {
  const [currentLink, setCurrentLink] = useState<string>(activeLink);

  useEffect(() => {
    if (activeLink) {
      setCurrentLink(activeLink);
    }
  }, [activeLink]);

  const renderDynamicContent = () => {
    switch (currentLink) {
      case 'Discussion':
        return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Discussions within the group.</p></div>;
      case 'Members':
        return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">List of all members.</p></div>;
      case 'Events':
        return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Upcoming group events.</p></div>;
      case 'Media':
        return <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Gallery of images and videos.</p></div>;
   default:
    <div className="h-60 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]"><p className="text-gray-400">Discussions within the group.</p></div>;
    }
  };

  return (
    <section className="flex flex-col md:flex-row">
      {/* Left dynamic div */}
      <div className="md:flex-1 border border-gray-50  -ml-4 mt-12 mdd:mt-0">
        <h2 className='text-lg mt-4 mb-4 text-gray-800 ml-7 sb:ml-10 sbb:ml-16 tb:ml-40 md:ml-[270px]'>{currentLink}</h2>
        {renderDynamicContent()}
      </div>
      {/* Right static div */}
      <div className="md:flex-1 border border-gray-50 p-5 hidden mdd:block lg:block ">
        <h2 className='text-lg mt-4 mb-4 text-gray-800'>About</h2>
        <div className='flex space-x-3 mb-2'>
          <Lock className='text-green-500 mt-1'/>
          <h3 className='text-lg'>Private</h3>
        </div>
        <div className='ml-9 mb-2'>
          <p className='text-gray-400'>Only members can see who's in the group and what they post.</p>
        </div>
        <div className='flex space-x-3 mb-2'>
          <Eye className='text-blue-500 mt-1'/>
          <h3 className='text-lg'>Visible</h3>
        </div>
        <div className='ml-9 mb-2'>
          <p className='text-gray-400'>Anyone can find this page.</p>
        </div>
        <div className='ml-9 mt-8'>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-44 py-2 rounded transition duration-200"
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}

export default LinkDetails;
