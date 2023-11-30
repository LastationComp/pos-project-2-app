'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function ClientAdd() {
  const [clientName, setClientName] = useState('')
  const [serviceDays, setServiceDays] = useState(30)
  const router = useRouter()
  const handleSubmit = async(e: any) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      }, 
      body: JSON.stringify({
        client_name: formData.get('client_name'),
        service_days: formData.get('service_days')
      })
    })
    const result = await res.json()
    console.log(result)
    if (res.ok && res.status == 200) {
      return router.push('/superadmin/dashboard')
    }
  }
  return (
    <section className="flex justify-center">
      <div className="rounded shadow-md p-3">
        <h1 className="text-lg">Add Client</h1>
        <form action="" method="post" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="client_name">Client Name</label>
          <input type="text" required id="client_name" name='client_name' value={clientName} onChange={(e) => setClientName(e.target.value)} className="outline outline-1 outline-gray-800 py-1 px-3 focus:outline-1 focus:outline-blue-600 transition rounded" placeholder="Input your Client Name" />
          <label htmlFor="service_days">Service Days</label>
          <input type="number" required id="service_days" name='service_days' value={serviceDays} onChange={(e) => setServiceDays(Number(e.target.value))} className="outline outline-1 outline-gray-800 py-1 px-3 focus:outline-1 focus:outline-blue-600 transition rounded" placeholder="Input your Client Name" />
          <button type='submit' className='bg-green-600 my-3 p-2 text-white rounded hover:bg-green-700 transition'>Add</button>
        </div>
        </form>
      </div>
    </section>
  );
}
