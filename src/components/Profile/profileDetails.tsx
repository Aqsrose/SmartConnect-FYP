'use client'
import React, { useEffect, useState } from "react";
import { Map, GraduationCap,Pencil, Heart,Lock } from "lucide-react";
import ProfilePostsPage from '@/app/Profile_folder/profile_posts/page'
import ProfileNFTsPage from "@/app/Profile_folder/profile_NFTs/page";
import ProfileMediaPage from "@/app/Profile_folder/profile_media/page";
import ProfileFriendsPage from "@/app/Profile_folder/profile_friends/page";


interface LinkDetailsProps {
  activeLink?: string;
  
}

const ProfileDetails: React.FC<LinkDetailsProps> = ({ activeLink = 'Posts'}) => {
  const [currentLink, setCurrentLink] = useState<string>(activeLink);
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    if (activeLink) {
      setCurrentLink(activeLink);
    }
  }, [activeLink]);

  const loadComponent = ()=>{
    switch (currentLink) {
      case 'Posts':
        return <ProfilePostsPage/>
        break;
      case 'NFTs':
        return <ProfileNFTsPage/>
        break;
      case 'Media':
        return <ProfileMediaPage/>
        break;
      case 'Friends':
        return <ProfileFriendsPage/>
        break;
      default:
        return <ProfilePostsPage/>
        break;
    }
  }

  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex tb:ml-[130px] md:ml-[150px] ">
      {/* Left dynamic div */}
      <div className="relative h-80 w-[600px] md:w-[660px] mdd:w-[490px] lg:w-[490px] mddd:w-[600px] lgg:w-[470px] lggg:w-[550px] bg-white  rounded-md flex items-center justify-center  border border-gray-50  p-5">
        {currentLink ? loadComponent() : <ProfilePostsPage/>}
        </div>
      {/* Right static div */}
      <div className=" mr-[200px] w-[400px] h-80 bg-white shadow-md rounded-md  items-center justify-center  border border-gray-50 p-5 hidden lg:block mddd:hidden mdd:block lgg:block lggg:block mdd:w-[280px] lg:w-[290px] lgg:w-[290px] lggg:w-[400px]">
        <h2 className='text-lg mt-4 mb-4 text-purple-500'>About</h2>
        <div className='flex space-x-3 mb-2'>
          <GraduationCap className='text-green-500 w-6 '/>
          <h4 className='text-sm ml-1'> PMAS, RAWALPINDI</h4>
        </div>
        <div className='flex space-x-3 mb-2'>
          <Map className='text-green-500 '/>
          <h4 className='text-sm'>From Rawalpindi, Pakistan</h4>
        </div>
        
        <div className='flex space-x-3 mb-2'>
          <Heart className='text-green-500 '/>
          <h4 className='text-sm'>Single</h4>
        </div>
        <div className='flex space-x-3 mb-2'>
          <Lock className='text-green-500 '/>
          <h4 className='text-sm'>Public</h4>
        </div>
        
        <div className='ml-9 mt-8'>
          <button
            className="bg-gradient-to-r flex from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-14 lggg:px-24 py-2 rounded transition duration-200"
          >
            Edit Bio <Pencil className="w-5 ml-1"/>
          </button>
        </div>
      </div>
      </div>
      
      
    </section>
  );
}

export default ProfileDetails;
