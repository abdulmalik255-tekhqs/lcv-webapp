import { useMemo, useState } from "react";
import InviteUserModal from "./InviteUserModal";
import SearchIcon from "../../../assets/admin-assets/search.svg";
import Arrowdown from "../../../assets/admin-assets/arrow-down.svg";
import { EmptyState } from "@/components/shared";

const FILTERS = [
  { id: "all", label: "All Users" },
  { id: "registrar", label: "Registrars" },
  { id: "issuer", label: "Issuers" },
  { id: "broker", label: "Brokers" },
  { id: "investor", label: "Investors" },
];

const USER_DATA = [
  {
    firstName: "Jones",
    lastName: "Morey",
    email: "nate802@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Douglas",
    lastName: "Allan",
    email: "dallen1632@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "JoAnn",
    lastName: "Field",
    email: "jfield@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Elizabeth",
    lastName: "Campbell",
    email: "elliecampbell@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Jennifer",
    lastName: "Anne",
    email: "jenniferanne@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
  {
    firstName: "Sylvia",
    lastName: "Pizarro",
    email: "spizarro@gmail.com",
    role: "Investor",
    date: "11/6/2025",
    status: "Active",
  },
];

const roleFilterMap = {
  registrar: "Investor",
  issuer: "Issuer",
  broker: "Broker",
  investor: "Investor",
};

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-slate-400">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);



const UsersTable = () => {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteOpen, setInviteOpen] = useState(false);

  const filterCounts = useMemo(() => {
    const base = { all: USER_DATA.length };
    FILTERS.slice(1).forEach((filter) => {
      base[filter.id] = USER_DATA.filter(
        (user) => user.role === roleFilterMap[filter.id]
      ).length;
    });
    return base;
  }, []);

  const visibleUsers = useMemo(() => {
    const filtered =
      activeFilter === "all"
        ? USER_DATA
        : USER_DATA.filter((user) => user.role === roleFilterMap[activeFilter]);

    if (!searchTerm.trim()) {
      return filtered;
    }

    const term = searchTerm.toLowerCase();
    return filtered.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [activeFilter, searchTerm]);

  return (
    <div className="py-6 px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">
            User Management
          </h2>
          <p className="text-sm text-[#4A5565]">
            Manage all users across different roles
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] text-white px-6 py-2 text-sm font-medium text-white  hover:opacity-90"
        >
          <span className="text-2xl leading-none">+</span> Invite User
        </button>
      </div>

      {/* <div className="border-none bg-white !p-0 mt-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-[60%]">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[15px] transition ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                    : "bg-white border text-[#000] font-semibold hover:bg-slate-200"
                }`}
              >
                {filter.label}
                <span
                  className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-full text-xs ${
                    activeFilter === filter.id
                      ? "bg-white text-black"
                      : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]"
                  }`}
                >
                  {filter.id === "all"
                    ? filterCounts.all
                    : filterCounts[filter.id] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-[40%]">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <img src={SearchIcon} alt="Search" className="h-4 w-3" />
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-full border bg-slate-50 border-[#E5E5EA] py-2 pl-11 pr-4 text-xs text-[#000] placeholder:text-slate-600 focus:border-[#120048] focus:outline-none  focus:ring-[#0E1696]"
            />
          </div>
        </div>

        <div className="mt-6 w-full overflow-x-auto">
          {visibleUsers.length === 0 ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
              <EmptyState />
            </div>
          ) : (
            <div className="mx-auto w-full max-w-full overflow-hidden rounded-[12px] border border-[#E5E7EB]">
              <table className="w-full text-left text-[13px] ">
                <thead className="bg-[#FAFAFC] overflow-x-auto">
                  <tr className="text-[13px] font-[700px]">
                    <th className="py-3 pl-4">First Name</th>
                    <th className="py-3">Last Name</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Role</th>
                    <th className="py-3">
                      <div className="flex items-start gap-1">
                        Date
                        <img src={Arrowdown} alt="Sort" className="mt-1 h-3 w-3" />
                      </div>
                    </th>
                    <th className="py-3 text-center ">Status</th>
                    <th className="py-3" />
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((entry) => (
                    <tr key={entry.email} className="items-center justify-center border-t border-slate-200 text-start ">
                      <td className="items-start py-1 pl-4 font-medium text-[#000]">{entry.firstName}</td>
                      <td className="py-1 font-medium text-[#000]">{entry.lastName}</td>
                      <td className="py-1 font-medium text-[#000]">{entry.email}</td>
                      <td className="py-1 text-[#000]">
                        <span className="rounded-full bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] py-1 px-3 text-[13px] !font-semibold text-[#000000]">
                          {entry.role}
                        </span>
                      </td>
                      <td className="py-1 text-[#000]">{entry.date}</td>
                      <td className="py-1 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#5CFFAB33] px-3 py-1 text-xs !font-semibold text-[#000000]">
                          <span className="h-1 w-1 rounded-full bg-[#248A3D]" />
                          {entry.status}
                        </span>
                      </td>
                      <td className="py-1 text-right">
                        <button className="rounded-full p-2 hover:bg-slate-100">
                          <ArrowIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div> */}

      <InviteUserModal
        open={isInviteOpen}
        onClose={() => setInviteOpen(false)}
      />
    </div>
  );
};

export default UsersTable;
