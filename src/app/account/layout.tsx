'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User, Package, Heart, LogOut } from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const avatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

  const navItems = [
    { href: '/account', label: 'Profile', icon: User },
    { href: '/account/orders', label: 'Orders', icon: Package },
    { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                {avatar && <AvatarImage src={avatar.imageUrl} alt="User Avatar" />}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">John Doe</span>
                <span className="text-sm text-muted-foreground">john.doe@email.com</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      asChild
                    >
                        <a>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
