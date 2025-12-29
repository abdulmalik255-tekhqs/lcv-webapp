export const USER_ROLES = {
  ADMIN: 'admin',
  ISSUER: 'issuer',
  INVESTOR: 'investor',
  REGISTRAR: 'registrar',
}

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.ISSUER]: 'Issuer',
  [USER_ROLES.INVESTOR]: 'Investor',
  [USER_ROLES.REGISTRAR]: 'Registrar',
}

export const ROLE_DEFAULT_ROUTES = {
  [USER_ROLES.ADMIN]: '/admin-dashboard',
  [USER_ROLES.ISSUER]: '/issuer/dashboard',
  [USER_ROLES.INVESTOR]: '/investor/dashboard',
  [USER_ROLES.REGISTRAR]: '/registrar/dashboard',
}

export const ALL_ROLES = Object.values(USER_ROLES)

