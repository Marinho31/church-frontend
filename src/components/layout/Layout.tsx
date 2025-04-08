import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Home', href: '/menu' },
  { icon: Users, label: 'Membros', href: '/members/list' },
  { icon: Calendar, label: 'Agenda', href: '/events' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export function Layout() {
  const location = useLocation();
  const currentPage = sidebarItems.find(item => location.pathname.startsWith(item.href))?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6 bg-bordo">
          <span className="text-lg font-bold text-white tracking-wider uppercase font-serif">MARANATA</span>
        </div>
        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-bordo text-white"
                    : "text-[#333333] hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "" : "text-[#333333]")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="pl-64 flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-bordo">
          <div className="container flex h-full items-center">
            <h1 className="text-xl font-semibold text-white">{currentPage}</h1>
          </div>
        </div>
        <div className="container py-6 flex-1">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-bordo">
        <div className="w-64 h-full flex items-center px-6">
          <span className="text-xs text-white/80 italic font-serif">Hora vem Senhor Jesus</span>
        </div>
      </div>
    </div>
  );
} 