

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
      path: '/usuarios',
      component: () => import('@/views/cadastros_basicos/users/UsersIndex.vue')
    },
    {
      name: 'UsuariosEdit',
      path: '/usuarios/:id/editar',
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
      name:'cadastro-generico', 
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
      name:'cadastro-basico-config',
      path: '/configuracao-cadastro-basico',
      component: ()=>   import('@/views/cadastros_basicos/configuracao_cadastro_basico/CadastroBasicoIndex.vue')

    },
    {
      name:'controleacesso-perfil-edit',
      path: '/controle-de-acesso/perfil/:id/edit',
      component: ()=>   import('@/views/permissoes/PermissoesIndex.vue')

    }





  ]
};

export default MainRoutes;
