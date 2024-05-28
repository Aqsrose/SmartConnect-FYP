"use client"
import React from "react"
import useNFTMarketplace from "@/web3/useMarketplace"
import NFTCard from "@/components/marketpalce/NFTCard"

function NftCards() {
  const { allNfts } = useNFTMarketplace()

  console.log("Owned nfts: ", allNfts)

  return (
    <div className="container ml-10 tb:ml-24 tbb:ml-20 lg:ml-32  lg:w-[900px] mddd:ml-40 mddd:w-[670px] lgg:w-[850px] lggg:w-[1050px] px-2  tb:mr-60 pr-24 pl-8">
      <div className="grid grid-cols-1 tbb:grid-cols-2 lggg:grid-cols-3 justify-items-center ">
        {allNfts?.map((nft) => (
          <NFTCard nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default NftCards
