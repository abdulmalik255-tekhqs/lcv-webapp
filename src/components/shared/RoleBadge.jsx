import clsx from 'clsx'
import { ROLE_LABELS } from '../../constants'

const ROLE_THEMES = {
  admin: 'bg-rose-50 text-rose-600 border border-rose-200',
  issuer: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  investor: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
}

const RoleBadge = ({ role, className }) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      ROLE_THEMES[role] ?? 'bg-slate-100 text-slate-700',
      className,
    )}
  >
    {ROLE_LABELS[role] ?? role}
  </span>
)

export default RoleBadge

