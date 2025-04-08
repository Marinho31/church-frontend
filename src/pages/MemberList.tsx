import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';
import { memberService, Member } from '../services/memberService';

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

  const handleIconClick = (id: number) => {
    console.log('Edit icon clicked for member:', id); // Debug log
    handleEdit(id);
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="primary"
              onClick={() => navigate('/menu')}
              sx={{ mr: 1 }}
            >
              <HomeIcon sx={{ fontSize: 32 }} />
            </IconButton>
            <Typography variant="h4" component="h1">
              Lista de Membros
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/members/new')}
          >
            Novo Membro
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>Cidade</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.fullName}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{formatPhone(member.phone)}</TableCell>
                    <TableCell>{formatDate(member.birthDate)}</TableCell>
                    <TableCell>{member.city}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleIconClick(member.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(member.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default MemberList; 