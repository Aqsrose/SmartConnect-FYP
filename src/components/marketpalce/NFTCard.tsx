"use client";
import Link from "next/link";
import AddressAvatar from "./AddressAvatar";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { NFT } from "../../../prisma/types";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useSigner from "@/contexts/SignerContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import SellModal from "./SellModal";
import {
  Clock,
  Divide,
  Heart,
  Loader,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useNFTMarketplace from "@/web3/useMarketplace";
import { connect } from "cookies";

type NFTCardProps = {
  nft: NFT;
};

type nftMetadata = {
  name: string;
  description: string;
  imageUrl: string;
};

const NFTCard = ({ nft }: NFTCardProps) => {
  const [nftMeta, setNftMeta] = useState<nftMetadata>();
  const [error, setError] = useState<boolean>(false);

  const { address, connectWallet } = useSigner();

  const { buyNft, listNft } = useNFTMarketplace();

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataResponse = await fetch(ipfsToHTTPS(nft.tokenURI), {});
      console.log("meta response: ", metadataResponse);
      if (metadataResponse.status != 200) return;
      let json;
      try {
        json = await metadataResponse.json();
      } catch (e) {
        setError(() => true);
      }
      setNftMeta({
        name: json.name,
        description: json.description,
        imageUrl: ipfsToHTTPS(json.image),
      });
    };
    void fetchMetadata();
  }, [nft.tokenURI]);

  console.log("nft Meta: ", nftMeta);

  const [loading, setLoading] = useState(false);
  const [listingLoading, setListingLoading] = useState(false);

  const onBuyClicked = async () => {
    setLoading(true);
    if (!address) {
      console.log("connecting wallet");
      connectWallet();
      return;
    }
    try {
      if (!owned && forSale) {
        await buyNft(nft);
      }
    } catch (error) {
      console.log("Error buying NFT: ", error);
    }
    setLoading(false);
  };

  const [imageError, setImageError] = useState(false);
  const displayImageError = () => {
    setImageError((prev) => true);
  };

  const forSale = nft.price != "0";
  const owned = nft.owner == address?.toLowerCase();

  const onListClicked = async () => {
    setListingLoading(true);

    setOpenListModal(true);

    setListingLoading(false);
  };

  return (
    <div key={nft.id} className="w-64 rounded overflow-hidden shadow-lg mb-5">
      <div className="relative">
        {imageError ? (
          <div className="w-full h-48 flex justify-center items-center">
            could not load
          </div>
        ) : nftMeta ? (
          <img
            className="w-full h-48 object-cover rounded"
            src={nftMeta?.imageUrl}
            alt="NFT Image"
            onError={displayImageError}
          />
        ) : (
          <div className="w-full h-48 flex justify-center items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        <button className="flex absolute top-2 right-2 text-red-700 bg-white rounded-full p-2 opacity-90 hover:opacity-100">
          <Heart className="w-4" />
          <p className="text-[12px] p-1">{0}</p>
        </button>
      </div>
      <div className="">
        <div className="flex justify-between items-center h-[100px] relative ">
          <p className="text-lg font-semibold absolute top-2 left-3">
            {nftMeta?.name}
          </p>
          <p className="text-purple-700  absolute top-10 left-3">
            {nft.price}
          </p>
          <div className="absolute bottom-0 left-3">
            <AddressAvatar seed={nft.owner} />
          </div>

          {nft.price > "0" && nft.owner !== address ? (
            <button
              className="text-blue-500 font-semibold opacity-80 hover:opacity-100 self-end"
              onClick={onBuyClicked}
              // disabled={loading}
            >
              {loading ? "loading..." : "Buy now"}
            </button>
          ) : nft.owner === address ? (
            <button
              className="text-blue-500 font-semibold opacity-80 hover:opacity-100 self-end"
              onClick={onListClicked}
              // disabled={loading}
            >
              {loading ? "loading..." : "List nft"}
            </button>
          ) : (
            <Badge className="w-fit self-end absolute bottom-3 right-3 hover:text-white" style={{ fontSize: "xx-small" }}>
              not listed
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;

export const ipfsToHTTPS = (url: string) => {
  if (!url.startsWith("ipfs://")) throw new Error("Not an IPFS url");
  const cid = url.substring(7);
  return `https://ipfs.io/ipfs/${cid}`;
};
