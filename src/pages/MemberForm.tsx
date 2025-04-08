import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Box,
  Divider,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { memberService, Member, MemberRole, Sex, CivilState, CreateMemberData } from '../services/memberService';

// Enums para os selects
const MemberRoles: Record<MemberRole, string> = {
  MEMBER: 'Membro',
  COLLABORATOR: 'Colaborador',
  PASTOR: 'Pastor',
  PRESBYTER: 'Presbítero',
  EVANGELIST: 'Evangelista',
  DEACON: 'Diácono'
};

const SexOptions: Record<Sex, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino'
};

const CivilStates: Record<CivilState, string> = {
  SINGLE: 'Solteiro(a)',
  MARRIED: 'Casado(a)',
  DIVORCED: 'Divorciado(a)',
  WIDOWED: 'Viúvo(a)'
};

const HolySpiritOptions = {
  'SIM': 'Sim',
  'NAO': 'Não'
};

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMemberData>({
    fullName: '',
    role: 'MEMBER',
    phone: '',
    birthDate: '',
    sex: 'MALE',
    zipCode: '',
    city: '',
    neighborhood: '',
    address: '',
    state: '',
    holySpiritBaptismPlace: 'NAO',
    civilState: 'SINGLE',
    baptismDate: '',
    baptismPlace: '',
    recommendationLetter: '',
    recommendationLetterDate: '',
    cpf: '',
    nationality: 'Brasileiro',
    filiation: '',
    profession: '',
    birthPlace: '',
    churchId: 1
  });

  useEffect(() => {
    if (id) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.getById(Number(id));
      if (response) {
        const { id: memberId, active, ...memberData } = response;
        
        // Formatar datas para YYYY-MM-DD
        const formatDate = (date: string) => date ? date.split('T')[0] : '';
        
        setFormData({
          ...memberData,
          birthDate: formatDate(memberData.birthDate),
          baptismDate: formatDate(memberData.baptismDate),
          recommendationLetterDate: formatDate(memberData.recommendationLetterDate),
          holySpiritBaptismPlace: memberData.holySpiritBaptismPlace || 'NAO'
        });
      }
    } catch (err: any) {
      console.error('Error loading member:', err);
      setError(err.message || 'Erro ao carregar membro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = () => {
          const base64String = reader.result as string;
          // Remove o prefixo "data:*/*;base64," do resultado
          const base64 = base64String.split(',')[1];
          
          setFormData(prev => ({
            ...prev,
            recommendationLetter: base64
          }));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        setError('Erro ao processar o arquivo');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Log dos dados sendo enviados
      console.log('Form data being sent:', {
        ...formData,
        holySpiritBaptismPlace: formData.holySpiritBaptismPlace
      });

      if (id) {
        // Atualização de membro existente
        await memberService.update(Number(id), formData);
        
        // Redireciona para a lista de membros após atualização
        navigate('/members/list');
      } else {
        // Criação de novo membro
        await memberService.create(formData);
        navigate('/members/list');
      }
    } catch (err: any) {
      console.error('Error saving member:', err);
      setError(err.message || 'Erro ao salvar membro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <IconButton
            color="primary"
            onClick={() => navigate('/members/list')}
            sx={{ p: 1 }}
          >
            <ArrowBackIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom>
            {id ? 'Edição de Membro' : 'Novo Membro'}
          </Typography>
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Seção: Informações Pessoais */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informações Pessoais
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Nascimento"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Local de Nascimento"
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Sexo"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(SexOptions).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado Civil"
                  name="civilState"
                  value={formData.civilState}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(CivilStates).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nacionalidade"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Filiação"
                  name="filiation"
                  value={formData.filiation}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Profissão"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Seção: Contato e Endereço */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Contato e Endereço
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(99) 99999-9999"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bairro"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Cidade"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Estado"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* Seção: Informações Eclesiásticas */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Informações Eclesiásticas
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Cargo"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(MemberRoles).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data do Batismo"
                  name="baptismDate"
                  value={formData.baptismDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Local do Batismo"
                  name="baptismPlace"
                  value={formData.baptismPlace}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Batismo com Espírito Santo"
                  name="holySpiritBaptismPlace"
                  value={formData.holySpiritBaptismPlace}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(HolySpiritOptions).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data da Carta de Recomendação"
                  name="recommendationLetterDate"
                  value={formData.recommendationLetterDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="file"
                  label="Carta de Recomendação"
                  name="recommendationLetter"
                  onChange={handleFileChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    accept: '.pdf,.svg,.jpg,.jpeg,.png'
                  }}
                />
              </Grid>

              {/* Botões */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/members/list')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {id ? 'Atualizar' : 'Salvar'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default MemberForm; 