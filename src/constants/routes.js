import { ROLE_DEFAULT_ROUTES, USER_ROLES } from './roles'

export const ROUTE_PATHS = {
  root: '/',
  login: '/login',
  forgotPassword: '/forgot-password',
  adminDashboard: ROLE_DEFAULT_ROUTES[USER_ROLES.ADMIN],
  issuerDashboard: ROLE_DEFAULT_ROUTES[USER_ROLES.ISSUER],
  investorDashboard: ROLE_DEFAULT_ROUTES[USER_ROLES.INVESTOR],
  registrarDashboard: ROLE_DEFAULT_ROUTES[USER_ROLES.REGISTRAR],
  registrarAssets: '/registrar/assets',
  registrarTokenizationRequests: '/registrar/tokenization-requests',
  registrarTokenizationIssuanceQueue: '/registrar/tokenization-issuance-queue',
  registrarIssuers: '/registrar/issuers',
  registrarShareholders: '/registrar/shareholders',
}

export const PRIVATE_ROUTE_META = [
  {
    path: ROUTE_PATHS.adminDashboard,
    roles: [USER_ROLES.ADMIN],
    title: 'Admin Command Center',
  },
  {
    path: ROUTE_PATHS.issuerDashboard,
    roles: [USER_ROLES.ISSUER],
    title: 'Issuer Workspace',
  },
  {
    path: ROUTE_PATHS.investorDashboard,
    roles: [USER_ROLES.INVESTOR],
    title: 'Investor HQ',
  },
  {
    path: ROUTE_PATHS.registrarDashboard,
    roles: [USER_ROLES.REGISTRAR],
    title: 'Registrar Dashboard',
  },
]

export const PUBLIC_ROUTE_META = [
  { path: ROUTE_PATHS.login, title: 'Sign In' },
  { path: ROUTE_PATHS.forgotPassword, title: 'Reset Password' },
]

