const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'users', component: () => import('pages/UsersPage.vue') }
    ]
  },
  {
    path: '/renters',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'renters', component: () => import('pages/RentersPage.vue') }
    ]
  },
  {
    path: '/publishers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'publishers', component: () => import('pages/PublishersPage.vue') }
    ]
  },
  {
    path: '/books',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'books', component: () => import('pages/BooksPage.vue') }
    ]
  },
  {
    path: '/rents',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'rents', component: () => import('pages/RentsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
