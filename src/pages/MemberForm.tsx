import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  Box,
} from '@mui/material';
import { memberService, Member, MemberRole, Sex, CivilState } from '../services/memberService';

// Enums
const MemberRoles = {
  MEMBER: 'Membro',
  COLLABORATOR: 'Colaborador',
  PASTOR: 'Pastor',
  PRESBYTER: 'Presbítero',
  EVANGELIST: 'Evangelista',
  DEACON: 'Diácono'
} as const;

const SexOptions = {
  MALE: 'Masculino',
  FEMALE: 'Feminino'
} as const;

const CivilStates = {
  SINGLE: 'Solteiro(a)',
  MARRIED: 'Casado(a)',
  DIVORCED: 'Divorciado(a)',
  WIDOWED: 'Viúvo(a)'
} as const;

const MemberForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Member, 'id'>>({
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
    holySpiritBaptismDate: '',
    holySpiritBaptismPlace: '',
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
    churchId: 1 // TODO: Pegar da igreja do usuário logado
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result.toString().split(',')[1];
          setFormData(prev => ({
            ...prev,
            recommendationLetter: base64
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Converter datas para o formato ISO
      const formattedData = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
        baptismDate: formData.baptismDate ? new Date(formData.baptismDate).toISOString() : undefined,
        holySpiritBaptismDate: formData.holySpiritBaptismDate ? new Date(formData.holySpiritBaptismDate).toISOString() : undefined,
        recommendationLetterDate: formData.recommendationLetterDate ? new Date(formData.recommendationLetterDate).toISOString() : undefined
      };

      await memberService.create(formattedData);
      navigate('/members/list');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar membro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cadastro de Membro
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Seção: Informações Básicas */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Informações Básicas
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                select
                label="Função"
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
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                placeholder="999.999.999-99"
              />
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
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Seção: Informações Pessoais */}
          <Typography variant="h6" gutterBottom>
            Informações Pessoais
          </Typography>

          <Grid container spacing={3}>
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
                label="Profissão"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Filiação"
                name="filiation"
                value={formData.filiation}
                onChange={handleChange}
                required
                placeholder="Nome dos pais"
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
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Seção: Endereço */}
          <Typography variant="h6" gutterBottom>
            Endereço
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CEP"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                placeholder="99999-999"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Rua, número, complemento"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Seção: Informações Religiosas */}
          <Typography variant="h6" gutterBottom>
            Informações Religiosas
          </Typography>

          <Grid container spacing={3}>
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
                type="date"
                label="Data do Batismo no Espírito Santo"
                name="holySpiritBaptismDate"
                value={formData.holySpiritBaptismDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Local do Batismo no Espírito Santo"
                name="holySpiritBaptismPlace"
                value={formData.holySpiritBaptismPlace}
                onChange={handleChange}
              />
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
                  accept: 'image/*,.pdf'
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/members/list')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default MemberForm; 