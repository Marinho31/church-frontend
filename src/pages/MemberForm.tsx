import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Member, CreateMemberData, memberService } from '../services/memberService';
import type { MemberRole, Sex, CivilState } from '../services/memberService';

// Enums para os selects
const roles = [
  { value: 'MEMBER', label: 'Membro' },
  { value: 'COLLABORATOR', label: 'Colaborador' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'PRESBYTER', label: 'Presbítero' },
  { value: 'EVANGELIST', label: 'Evangelista' },
  { value: 'DEACON', label: 'Diácono' },
];

const sexOptions = [
  { value: 'MALE', label: 'Masculino' },
  { value: 'FEMALE', label: 'Feminino' },
];

const civilStates = [
  { value: 'SINGLE', label: 'Solteiro(a)' },
  { value: 'MARRIED', label: 'Casado(a)' },
  { value: 'DIVORCED', label: 'Divorciado(a)' },
  { value: 'WIDOWED', label: 'Viúvo(a)' },
];

const holySpiritOptions = [
  { value: 'SIM', label: 'Sim' },
  { value: 'NAO', label: 'Não' },
];

const inputStyles = "border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333]";
const selectTriggerStyles = "border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333] data-[placeholder]:text-[#333333]";

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMemberData>({
    fullName: '',
    role: 'MEMBER',
    phone: '',
    birthDate: '',
    sex: 'MALE',
    civilState: 'SINGLE',
    city: '',
    neighborhood: '',
    address: '',
    number: '',
    complement: '',
    zipCode: '',
    state: '',
    cpf: '',
    nationality: 'Brasileiro',
    profession: '',
    filiation: '',
    birthPlace: '',
    baptismDate: '',
    baptismPlace: '',
    holySpiritBaptism: 'NAO',
    holySpiritBaptismDate: '',
    holySpiritBaptismPlace: '',
    recommendationLetterDate: '',
    recommendationLetter: '',
    churchId: 1,
  });

  useEffect(() => {
    if (id) {
      loadMember(parseInt(id));
    }
  }, [id]);

  const loadMember = async (memberId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.getById(memberId);
      setFormData(response.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar membro');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (id) {
        await memberService.update(parseInt(id), formData);
      } else {
        await memberService.create(formData);
      }

      navigate('/members/list');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar membro');
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          recommendationLetter: base64String.split(',')[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/members/list')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight text-[#333333]">
          {id ? 'Editar Membro' : 'Novo Membro'}
        </h1>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium bg-[#333333] text-white p-2 rounded-md">Informações Pessoais</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Função na igreja *</Label>
              <Select
                value={formData.role}
                onValueChange={handleSelectChange('role')}
              >
                <SelectTrigger className={selectTriggerStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de nascimento *</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sexo *</Label>
              <Select
                value={formData.sex}
                onValueChange={handleSelectChange('sex')}
              >
                <SelectTrigger className={selectTriggerStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sexOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="civilState">Estado Civil *</Label>
              <Select
                value={formData.civilState}
                onValueChange={handleSelectChange('civilState')}
              >
                <SelectTrigger className={selectTriggerStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {civilStates.map(state => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidade *</Label>
              <Input
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
                placeholder="Brasileiro"
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profissão *</Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filiation">Filiação (nome dos pais) *</Label>
              <Input
                id="filiation"
                name="filiation"
                value={formData.filiation}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Local de nascimento *</Label>
              <Input
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium bg-[#333333] text-white p-2 rounded-md">Endereço</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                name="complement"
                value={formData.complement}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium bg-[#333333] text-white p-2 rounded-md">Informações Religiosas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="baptismDate">Data do Batismo</Label>
              <Input
                id="baptismDate"
                name="baptismDate"
                type="date"
                value={formData.baptismDate}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baptismPlace">Local do Batismo</Label>
              <Input
                id="baptismPlace"
                name="baptismPlace"
                value={formData.baptismPlace}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holySpiritBaptism">Batismo com Espírito Santo</Label>
              <Select
                value={formData.holySpiritBaptism}
                onValueChange={handleSelectChange('holySpiritBaptism')}
              >
                <SelectTrigger className={selectTriggerStyles}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIM">Sim</SelectItem>
                  <SelectItem value="NAO">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="holySpiritBaptismDate">Data do Batismo com Espírito Santo</Label>
              <Input
                id="holySpiritBaptismDate"
                name="holySpiritBaptismDate"
                type="date"
                value={formData.holySpiritBaptismDate}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holySpiritBaptismPlace">Local do Batismo com Espírito Santo</Label>
              <Input
                id="holySpiritBaptismPlace"
                name="holySpiritBaptismPlace"
                value={formData.holySpiritBaptismPlace}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendationLetterDate">Data da Carta de Recomendação</Label>
              <Input
                id="recommendationLetterDate"
                name="recommendationLetterDate"
                type="date"
                value={formData.recommendationLetterDate}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendationLetter">Carta de Recomendação</Label>
              <Input
                id="recommendationLetter"
                name="recommendationLetter"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/members/list')}
            className="border-[#333333] hover:bg-[#333333] hover:text-white"
          >
            Cancelar
          </Button>
          <Button type="submit" className="bg-[#333333] hover:bg-[#333333]/90 text-white" disabled={loading}>
            {loading ? 'Salvando...' : id ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm; 