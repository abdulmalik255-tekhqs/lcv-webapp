import AdminDashboardIcon from "@/assets/AdminDashbaordIcon";
import { Card } from "@/components/shared";
import { Link, Outlet, useLocation } from "react-router-dom";
import tokensIcon from "../../assets/admin-assets/tokens.svg";
import assetHoldersIcon from "../../assets/issuer-assets/asset-holders.svg";
import listingIcon from "../../assets/issuer-assets/listingIcon.svg";
import purchaseIcon from "../../assets/issuer-assets/purchase.svg";
import LoginFooterComponent from "../layout/LoginFooter";
import Navbar from "../layout/Navbar";

const sidebarLinks = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: AdminDashboardIcon,
    isSvg: false,
    path: "/issuer/dashboard",
  },
  {
    id: "assets",
    label: "Assets",
    icon: tokensIcon,
    isSvg: true,
    path: "/issuer/assets",
  },
  {
    id: "listing",
    label: "Listing",
    icon: listingIcon,
    isSvg: true,
    path: "/issuer/listing",
  },

  {
    id: "Purchase Requests",
    label: "Tokens Purchase Queue",
    icon: purchaseIcon,
    isSvg: true,
    path: "/issuer/purchase-requests",
  },
  {
    id: "Asset Holders",
    label: "Asset Holders",
    icon: assetHoldersIcon,
    isSvg: true,
    path: "/issuer/asset-holders",
  },
];

const IssuerComponents = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <main className="min-h-screen bg-[#f4f5fa] !h-[100vh] !w-full pb-2 sm:pb-4 min-h-[calc(100vh-100px)]">
      <Navbar name="Issuer Portal" />

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
                    (link.path === "/issuer/dashboard" &&
                      activePath === "/issuer") ||
                    activePath.startsWith(link.path + "/");

                  const baseClassName = `flex w-full items-center justify-between px-3 py-3 text-left text-[15px] transition sm:px-4 sm:py-3 sm:text-[15px] ${
                    isActive && !link.disabled
                      ? "bg-[linear-gradient(135deg,_rgba(155,60,255,0.09)_0%,_rgba(45,103,255,0.09)_100%)] text-[#000] rounded-full font-[500px]"
                      : link.disabled
                      ? "text-[#AEAEB2] cursor-not-allowed opacity-60 font-[500px] rounded-full"
                      : "text-[#000] hover:bg-[linear-gradient(135deg,_rgba(155,60,255,0.09)_0%,_rgba(45,103,255,0.09)_100%)] font-[500px] rounded-full"
                  }`;

                  const iconClassName = link.disabled
                    ? "h-3.5 w-3.5 sm:h-4 sm:w-4"
                    : "h-3.5 w-3.5 sm:h-4 sm:w-4 mb-1";

                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={baseClassName}
                    >
                      <span className="flex items-center gap-2 sm:gap-3 font-medium text-[15px]">
                        {link.isSvg ? (
                          <img
                            src={link.icon}
                            alt=""
                            className={iconClassName}
                          />
                        ) : (
                          (() => {
                            const IconComponent = link.icon;
                            return <IconComponent className={iconClassName} />;
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

export default IssuerComponents;
