import React from "react";
import { Heart, Clock, MoreHorizontal } from "lucide-react";

const dummyNfts = [
  {
    id: 1,
    image: "images/statue.jpeg",
    title: "Amazing Digital Art",
    price: "0.047 ETH",
    creator: "@John Doe",
    timeAgo: "10 mins ago",
    likes: 88,
  },
  {
    id: 2,
    image: "images/game.jpeg",
    title: "Amazing Digital Art",
    price: "0.047 ETH",
    creator: "@Jane Smith",
    timeAgo: "20 mins ago",
    likes: 100,
  },
  {
    id: 3,
    image: "images/Poster.jpeg",
    title: "Amazing Digital Art",
    price: "0.047 ETH",
    creator: "@Jane Smith",
    timeAgo: "20 mins ago",
    likes: 100,
  },
  
];

function NftCards() {
  return (
    <div className="container mx-auto px-2 tb:ml-24 tb:mr-60">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mdd: gap-0 justify-items-center ">
        {dummyNfts.map((nft) => (
          <div key={nft.id} className="w-64 rounded overflow-hidden shadow-lg">
            <div className="relative">
              <img className="w-full h-48 object-cover rounded" src={nft.image} alt="NFT Image" />
              <button className="flex absolute top-2 right-2 text-red-700 bg-white rounded-full p-2 opacity-90 hover:opacity-100">
                <Heart className="w-4" />
                <p className="text-[12px] p-1">{nft.likes}</p>
              </button>
              <span className="flex absolute top-2 left-2 text-green-900 text-xs bg-white rounded-full px-2 py-1 opacity-100">
                <Clock className="w-3" />
                <p className="p-1">{nft.timeAgo}</p>
              </span>
              <button className="flex absolute bottom-2 right-2 text-red-700 bg-white rounded-full p-2 opacity-60 hover:opacity-100">
                <MoreHorizontal />
              </button>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{nft.title}</p>
                  <p className="text-purple-700">{nft.price}</p>
                  <p className="text-gray-400 text-sm">{nft.creator}</p>
                </div>
                <button className="text-blue-500 font-semibold opacity-80 hover:opacity-100">
                  Buy now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NftCards;