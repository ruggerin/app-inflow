import {
  BrandGravatarIcon,
  MenuIcon,
  CircleIcon,
  ShapeIcon,
  CircleOffIcon,
  CircuitGroundDigitalIcon,
  BoxMultipleIcon,
  BrandChromeIcon,
  HelpIcon,
  DatabaseImportIcon,
  UsersIcon,
  DatabaseIcon,
  SitemapIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [

  {
    title: 'Cadastros Básico',
    icon: DatabaseIcon,
    to: '#',
    children: [
      {
        title: 'Menus',
        icon: CircleIcon,
        to: '/demand',
      },
      {
        title: 'Usuários',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Unidade de Negócio',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Operadores',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Docas',
        icon: CircleIcon,
        to: '/cadastro/docas',
      },
      {
        title: 'Recursos',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Recursos e Unidades de Negócio',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Processos',
        icon: CircleIcon,
        to: '/usuarios',
      },
      {
        title: 'Produtos',
        icon: CircleIcon,
        to: '/cadastro/produtos',
      },
      {
        title: 'Turnos',
        icon: CircleIcon,
        to: '/usuarios',
      },


    ]
  },


 

  {
    title: 'Recebimento de Materiais',
    icon: UsersIcon,
    to: '#',
    children: [
      {
        title: 'Agendamento',
        icon: CircleIcon,
        /*to: '/precificador',*/

        to: 'recebimento/agendamento'
     
        
      },
      {
        title: '**',
        icon: CircleIcon,
        /*to: '/precificador',*/

        to: '/industria/tendencia'
     
        
      },
      
    ]
  },
  {
    title: 'Parâmetros',
    icon: MenuIcon,

    children: [
      {
        title: 'Agendamento logístico',
        icon: CircleIcon,
        to: '/fiscal/livros',


      },
      {
        title: 'Cadastros básicos',
        icon: CircleIcon,
        to: '/configuracao-cadastro-basico',


      }
    ]
  },


];

export default sidebarItem;
