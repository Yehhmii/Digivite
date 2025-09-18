import React from 'react'
import Link from 'next/link'
// import { RiUserAddLine } from "react-icons/ri";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/guests">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">👤</div>
            <h2 className="text-xl font-semibold">Create Guest</h2>
            <p className="text-gray-600 mt-2">Add new guests to your event</p>
          </div>
        </Link>

        <Link href="/admin/scanner">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">🔍</div>
            <h2 className="text-xl font-semibold">Verify</h2>
            <p className="text-gray-600 mt-2">Scan guest QR codes</p>
          </div>
        </Link>

        <Link href="/admin/checkedIn">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-semibold">Checked-in</h2>
            <p className="text-gray-600 mt-2">View checked-in guests</p>
          </div>
        </Link>

        <Link href="/admin/status">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-4xl mb-3">🎁</div>
            <h2 className="text-xl font-semibold">Guest Status</h2>
            <p className="text-gray-600 mt-2">View guest status</p>
          </div>
        </Link>
      </div>
    </div>
  )
}