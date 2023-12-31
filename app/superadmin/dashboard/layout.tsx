
import React, { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';

import authOptions from '@/app/api/auth/authOptions';
import ButtonLogout from '@/app/_components/ButtonLogout';
import NavbarMenu from '@/app/_components/NavbarMenuSuperAdmin';
import Provider from '@/app/_components/Provider';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <nav className="w-screen bg-posgray flex justify-between p-3 text-white">
        <ul className="flex items-center gap-5">
          <li>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </li>
          <li>
            <h1>Welcome Back! {session?.user?.name}</h1>
          </li>
        </ul>
        <ul className="items-center">
          <li>
            <ButtonLogout />
          </li>
        </ul>
      </nav>
      <NavbarMenu session={session} />

      <div className="container mx-auto p-5">
        <Provider session={session}>{children}</Provider>
      </div>
    </>
  );
}
