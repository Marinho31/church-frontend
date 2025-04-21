import React, { useState, useEffect } from 'react';
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
import { memberService } from '../services/memberService';
import type { CreateMemberData, HolySpiritBaptism, DeactivationFlag } from '../services/memberService';

// Enums para os selects
const roles = [
  { value: 'MEMBER', label: 'Membro' },
  { value: 'COLLABORATOR', label: 'Colaborador' },
  { value: 'PASTOR', label: 'Pastor' },
  { value: 'PRESBYTER', label: 'Presbítero' },
  { value: 'EVANGELIST', label: 'Evangelista' },
  { value: 'DEACON', label: 'Diácono' },
];

const civilStates = [
  { value: 'SINGLE', label: 'Solteiro(a)' },
  { value: 'MARRIED', label: 'Casado(a)' },
  { value: 'DIVORCED', label: 'Divorciado(a)' },
  { value: 'WIDOWED', label: 'Viúvo(a)' },
];

const inputStyles = "border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333]";
const selectTriggerStyles = "border-[#333333] focus:border-[#333333] focus-visible:ring-[#333333] focus:ring-[#333333] data-[placeholder]:text-[#333333]";

const deactivationOptions = [
  { value: 'ABANDONO', label: 'Abandono' },
  { value: 'FALECIMENTO', label: 'Falecimento' },
  { value: 'MUDANCA', label: 'Mudança' },
  { value: 'OUTROS', label: 'Outros' },
];

const initialFormData: CreateMemberData = {
  name: '',
  function: '',
  phone: '',
  birthDate: '',
  gender: '',
  maritalStatus: '',
  cpf: '',
  nationality: '',
  profession: '',
  filiation: '',
  birthPlace: '',
  zipCode: '',
  city: '',
  state: '',
  neighborhood: '',
  address: '',
  number: '',
  complement: '',
  baptismDate: '',
  baptismPlace: '',
  holySpiritBaptism: undefined,
  holySpiritBaptismDate: '',
  holySpiritBaptismPlace: '',
  recommendationLetter: undefined,
  recommendationLetterDate: '',
  deactivationFlag: undefined,
};

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateMemberData>(initialFormData);
  const [isActive, setIsActive] = useState(false);
  const [showDeactivationFlag, setShowDeactivationFlag] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await memberService.getById(Number(id));
        if (response?.data) {
          setFormData(response.data);
          setIsActive(response.data.active || false);
          setShowDeactivationFlag(!response.data.active);
        }
      } catch (err: any) {
        console.error('Error loading member:', err);
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const memberData = {
        ...formData,
        active: isActive,
      };

      if (!isActive && !memberData.deactivationFlag) {
        alert('Por favor, selecione um motivo para desativar o membro.');
        setLoading(false);
        return;
      }

      if (isActive) {
        // Se o membro está ativo, remova a flag de desativação
        delete memberData.deactivationFlag;
      }

      if (id) {
        await memberService.update(parseInt(id), memberData);
      } else {
        await memberService.create(memberData);
      }

      navigate('/members/list');
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      recommendationLetter: file || undefined
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setIsActive(checked);
    setShowDeactivationFlag(!checked);
    
    if (checked) {
      // Limpar a flag de desativação se o membro for ativado
      setFormData(prev => ({
        ...prev,
        deactivationFlag: undefined
      }));
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-medium bg-[#333333] text-white p-2 rounded-md">Informações Pessoais</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="function">Função na igreja *</Label>
              <Select
                value={formData.function}
                onValueChange={handleSelectChange('function')}
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
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
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                required
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Sexo *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                  <SelectItem value="FEMININO">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Estado Civil *</Label>
              <Select
                value={formData.maritalStatus}
                onValueChange={handleSelectChange('maritalStatus')}
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
                onChange={(e) => handleInputChange('cpf', e.target.value)}
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
                onChange={(e) => handleInputChange('nationality', e.target.value)}
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
                onChange={(e) => handleInputChange('profession', e.target.value)}
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
                onChange={(e) => handleInputChange('filiation', e.target.value)}
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
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
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
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
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
                onChange={(e) => handleInputChange('city', e.target.value)}
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
                onChange={(e) => handleInputChange('state', e.target.value)}
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
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
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
                onChange={(e) => handleInputChange('address', e.target.value)}
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
                onChange={(e) => handleInputChange('number', e.target.value)}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                name="complement"
                value={formData.complement}
                onChange={(e) => handleInputChange('complement', e.target.value)}
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
                onChange={(e) => handleInputChange('baptismDate', e.target.value)}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baptismPlace">Local do Batismo</Label>
              <Input
                id="baptismPlace"
                name="baptismPlace"
                value={formData.baptismPlace}
                onChange={(e) => handleInputChange('baptismPlace', e.target.value)}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holySpiritBaptism">Batismo com Espírito Santo</Label>
              <Select
                value={formData.holySpiritBaptism}
                onValueChange={(value: HolySpiritBaptism) => handleInputChange('holySpiritBaptism', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
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
                onChange={(e) => handleInputChange('holySpiritBaptismDate', e.target.value)}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holySpiritBaptismPlace">Local do Batismo com Espírito Santo</Label>
              <Input
                id="holySpiritBaptismPlace"
                name="holySpiritBaptismPlace"
                value={formData.holySpiritBaptismPlace}
                onChange={(e) => handleInputChange('holySpiritBaptismPlace', e.target.value)}
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
                onChange={(e) => handleInputChange('recommendationLetterDate', e.target.value)}
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

        {id && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium bg-[#333333] text-white p-2 rounded-md">Status do Membro</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="active">Status do Membro</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => handleActiveChange(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>{isActive ? 'Ativo' : 'Inativo'}</span>
                </div>
              </div>

              {showDeactivationFlag && (
                <div className="space-y-2">
                  <Label htmlFor="deactivationFlag">Motivo da Desativação *</Label>
                  <Select
                    value={formData.deactivationFlag}
                    onValueChange={(value: DeactivationFlag) => handleInputChange('deactivationFlag', value)}
                    required={!isActive}
                  >
                    <SelectTrigger className={selectTriggerStyles}>
                      <SelectValue placeholder="Selecione um motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {deactivationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

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