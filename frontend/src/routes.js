import Docs from '@/components/Docs/Index'
import Tournaments from '@/components/Tournaments/Index'

export default [
  {
    path: '/',
    component: Tournaments,
    name: 'tournaments'
  },
  {
    path: '/docs',
    component: Docs,
    name: 'docs'
  }
]
