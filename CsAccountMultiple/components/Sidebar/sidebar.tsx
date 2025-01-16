"use client";
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';


const Sidebar = () => {
  const currentPath = usePathname();
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost"><Menu/></Button>
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle className='flex gap-2 justify-start items-center'><Image src="/logo/logo.png" width={24} height={24} alt='logo' />ComSec360</SheetTitle>
        <SheetDescription>
          A Company Secretarial Management
        </SheetDescription>
      </SheetHeader>
      <div className=" mt-10 flex flex-col gap-6">
        <div className='flex gap-4 flex-col'>
        <h1 className='font-semibold text-slate-500'>Account Dashboard</h1>
        <Link href="/" className={cn("ml-2 py-4 px-3 rounded-md hover:bg-secondary",{
          "bg-muted" : currentPath === "/"
        })}>Profile</Link>
        <Link href="/projects" className={cn("ml-2 py-4 px-3 rounded-md hover:bg-secondary",{
          "bg-muted" : currentPath === "/projects"
        })}>Projects</Link>
        <Link href="/companies" className={cn("ml-2 py-4 px-3 rounded-md hover:bg-secondary",{
          "bg-muted" : currentPath === "/companies"
        })}>Companies</Link>
        </div>
        <div className='flex gap-4 flex-col'>
        <h1 className='text-slate-500 font-semibold'>Preferences</h1>
        <Link href="/preferences" className={cn("ml-2 py-4 px-3 rounded-md hover:bg-secondary",{
          "bg-muted" : currentPath === "/preferences"
        })}>Language</Link>
        </div>
      </div>
    </SheetContent>
  </Sheet>
  )
}

export default Sidebar