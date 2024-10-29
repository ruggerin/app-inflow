
const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'Starter',
      path: '/',
      component: () => import('@/views/StarterPage.vue')
    },

    {
      name: 'Usuarios',
      path: '/controle-de-acesso/usuarios',
      component: () => import('@/views/cadastros_basicos/users/UsersIndex.vue')
    },
    {
      name: 'UsuariosEdit',
      path: '/controle-de-acesso/usuarios/:id/editar',
      component: () => import('@/views/cadastros_basicos/users/UserEdit.vue')
    },
    {
      name: 'LivrosIndex',
      path: '/fiscal/livros',
      component: () => import('@/views/fiscal/LivrosIndex.vue')
    },
    {
      name: 'LivrosDetalhes',
      path: '/fiscal/livros/:id/show',
      component: () => import('@/views/fiscal/LivroDetalhes.vue')
    },

    {
      name: 'producaoProdutividade',
      path: '/producao/produtividade',
      component: () => import('@/views/producao/AcompanhamentoProducao.vue')
    },
    {
      name: 'producaoTendencia',
      path: '/industria/tendencia',
      component: () => import('@/views/industria/dash_planejamento/relatorio_01.vue')
    },
    {
      name: 'produtos',
      path: '/cadastro/produtos',
      component: () => import('@/views/cadastros_basicos/produtos/ProdutosIndex.vue')
    },


    {
      name: 'cadastro-generico',
      props: true,
      path: '/cadastro/basico/:controller_name',
      component: () => import('@/views/cadastros_basicos/cadastro_generico/CadastroRapidoCrud.vue')
    },
    {
      name: 'recebimento-agendamento',
      path: '/recebimento/agendamento',
      component: () => import('@/views/agendamento/AgendamentoComponent.vue')
    },
    {
      name: 'agendamento-solicitar',
      path: '/agendamento/solicitar',
      component: () => import('@/views/agendamento/solicitar_agendamento/SolicitarAgendamentoIndex.vue')
    },
    {
      name: 'agendamento-solicitar-edit',
      path: '/agendamento/solicitar/:id/editar',
      component: () => import('@/views/agendamento/solicitar_agendamento/SolicitarAgendamentoEdit.vue')
    },
    {
      name: 'agendamento-dashboard',
      path: '/agendamento/dashboard',
      component: () => import('@/views/agendamento/dashboard/AgendamentoDashboard.vue')

    },
    {
      name: 'agendamento-aprovacao',
      path: 'agendamento/aprovacao',
      component: () => import('@/views/agendamento/aprovacao_agendamento/AprovacaoAgendamento.vue')
    },

    {
      name: 'cadastro-basico-config',
      path: '/configuracao-cadastro-basico',
      component: () => import('@/views/cadastros_basicos/configuracao_cadastro_basico/CadastroBasicoIndex.vue')

    },
    {
      name: 'controleacesso-perfil-edit',
      path: '/controle-de-acesso/perfil/:id/editar',
      component: () => import('@/views/permissoes/PerfilEdit.vue')

    },
    {
      name: 'controleacesso-perfil-index',
      path: '/controle-de-acesso/perfil',
      component: () => import('@/views/permissoes/PerfilIndex.vue')

    },

    {
      name: 'parametros-menus',
      path: '/parametros/menus',
      component: () => import('@/views/cadastros_basicos/menu/CadastroMenu.vue')
    },
    {
      name: 'parametros-edicao',
      path: '/parametros/editar',
      component: () => import('@/views/parametros/ParametrosIndex.vue')
    }






  ]
};

export default MainRoutes;
