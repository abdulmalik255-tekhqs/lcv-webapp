import { LoginFooter } from "@/assets";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact Us", href: "#" },
];

const LoginFooterComponent = () => (
  <footer className="!w-full px-6 py-6 text-xs !text-primary bottom-0  ">
    <div className=" flex w-full md:px-6 px-6 flex-col items-center gap-4 md:flex-row md:justify-between">
      <p>© 2025 Liberty City Ventures. All rights reserved.</p>
      <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium !text-primary">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="hover:!text-primary !text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2 text-primary">
        <span>Powered by:</span>
        <LoginFooter />
      </div>
    </div>
  </footer>
);

export default LoginFooterComponent;
