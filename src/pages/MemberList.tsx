import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Home } from 'lucide-react';
import { memberService, Member } from '../services/memberService';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      console.log('Loading members...'); // Debug log
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login...'); // Debug log
        navigate('/login', { replace: true });
        return;
      }

      setLoading(true);
      setError(null);
      
      const response = await memberService.getAll();
      console.log('Members loaded:', response); // Debug log
      
      // Filtra apenas os membros ativos
      if (response && response.data) {
        const activeMembers = response.data.filter((member: Member) => member.active);
        setMembers(activeMembers);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      console.error('Error loading members:', err);
      setError(err.message || 'Erro ao carregar membros');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      console.log('handleEdit called with id:', id);
      
      // Primeiro faz a requisição GET para /members/:id
      console.log('Making GET request to /members/' + id);
      const response = await memberService.getById(id);
      
      if (response) {
        console.log('Member data received:', response);
        // Navega para a tela de edição com o ID correto
        navigate(`/members/edit/${id}`);
      }
    } catch (err: any) {
      console.error('Error fetching member:', err);
      setError(err.message || 'Erro ao carregar dados do membro');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        setLoading(true);
        setError(null);
        await memberService.delete(id);
        loadMembers(); // Recarrega a lista após deletar
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir membro');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: 'fullName',
      header: 'Nome',
    },
    {
      accessorKey: 'role',
      header: 'Cargo',
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ row }) => formatPhone(row.getValue('phone')),
    },
    {
      accessorKey: 'birthDate',
      header: 'Data de Nascimento',
      cell: ({ row }) => formatDate(row.getValue('birthDate')),
    },
    {
      accessorKey: 'city',
      header: 'Cidade',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(member.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(member.id)}
              className="text-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-[#333333]">Lista de Membros</h2>
        <Button onClick={() => navigate('/members/new')} className="bg-[#333333] hover:bg-[#333333]/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Novo Membro
        </Button>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={members}
        />
      </div>
    </div>
  );
};

export default MemberList; 