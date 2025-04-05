import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { memberService, Member, MemberRole } from '../services/memberService';

// Dados mockados para visualização inicial
const mockMembers: Member[] = [
  {
    id: 1,
    fullName: 'João da Silva',
    role: 'PASTOR',
    phone: '(11) 98765-4321',
    birthDate: '1980-05-15T00:00:00.000Z',
    sex: 'MALE',
    zipCode: '01234-567',
    city: 'São Paulo',
    neighborhood: 'Centro',
    address: 'Rua das Flores, 123',
    state: 'SP',
    civilState: 'MARRIED',
    cpf: '123.456.789-00',
    nationality: 'Brasileiro',
    filiation: 'José da Silva e Maria da Silva',
    profession: 'Pastor',
    birthPlace: 'São Paulo',
    churchId: 1,
    active: true
  },
  {
    id: 2,
    fullName: 'Maria Santos',
    role: 'DEACON',
    phone: '(11) 98888-7777',
    birthDate: '1990-03-20T00:00:00.000Z',
    sex: 'FEMALE',
    zipCode: '04567-890',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana',
    address: 'Av. Paulista, 1000',
    state: 'SP',
    civilState: 'SINGLE',
    cpf: '987.654.321-00',
    nationality: 'Brasileira',
    filiation: 'Pedro Santos e Ana Santos',
    profession: 'Professora',
    birthPlace: 'Rio de Janeiro',
    churchId: 1,
    active: true
  },
  {
    id: 3,
    fullName: 'José Oliveira',
    role: 'MEMBER',
    phone: '(11) 99999-6666',
    birthDate: '1995-12-10T00:00:00.000Z',
    sex: 'MALE',
    zipCode: '08765-432',
    city: 'São Paulo',
    neighborhood: 'Pinheiros',
    address: 'Rua dos Pinheiros, 500',
    state: 'SP',
    civilState: 'SINGLE',
    cpf: '456.789.123-00',
    nationality: 'Brasileiro',
    filiation: 'Carlos Oliveira e Sandra Oliveira',
    profession: 'Engenheiro',
    birthPlace: 'São Paulo',
    churchId: 1,
    active: true
  }
];

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Usando dados mockados em vez de chamar a API
      setMembers(mockMembers);
    } catch (err) {
      setError('Erro ao carregar membros. Por favor, tente novamente.');
      console.error('Erro ao carregar membros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await memberService.delete(id);
        await loadMembers(); // Recarrega a lista
      } catch (err) {
        setError('Erro ao excluir membro. Por favor, tente novamente.');
        console.error('Erro ao excluir membro:', err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const getRoleName = (role: MemberRole) => {
    const roleNames = {
      MEMBER: 'Membro',
      COLLABORATOR: 'Colaborador',
      PASTOR: 'Pastor',
      PRESBYTER: 'Presbítero',
      EVANGELIST: 'Evangelista',
      DEACON: 'Diácono'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Lista de Membros
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/members/new')}
        >
          Novo Membro
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum membro cadastrado
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.fullName}</TableCell>
                  <TableCell>{getRoleName(member.role)}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{formatDate(member.birthDate)}</TableCell>
                  <TableCell>{member.city}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => navigate(`/members/edit/${member.id}`)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        onClick={() => handleDelete(member.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MemberList; 