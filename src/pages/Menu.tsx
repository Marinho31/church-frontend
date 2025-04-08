import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  Users,
  Calendar,
  Plus,
  List,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  onClick: () => void;
  submenu?: {
    title: string;
    icon: React.ElementType;
    path: string;
    description: string;
  }[];
}

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      title: 'Membros',
      icon: Users,
      description: 'Gerenciar membros da igreja',
      color: 'bg-roxo',
      onClick: () => navigate('/members/list'),
      submenu: [
        {
          title: 'Cadastrar Membro',
          icon: Plus,
          path: '/members/new',
          description: 'Adicionar novo membro'
        },
        {
          title: 'Listar Membros',
          icon: List,
          path: '/members/list',
          description: 'Visualizar e gerenciar membros'
        }
      ]
    },
    {
      title: 'Agenda',
      icon: Calendar,
      description: 'Gerenciar eventos e atividades',
      color: 'bg-bordo',
      onClick: () => navigate('/events'),
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">
          Bem-vindo, {user?.fullName}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={cn(
                "group relative overflow-hidden rounded-lg border p-6 hover:shadow-md transition-all",
                "hover:scale-[1.02] active:scale-[0.98]"
              )}
              onClick={item.onClick}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "rounded-full p-3",
                  item.color,
                  "text-white"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className={cn(
          "mt-8 flex items-center gap-2 rounded-lg px-4 py-2",
          "text-destructive hover:bg-destructive hover:text-destructive-foreground",
          "transition-colors"
        )}
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </div>
  );
};

export default Menu; 