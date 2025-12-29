const DashboardIllustration = ({ className = 'w-full max-w-lg text-primary-500' }) => (
  <svg
    className={className}
    viewBox="0 0 420 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="dashboardTitle"
  >
    <title id="dashboardTitle">Dashboard Overview</title>
    <rect x="32" y="36" width="356" height="208" rx="24" fill="currentColor" opacity="0.12" />
    <rect x="64" y="68" width="292" height="144" rx="16" fill="currentColor" opacity="0.18" />
    <rect x="92" y="96" width="116" height="88" rx="12" fill="currentColor" opacity="0.3" />
    <rect x="220" y="96" width="116" height="88" rx="12" fill="currentColor" opacity="0.22" />
    <rect x="92" y="198" width="244" height="20" rx="10" fill="currentColor" opacity="0.35" />
    <path
      d="M104 176c22-16 44-16 66 0 22 16 44 16 66 0s44-16 66 0"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      opacity="0.6"
    />
    <circle cx="146" cy="144" r="18" fill="#fff" />
    <circle cx="210" cy="144" r="18" fill="#fff" opacity="0.8" />
    <circle cx="274" cy="144" r="18" fill="#fff" opacity="0.6" />
  </svg>
)

export default DashboardIllustration

