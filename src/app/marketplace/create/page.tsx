"use client"
import getIpfsURI from "@/app/actions/getIpfsURI"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useSigner from "@/contexts/SignerContext"
import useNFTMarketplace from "@/web3/useMarketplace"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from 'react';
import { FieldValues, useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import Modal from "@/components/Modal"

const nftSchema = z.object({
  name: z.string(),
  description: z.string(),
  nft: z.unknown().refine((val) => {
    console.log(typeof val)
    if (!(val instanceof FileList)) {
      if ((val as FileList).length > 1) return false
    }
    return true
  }),
})

type NftSchemaType = z.infer<typeof nftSchema>

const CreateNFT = () => {
  const { createNft } = useNFTMarketplace()
  const { connectWallet, address, loading } = useSigner()
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NftSchemaType>({
    resolver: zodResolver(nftSchema),
  })

  const postNft: SubmitHandler<NftSchemaType> = (data) => {
    const nft = (data.nft as any)[0] as File
    createNft(data.name, data.description, nft)
  }

  return (
    <div>
       <Button onClick={() => setShowModal(true)}>Create NFT</Button>
      <Modal isOpen={showModal} close={() => setShowModal(false)}>
      <Button onClick={connectWallet} className="ml-60 mt-6">
        {loading ? "Connecting..." : !address ? "Connect Wallet" : "Connected"}
      </Button>
      <form onSubmit={handleSubmit(postNft)} className="m-5">
        <Input type="text" placeholder="name" {...register("name")} />
        <Textarea placeholder="description" {...register("description")} className="mt-2"/>
        <Input
        className="mt-2"
          type="file"
          accept="image/*"
          multiple={false}
          {...register("nft")}
        />
        <Button type="submit" className="mt-4 bg-gradient-to-r  bg-[#349E8D] hover:from-[#2EC7AB] hover:to-[#349E8D] px-4 py-2  text-white rounded transition duration-200 mr-2">Post NFT</Button>
      </form>
      </Modal>
    </div>
  )
}

export default CreateNFT
