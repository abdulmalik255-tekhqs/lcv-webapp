const AuthIllustration = ({ className = 'w-full max-w-md text-primary-400' }) => (
  <svg
    className={className}
    viewBox="0 0 400 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-labelledby="authTitle"
  >
    <title id="authTitle">Secure Login</title>
    <rect x="32" y="48" width="336" height="224" rx="28" fill="currentColor" opacity="0.1" />
    <rect x="72" y="80" width="256" height="160" rx="20" fill="currentColor" opacity="0.2" />
    <rect x="112" y="112" width="176" height="96" rx="16" fill="currentColor" opacity="0.35" />
    <path
      d="M264 152c0-35.346-28.654-64-64-64s-64 28.654-64 64"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <rect x="152" y="152" width="96" height="72" rx="16" fill="currentColor" />
    <circle cx="200" cy="192" r="12" fill="#fff" />
    <rect x="196" y="204" width="8" height="24" rx="4" fill="#fff" />
  </svg>
)

export default AuthIllustration

