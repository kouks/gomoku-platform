import Documentation from '@/components/Docs/Documentation'
import GetStarted from '@/components/Docs/GetStarted'
import Client from '@/components/Client/Index'
import Tournaments from '@/components/Tournaments/Index'

export default [
  {
    path: '/',
    component: Tournaments,
    name: 'tournaments'
  },
  {
    path: '/docs',
    component: Documentation,
    name: 'docs'
  },
  {
    path: '/get-started',
    component: GetStarted,
    name: 'get-started'
  },
  {
    path: '/client',
    component: Client,
    name: 'client'
  }
]
