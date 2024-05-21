import React from 'react'
import { NavigationMenuDemo } from './navigation';
import Header from './header'
import Link from 'next/link';
import Image from 'next/image';

const DashboardLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='flex-col' style={{ display: "inline-flex", width: "100%" }}>
            <div className="grid grid-cols-7 gap-4">
                <div className='col-start-1 col-end-3 hidden lg:w-60 flex-shrink-0 md:flex items-center'>
                    <Link href="/dashboards/main" legacyBehavior passHref className='flex-1' >
                        <Image src="/images/waf-logo.jpg" alt="WAF Logo" className="h-16" width={300} height={40}></Image>
                    </Link>
                </div>
                <div className='col-end-9 col-span-2'>
                    <Header />
                </div>
            </div>
            <div style={{ backgroundColor: "rgb(241,245,249)", minHeight: "100vh" }}>
                <div className="flex flex-row ">
                    <NavigationMenuDemo />
                    {children}
                </div>
            </div>
        </div >

    )
}

export default DashboardLayout