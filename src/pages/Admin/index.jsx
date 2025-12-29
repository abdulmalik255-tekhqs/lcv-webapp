import AdminAssetsdIcon from "@/assets/admin-assets/admin-assets.svg";
import AdminPersonneltIcon from "@/assets/admin-assets/admin-personnel.svg";
import AdminInvestordIcon from "@/assets/admin-assets/adminAssets.svg";
import AdminDashboardIcon from "@/assets/admin-assets/dashboard.svg";
import AdminIssuerdIcon from "@/assets/admin-assets/issuers.svg";
import AdminPurchaseRequestIcon from "@/assets/admin-assets/purchase-request.svg";
import AdminRegisterIcon from "@/assets/admin-assets/register-icon.svg";
import { Card } from "@/components/shared";
import { Link, Outlet, useLocation } from "react-router-dom";
import LoginFooterComponent from "../layout/LoginFooter";
import Navbar from "../layout/Navbar";

const sidebarLinks = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AdminDashboardIcon,
    path: "/admin/dashboard",
    disabled: false,
  },

  {
    id: "assets",
    label: "Assets",
    icon: AdminAssetsdIcon,
    path: "/admin/assets",
    disabled: false,
  },
  {
    id: "investors",
    label: "Investors",
    icon: AdminInvestordIcon,
    path: "/admin/investors",
    disabled: false,
  },
  {
    id: "issuers",
    label: "Issuers",
    icon: AdminIssuerdIcon,
    path: "/admin/issuers",
    disabled: false,
  },
  {
    id: "purchase_request",
    label: "Purchase Request",
    icon: AdminPurchaseRequestIcon,
    path: "/admin/purchase-request",
    disabled: false,
  },
  
  {
    id: "registrar",
    label: "Registrar",
    icon: AdminRegisterIcon,
    path: "/admin/registrar",
    disabled: false,
  },
];

const AdminComponents = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <main className="min-h-screen bg-[#f4f5fa] !h-[100vh] !w-full pb-2 sm:pb-4 min-h-[calc(100vh-100px)]">
      <Navbar name="Admin Portal" />

      <section className="relative z-10 flex flex-1 justify-center px-[30px]">
        <div className="-mt-[165px] w-full max-w-8xl">
          <Card className="flex w-full flex-col gap-4  border bg-white !rounded-[20px] !p-0 sm:flex-row">
            <aside className="hidden w-[234px] flex-shrink-0 flex-col gap-1  sm:flex px-3 py-2 sm:px-2 sm:py-6">
              <div className="space-y-1 sm:space-y-1 mt-2">
                {sidebarLinks.map((link) => {
                  // Check if current path matches the link path exactly
                  // or if current path is a child route of the link path
                  const isActive =
                    activePath === link.path ||
                    (link.path === "/admin/dashboard" &&
                      activePath === "/admin") ||
                    activePath.startsWith(link.path + "/");

                  const baseClassName = `flex w-full items-center justify-between px-3 py-2 text-left text-[15px] transition sm:px-4 sm:py-3 sm:text-[15px] ${
                    isActive && !link.disabled
                      ? "bg-[linear-gradient(135deg,_rgba(155,60,255,0.09)_0%,_rgba(45,103,255,0.09)_100%)] text-[#000] rounded-full font-[500px]"
                      : link.disabled
                      ? "text-[#999] cursor-not-allowed opacity-60 font-[500px] rounded-full"
                      : "text-[#000] hover:bg-slate-200 font-[500px] rounded-full"
                  }`;

                  if (link.disabled) {
                    return (
                      <div
                        key={link.id}
                        className={`${baseClassName} relative group`}
                        title="Coming Soon"
                      >
                        <span className="flex items-center gap-2 sm:gap-3">
                          <img
                            src={link.icon}
                            alt=""
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-80"
                          />
                          {link.label}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute -right-10 top-3 ml-2 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          Coming Soon
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-[#333]"></div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={baseClassName}
                    >
                      <span className="flex items-center gap-2 sm:gap-3  font-medium text-[15px]">
                        <img
                          src={link.icon}
                          alt=""
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                        />
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="flex-1  min-h-[calc(100vh-150px)] overflow-y-auto  scrollbar-hide h-full">
              <Outlet />
            </div>
          </Card>
        </div>
      </section>
      <LoginFooterComponent />
    </main>
  );
};

export default AdminComponents;
