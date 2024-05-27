"use client"

import NFTCard from "@/components/marketpalce/NFTCard"
import useSigner from "@/contexts/SignerContext"
import useNFTMarketplace from "@/web3/useMarketplace"
import { useEffect } from "react"

function ProfileNFTsPage() {
  const { connectWallet } = useSigner()

  const { ownedNfts } = useNFTMarketplace()
  console.log("owned: ", ownedNfts)

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <div className="container mx-auto px-2 tb:ml-24 mt-[95rem] tb:mr-60 pr-24 pl-8">
        {ownedNfts &&
          ownedNfts.map((nft) => {
            return <NFTCard nft={nft} key={nft.id}/>
          })}
    </div>
  )
}
export default ProfileNFTsPage
