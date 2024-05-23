"use client"
import React from "react"
import Layoutpage from "@/components/Navbar/Layout"
import { Heart, Clock, MoreHorizontal } from "lucide-react"
import Createpart from "@/components/marketplacedesign/createpart"
import NftCards from "@/components/marketplacedesign/nftcard"
import useNFTMarketplace from "@/web3/useMarketplace"

function NFTpage() {
  const { allNfts } = useNFTMarketplace()
  console.log("All Nfts: ", allNfts)
  return (
    <Layoutpage>
      <section id="NFTMarketplace">
        <div className="-mt-14 bg-gray-50">
          <Createpart />
          <NftCards />
        </div>
      </section>
    </Layoutpage>
  )
}
export default NFTpage
