"use client"
import React from "react"
import useNFTMarketplace from "@/web3/useMarketplace"
import NFTCard from "@/components/marketpalce/NFTCard"

function NftCards() {
  const { allNfts } = useNFTMarketplace()

  console.log("Owned nfts: ", allNfts)

  return (
    <div className="container mx-auto px-2 tb:ml-24 tb:mr-60 pr-24 pl-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mdd: gap-[2.25rem] justify-items-center ">
        {allNfts?.map((nft) => (
          <NFTCard nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default NftCards
