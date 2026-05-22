export type OSStatus = "aberta" | "em_andamento" | "aguardando" | "concluida" | "cancelada";
export type OSPriority = "baixa" | "media" | "alta" | "urgente";

export interface OrdemServico {
  id: string;
  numero: string;
  titulo: string;
  cliente: string;
  tecnico: string;
  status: OSStatus;
  prioridade: OSPriority;
  abertura: string;
  prazo: string;
  valor: number;
  descricao: string;
}

export const mockOS: OrdemServico[] = [
  { id: "1", numero: "OS-2024-001", titulo: "Manutenção preventiva servidor", cliente: "Acme Corp", tecnico: "João Silva", status: "em_andamento", prioridade: "alta", abertura: "2024-05-10", prazo: "2024-05-22", valor: 2400, descricao: "Manutenção preventiva no servidor de produção" },
  { id: "2", numero: "OS-2024-002", titulo: "Troca de impressora", cliente: "Beta Ltda", tecnico: "Maria Souza", status: "aberta", prioridade: "media", abertura: "2024-05-12", prazo: "2024-05-25", valor: 800, descricao: "Instalação de nova impressora multifuncional" },
  { id: "3", numero: "OS-2024-003", titulo: "Configuração de rede", cliente: "Gamma SA", tecnico: "Carlos Lima", status: "aguardando", prioridade: "urgente", abertura: "2024-05-13", prazo: "2024-05-20", valor: 3200, descricao: "Reconfigurar switches e roteadores do escritório" },
  { id: "4", numero: "OS-2024-004", titulo: "Backup mensal", cliente: "Delta Inc", tecnico: "Ana Costa", status: "concluida", prioridade: "baixa", abertura: "2024-05-01", prazo: "2024-05-05", valor: 600, descricao: "Backup completo dos servidores" },
  { id: "5", numero: "OS-2024-005", titulo: "Suporte ao sistema ERP", cliente: "Epsilon Tech", tecnico: "João Silva", status: "em_andamento", prioridade: "alta", abertura: "2024-05-14", prazo: "2024-05-28", valor: 1800, descricao: "Customizações no módulo financeiro" },
  { id: "6", numero: "OS-2024-006", titulo: "Instalação de câmeras", cliente: "Zeta Holdings", tecnico: "Maria Souza", status: "aberta", prioridade: "media", abertura: "2024-05-15", prazo: "2024-05-30", valor: 4500, descricao: "Sistema de monitoramento CFTV" },
  { id: "7", numero: "OS-2024-007", titulo: "Auditoria de segurança", cliente: "Acme Corp", tecnico: "Carlos Lima", status: "cancelada", prioridade: "alta", abertura: "2024-05-08", prazo: "2024-05-15", valor: 5000, descricao: "Cancelada pelo cliente" },
];

export const mockClientes = [
  { id: "1", nome: "Acme Corp", cnpj: "00.000.000/0001-00", email: "contato@acme.com", telefone: "(11) 9999-0001", cidade: "São Paulo" },
  { id: "2", nome: "Beta Ltda", cnpj: "11.111.111/0001-11", email: "contato@beta.com", telefone: "(11) 9999-0002", cidade: "Rio de Janeiro" },
  { id: "3", nome: "Gamma SA", cnpj: "22.222.222/0001-22", email: "contato@gamma.com", telefone: "(11) 9999-0003", cidade: "Belo Horizonte" },
  { id: "4", nome: "Delta Inc", cnpj: "33.333.333/0001-33", email: "contato@delta.com", telefone: "(11) 9999-0004", cidade: "Curitiba" },
];

export const mockTecnicos = [
  { id: "1", nome: "João Silva", especialidade: "Infraestrutura", email: "joao@empresa.com", telefone: "(11) 8888-0001", ativo: true },
  { id: "2", nome: "Maria Souza", especialidade: "Hardware", email: "maria@empresa.com", telefone: "(11) 8888-0002", ativo: true },
  { id: "3", nome: "Carlos Lima", especialidade: "Redes", email: "carlos@empresa.com", telefone: "(11) 8888-0003", ativo: true },
  { id: "4", nome: "Ana Costa", especialidade: "Software", email: "ana@empresa.com", telefone: "(11) 8888-0004", ativo: false },
];

export const mockProdutos = [
  { id: "1", codigo: "P001", nome: "HD SSD 1TB", categoria: "Armazenamento", preco: 450, estoque: 25 },
  { id: "2", codigo: "P002", nome: "Memória RAM 16GB", categoria: "Memória", preco: 380, estoque: 40 },
  { id: "3", codigo: "P003", nome: "Switch 24 portas", categoria: "Rede", preco: 1200, estoque: 8 },
  { id: "4", codigo: "P004", nome: "Cabo HDMI 2m", categoria: "Acessórios", preco: 35, estoque: 120 },
];

export const mockServicos = [
  { id: "1", codigo: "S001", nome: "Instalação de servidor", valor: 800, duracao: "4h" },
  { id: "2", codigo: "S002", nome: "Manutenção preventiva", valor: 400, duracao: "2h" },
  { id: "3", codigo: "S003", nome: "Configuração de rede", valor: 600, duracao: "3h" },
  { id: "4", codigo: "S004", nome: "Suporte técnico remoto", valor: 150, duracao: "1h" },
];

export const mockDashboard = {
  metrics: {
    totalAbertas: 18,
    emAndamento: 12,
    concluidasMes: 47,
    receitaMes: 84200,
  },
  porStatus: [
    { name: "Abertas", value: 18 },
    { name: "Em andamento", value: 12 },
    { name: "Aguardando", value: 6 },
    { name: "Concluídas", value: 47 },
  ],
  evolucao: [
    { mes: "Jan", abertas: 32, concluidas: 28 },
    { mes: "Fev", abertas: 38, concluidas: 34 },
    { mes: "Mar", abertas: 41, concluidas: 39 },
    { mes: "Abr", abertas: 36, concluidas: 35 },
    { mes: "Mai", abertas: 45, concluidas: 47 },
  ],
};
