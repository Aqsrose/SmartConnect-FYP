'use client'
import React, { useEffect, useState } from "react";
import { Eye, Lock } from "lucide-react";
import GroupDiscussion from "@/app/group_folder/groupDiscussion/page";
import GroupMembers from "@/app/group_folder/groupMembers/page";
import GroupEvents from "@/app/group_folder/groupEvents/page";
import GroupMedia from "@/app/group_folder/groupMedia/page";
import GroupRequestsPage from "@/app/groups/groupRequests/page";

interface LinkDetailsProps {
  activeLink?: string;
  groupId:string
}

const Link: React.FC<LinkDetailsProps> = ({ activeLink = 'Discussion' , groupId}) => {
  const [currentLink, setCurrentLink] = useState<string>(activeLink);
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    if (activeLink) {
      setCurrentLink(activeLink);
    }
  }, [activeLink]);

  const loadComponent = ()=>{
    switch (currentLink) {
      case 'Discussion':
        return <GroupDiscussion groupId={groupId}/>
        break;
      case 'Members':
        return <GroupMembers groupId={groupId}/>
        break;
      case 'Events':
        return <GroupEvents />
        break;
      case 'Media':
        return <GroupMedia />
        break;
        case 'Requests':
          return <GroupRequestsPage groupId={groupId}/>
          break;
      default:
        return <GroupDiscussion groupId={groupId}/>
        break;
    }
  }

  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex tb:ml-[110px] md:ml-[150px] mdd:ml-[200px] mddd:ml-[150px]">
      {/* Left dynamic div */}
      <div className="relative h-80 w-[600px] md:w-[660px] lg:w-[900] mddd:w-[600px] lgg:w-[470px] lggg:w-[550px] bg-white  rounded-md flex items-center justify-center  border border-gray-50  p-5">
        {currentLink ? loadComponent() : <GroupDiscussion groupId={groupId}/>}
        </div>
      {/* Right static div */}
      <div className=" mr-[200px] w-[400px] h-80 bg-white shadow-md rounded-md  items-center justify-center  border border-gray-50 p-5 hidden lgg:block lggg:block  lgg:w-[290px] lggg:w-[400px]">
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
        <div className='ml-9 mt-2'>
          <button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-16 py-2 rounded transition duration-200"
          >
            Learn more
          </button>
        </div>
      </div>
      </div>
      
      
    </section>
  );
}

export default Link;
