'use client'
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Eye, Lock } from "lucide-react";

interface LinkDetailsProps {
  activeLink?: string;
}

const LinkDetails: React.FC<LinkDetailsProps> = ({ activeLink = 'Discussion' }) => {
  const [currentLink, setCurrentLink] = useState<string>(activeLink);
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    if (activeLink) {
      setCurrentLink(activeLink);
    }
  }, [activeLink]);

  useEffect(() => {
    const loadComponent = async () => {
      switch (currentLink) {
        case 'Discussion':
          const { default: GroupDiscussion } = await import('@/app/GroupDiscussion/page');
          setComponent(() => GroupDiscussion);
          break;
        case 'Members':
          const { default: GroupMembers } = await import('@/app/GroupMembers/page');
          setComponent(() => GroupMembers);
          break;
        case 'Events':
          const { default: GroupEvents } = await import('@/app/GroupEvents/page');
          setComponent(() => GroupEvents);
          break;
        case 'Media':
          const { default: GroupMedia } = await import('@/app/GroupMedia/page');
          setComponent(() => GroupMedia);
          break;
        case 'Chats':
          const { default: GroupChats } = await import('@/app/GroupChats/page');
          setComponent(() => GroupChats);
          break;
        default:
          const { default: DefaultComponent } = await import('@/app/GroupDiscussion/page');
          setComponent(() => DefaultComponent);
          break;
      }
    };
    loadComponent();
  }, [currentLink]);
  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex tb:ml-[130px] md:ml-[150px] ">
      {/* Left dynamic div */}
      <div className="relative h-80 w-[600px] md:w-[660px] mddd:w-[600px] lgg:w-[740px] lggg:w-[550px] bg-white  rounded-md flex items-center justify-center  border border-gray-50  p-5">
        {Component && <Component />}
        </div>
      {/* Right static div */}
      <div className=" mr-[200px] w-[400px] h-80 bg-white shadow-md rounded-md  items-center justify-center  border border-gray-50 p-5 hidden lggg:block">
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-24 py-2 rounded transition duration-200"
          >
            Learn more
          </button>
        </div>
      </div>
      </div>
      
      
    </section>
  );
}

export default LinkDetails;
