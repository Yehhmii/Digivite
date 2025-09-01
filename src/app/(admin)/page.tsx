"use client";

import React from 'react'
import Link  from 'next/link'
import { FaUserCheck } from 'react-icons/fa'

export default function page() {
  return (
    <div className='w-full h-dvw flex justify-center items-center'>
        {`"Are You Lost -- no one is meant to be here" just go to the login man --`}
        <Link href='/admin/login'><FaUserCheck /> Yup-Here</Link>
    </div>
  )
}
