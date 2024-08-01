"use client"

import Link from 'next/link'
import React from 'react'
import { useUser, UserButton } from '@clerk/nextjs'

const Header = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return null; // or a loading spinner
    }

    return (
        <nav className='bg-blue-700 py-4 px-6 flex items-center justify-between mb-4'>
            <div className='flex items-center'>
                <Link href='/'>
                    <div className='text-lg font-bold uppercase text-white'>
                        Weather App
                    </div>
                </Link>
            </div>
            <div className='text-white flex items-center'>
                {!user && (
                    <>
                        <Link href='sign-in' className='text-gray-300 hover:text-white mr-4 p-2'>SignIn</Link>
                        <Link href='sign-up' className='text-gray-300 hover:text-white mr-4 p-2'>SignUp</Link>
                    </>
                )}
                <div className='ml-auto'>
                    <UserButton redirectUrl="/"/>
                </div>
            </div>
        </nav>
    )
}

export default Header