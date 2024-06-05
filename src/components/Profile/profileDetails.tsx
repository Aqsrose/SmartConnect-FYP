"use client";
import React, { useEffect, useState } from "react";
import {
  Map,
  GraduationCap,
  Pencil,
  Heart,
  Lock,
  LucideUnlock,
} from "lucide-react";
import ProfilePostsPage from "@/app/Profile_folder/profile_posts/page";
import ProfileNFTsPage from "@/app/Profile_folder/profile_NFTs/page";
import ProfileMediaPage from "@/app/Profile_folder/profile_media/page";
import ProfileFriendsPage from "@/app/Profile_folder/profile_friends/page";
import ProfileAboutPage from "@/app/Profile_folder/profile_about/page";
import SavedPostPage from "@/app/Profile_folder/saved_posts/page";
import EditBioModal from "@/components/Profile/editBioModal";
import Modal from "../Modal";
import { User } from "../../../prisma/types";
import { trpc } from "@/server/trpc/client";

interface LinkDetailsProps {
  activeLink?: string;
  userId: string;
  userFromBackend: { user: User } | undefined;
  isLoading: boolean;
  errorLoadingUser: boolean;
}

const ProfileDetails: React.FC<LinkDetailsProps> = ({
  activeLink = "Posts",
  userId,
  userFromBackend,
  isLoading,
  errorLoadingUser,
}) => {
  console.log("userFromBackend inside profileDetails: ", userFromBackend);

  const [currentLink, setCurrentLink] = useState<string>(activeLink);
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [showEditBioModal, setShowEditBioModal] = useState(false);

  const handleOpenEditBioModal = () => {
    setShowEditBioModal(true);
  };

  const handleCloseEditBioModal = () => {
    setShowEditBioModal(false);
  };

  useEffect(() => {
    if (activeLink) {
      setCurrentLink(activeLink);
    }
  }, [activeLink]);

  const loadComponent = () => {
    switch (currentLink) {
      case "Posts":
        return <ProfilePostsPage userId={userId} />;
        break;
      case "NFTs":
        return <ProfileNFTsPage />;
        break;
      case "Media":
        return <ProfileMediaPage userId={userId} />;
        break;
      case "Friends":
        return <ProfileFriendsPage userId={userId} />;
        break;
      case "Saved":
        return <SavedPostPage userId={userId} />;
        break;
      case "About":
        return <ProfileAboutPage />;
        break;
      default:
        return <ProfilePostsPage userId={userId} />;
        break;
    }
  };

  return (
    <section className="flex flex-col md:flex-row">
      <div className="flex tb:ml-[130px] md:ml-[150px] ">
        {/* Left dynamic div */}
        <div className="relative h-80 w-[600px] md:w-[660px] mdd:w-[490px] lg:w-[490px] mddd:w-[600px] lgg:w-[470px] lggg:w-[550px] bg-white  rounded-md flex items-center justify-center  border border-gray-50  p-5">
          {currentLink ? loadComponent() : <ProfilePostsPage userId={userId} />}
        </div>
        {/* Right static div */}
        {userFromBackend && (
          <div className=" mr-[200px] w-[400px] h-80 bg-white shadow-md rounded-md  items-center justify-center  border border-gray-50 p-5 hidden lg:block mddd:hidden mdd:block lgg:block lggg:block mdd:w-[280px] lg:w-[290px] lgg:w-[290px] lggg:w-[400px]">
            <h2 className="text-lg mt-4 mb-4 text-purple-500">About</h2>
            <div className="flex space-x-3 mb-2">
              <GraduationCap className="text-green-500 w-6 " />
              <h4 className="text-sm ml-1">
                {userFromBackend.user.info.university ?? "Add university"}
              </h4>
            </div>
            <div className="flex space-x-3 mb-2">
              <Map className="text-green-500 " />
              <h4 className="text-sm">
                {userFromBackend.user.info.from ?? "Add where you live"}
              </h4>
            </div>

            <div className="flex space-x-3 mb-2">
              <Heart className="text-green-500 " />
              <h4 className="text-sm">
                {userFromBackend.user.info.relationshipStatus ??
                  "Add relationship status"}
              </h4>
            </div>
            <div className="flex space-x-3 mb-2">
              {userFromBackend.user.info.isPublic ? (
                <LucideUnlock className="text-green-500 " />
              ) : (
                <Lock className="text-green-500 " />
              )}
              <h4 className="text-sm ">
                {userFromBackend.user.info.isPublic ? "Public" : "Private"}
              </h4>
            </div>

            <div className="ml-9 mt-8">
              <button
                onClick={handleOpenEditBioModal}
                className="bg-gradient-to-r flex from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-14 lggg:px-24 py-2 rounded transition duration-200"
              >
                Edit Bio <Pencil className="w-5 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={showEditBioModal} close={handleCloseEditBioModal}>
        <EditBioModal close={handleCloseEditBioModal} />
      </Modal>
    </section>
  );
};

export default ProfileDetails;
