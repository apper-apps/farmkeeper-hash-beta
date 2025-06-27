import Dashboard from '@/components/pages/Dashboard'
import Farms from '@/components/pages/Farms'
import Crops from '@/components/pages/Crops'
import Tasks from '@/components/pages/Tasks'
import Weather from '@/components/pages/Weather'
import Expenses from '@/components/pages/Expenses'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  farms: {
    id: 'farms',
    label: 'Farms',
    path: '/farms',
    icon: 'MapPin',
    component: Farms
  },
  crops: {
    id: 'crops',
    label: 'Crops',
    path: '/crops',
    icon: 'Wheat',
    component: Crops
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  weather: {
    id: 'weather',
    label: 'Weather',
    path: '/weather',
    icon: 'CloudSun',
    component: Weather
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'DollarSign',
    component: Expenses
  }
}

export const routeArray = Object.values(routes)