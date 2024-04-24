import React from 'react'
import { SignUp } from '@clerk/nextjs'


//is_wallet_set can be added in user metadata, when the user completes the sign up process through a custom flow (which I will create), that user's metadata will be updated and is_wallet_set will be added with a default value of false, and when the user wants to add the wallet address, a check will be performed, through this metadata, to see whether a wallet address is already set or not

//I can figure out how to set default metadata for each user so I have to set it on every signup 

const SignUpPage = () => {
  return (
    <section className="ml-4 mt-20 tbbb:ml-12 tbb:ml-32 md:ml-52 mdd:ml-[500px]">
      <SignUp />
    </section>
  )
}

export default SignUpPage