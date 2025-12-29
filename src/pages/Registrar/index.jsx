import { Link, Outlet, useLocation } from "react-router-dom";
import AdminDashboardIcon from "@/assets/AdminDashbaordIcon";
import { Card } from "@/components/shared";
import tokensIcon from "../../assets/admin-assets/tokens.svg";
import requestsIcon from "../../assets/admin-assets/requests.svg";
import queueIcon from "../../assets/admin-assets/queue.svg";
import issuersIcon from "../../assets/admin-assets/issuers.svg";
import shareholdersIcon from "../../assets/admin-assets/share-holders.svg";
import Navbar from "../layout/Navbar";
import LoginFooterComponent from "../layout/LoginFooter";

const sidebarLinks = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AdminDashboardIcon,
    isSvg: false,
    path: "/registrar/dashboard",
  },
  {
    id: "assets",
    label: "Assets",
    icon: tokensIcon,
    isSvg: true,
    path: "/registrar/assets",
  },
  {
    id: "tokenization-requests",
    label: "Tokenization Requests",
    icon: requestsIcon,
    isSvg: true,
    path: "/registrar/tokenization-requests",
  },
  {
    id: "tokenization-issuance-queue",
    label: "Token Purchase Queue",
    icon: queueIcon,
    isSvg: true,
    path: "/registrar/tokenization-issuance-queue",
  },
  {
    id: "issuers",
    label: "Issuers",
    icon: issuersIcon,
    isSvg: true,
    path: "/registrar/issuers",
  },
  {
    id: "shareholders",
    label: "Shareholders",
    icon: shareholdersIcon,
    isSvg: true,
    path: "/registrar/shareholders",
  },
];

const RegistrarComponents = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <main className="min-h-screen bg-[#f4f5fa] !h-[100vh] !w-full pb-2 sm:pb-4 min-h-[calc(100vh-100px)]">
      <Navbar name="Registrar Portal" />

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
                    (link.path === "/registrar/dashboard" &&
                      activePath === "/registrar") ||
                    (activePath.startsWith(link.path + "/"));
                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left text-[15px] transition sm:px-4 sm:py-3 sm:text-[15px] ${
                        isActive
                          ? "bg-[linear-gradient(135deg,_rgba(155,60,255,0.09)_0%,_rgba(45,103,255,0.09)_100%)] text-[#000] rounded-full font-[500px]"
                          : "text-[#000] hover:bg-slate-200 font-[500px] rounded-full"
                      }`}
                    >
                      <span className="flex items-center gap-2 sm:gap-3  font-medium text-[15px]">
                        {link.isSvg ? (
                          <img
                            src={link.icon}
                            alt=""
                            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                          />
                        ) : (
                          (() => {
                            const IconComponent = link.icon;
                            return (
                              <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            );
                          })()
                        )}
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="flex-1 pb-12 min-h-[calc(100vh-190px)] overflow-y-auto  scrollbar-hide h-full">
              <Outlet />
            </div>
          </Card>
        </div>
      </section>
      <LoginFooterComponent />
    </main>
  );
};

export default RegistrarComponents;
