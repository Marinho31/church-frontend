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
import { memberService } from '../services/memberService';
import { Member } from '../types/member';

const MemberList = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memberService.getAll();
      setMembers(data);
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

  const handleDelete = async (id: string) => {
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
          onClick={() => navigate('/dashboard/members/new')}
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
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{formatDate(member.birthDate)}</TableCell>
                  <TableCell>{member.city}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => navigate(`/dashboard/members/edit/${member.id}`)}
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