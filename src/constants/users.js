import { USER_ROLES } from './roles'

export const MOCK_USERS = [
  {
    id: 'u-admin-001',
    email: 'haris.s@kresus.com',
    password: '12345678',
    name: 'Haris Sajid',
    role: USER_ROLES.ADMIN,
    permissions: ['platform:configure', 'users:manage', 'reports:view'],
  },
  {
    id: 'u-issuer-101',
    email: 'naveedriaz829@gmail.com',
    password: '12345678',
    name: 'Jordan Blake',
    role: USER_ROLES.ISSUER,
    permissions: ['offerings:create', 'orders:review', 'documents:publish'],
  },
  {
    id: 'u-investor-220',
    email: 'investor@liberty.io',
    password: 'Investor@123',
    name: 'Taylor Morgan',
    role: USER_ROLES.INVESTOR,
    permissions: ['portfolio:view', 'subscriptions:manage'],
  },
  {
    id: 'u-registrar-330',
    email: 'naveed.r@kresus.com',
    password: '12345678',
    name: 'Registrar User',
    role: USER_ROLES.REGISTRAR,
    permissions: ['registrar:manage'],
  },
]

