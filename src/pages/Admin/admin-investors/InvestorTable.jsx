import { EmptyState, SearchBar } from "@/components/shared";
import { useMemo, useState, useEffect } from "react";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import arrowDown from "../../../assets/admin-assets/arrowDown.svg";
import ActionMenuDropdown from "./ActionMenuDropdown";
import DeleteInvestorModal from "./modals/DeleteInvestorModal";
import DisableInvestorModal from "./modals/DisableInvestorModal";
import RevokeInvestorModal from "./modals/RevokeInvestorModal";
import SuspendInvestorModal from "./modals/SuspendInvestorModal";
import useToast from "@/hooks/useCustomToast";
import { useGetKYCUsers } from "@/api/kyc/useGetKYCUsers";
import { useChangeKYCStatus } from "@/api/kyc/useChangeKYCStatus";
import { KYC_STATUS } from "@/constants/kyc";
import { useQueryClient } from "@tanstack/react-query";

const FILTERS = [
  { id: "in_review", label: "In Review", apiStatus: KYC_STATUS.INREVIEW },
  { id: "approved", label: "Approved", apiStatus: KYC_STATUS.APPROVED },
  { id: "rejected", label: "Rejected", apiStatus: KYC_STATUS.REJECTED },
];

function InvestorTable() {
  const [activeFilter, setActiveFilter] = useState(FILTERS[0].id); // Default to first filter (In Review)
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const navigate = useNavigate();
  const { showBottomRightToast, showErrorToast } = useToast();

  // Modal states
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Get current filter's API status
  const currentFilter = FILTERS.find((f) => f.id === activeFilter);
  const apiStatus = currentFilter?.apiStatus || KYC_STATUS.INREVIEW;

  // Fetch KYC users based on active filter
  const {
    data: kycUsersData,
    isLoading,
    refetch,
  } = useGetKYCUsers(apiStatus, page, limit);

  // Use the fetched data
  const finalKycUsersData = kycUsersData;

  // Debug: Log data changes
  useEffect(() => {
    console.log("Active Filter:", activeFilter);
    console.log("API Status:", apiStatus);
    console.log("KYC Users Data:", kycUsersData);
    console.log("Final KYC Users Data:", finalKycUsersData);
  }, [activeFilter, apiStatus, kycUsersData, finalKycUsersData]);

  // Reset page when filter changes
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  // Change KYC status mutation
  const changeKYCStatusMutation = useChangeKYCStatus();
  const queryClient = useQueryClient();

  // Refetch function that works for both cases
  const refetchData = () => {
    // Invalidate all KYC users queries to refetch data
    queryClient.invalidateQueries({ queryKey: ["kyc-users"] });
  };

  // Transform API data to match table structure
  const transformedInvestments = useMemo(() => {
    if (!finalKycUsersData?.data || !Array.isArray(finalKycUsersData.data))
      return [];

    return finalKycUsersData.data.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      profile_pic: user.profile_pic,
      status: user.kyc?.status || "In Review",
      kyc_id: user.kyc?.id,
      kyc_data: user.kyc,
      assetsHeld: "-", // Not available in API response
      totalTokens: "-", // Not available in API response
      totalValue: "-", // Not available in API response
      l_heading: user.kyc?.id ? `KYC-${user.kyc.id.slice(0, 5)}` : "N/A",
      updated_at: user.kyc?.updated_at || user.kyc?.created_at,
    }));
  }, [finalKycUsersData]);

  // Filter by search term
  const visibleInvestments = useMemo(() => {
    if (!searchTerm.trim()) return transformedInvestments;

    const term = searchTerm.toLowerCase();
    return transformedInvestments.filter(
      (investment) =>
        investment.name?.toLowerCase().includes(term) ||
        investment.email?.toLowerCase().includes(term) ||
        investment.l_heading?.toLowerCase().includes(term)
    );
  }, [transformedInvestments, searchTerm]);

  // Calculate filter counts - fetch counts for each filter
  const { data: inReviewCountData } = useGetKYCUsers(KYC_STATUS.INREVIEW, 1, 1);
  const { data: approvedCountData } = useGetKYCUsers(KYC_STATUS.APPROVED, 1, 1);
  const { data: rejectedCountData } = useGetKYCUsers(KYC_STATUS.REJECTED, 1, 1);

  const filterCounts = useMemo(() => {
    const base = {};
    FILTERS.forEach((filter) => {
      if (filter.id === "in_review") {
        base[filter.id] = inReviewCountData?.total || 0;
      } else if (filter.id === "approved") {
        base[filter.id] = approvedCountData?.total || 0;
      } else if (filter.id === "rejected") {
        base[filter.id] = rejectedCountData?.total || 0;
      } else {
        base[filter.id] =
          activeFilter === filter.id ? finalKycUsersData?.total || 0 : 0;
      }
    });
    return base;
  }, [
    inReviewCountData,
    approvedCountData,
    rejectedCountData,
    finalKycUsersData,
    activeFilter,
  ]);

  // Action handlers
  const handleResendInvitation = (investor) => {
    showBottomRightToast(
      "Invitation resent to Pinnacle Asset Management",
      "An email has been sent to swalsh@pinnacle.com."
    );
  };

  const handleInviteToKYC = (investor) => {
    showBottomRightToast(
      "Invitation resent to Pinnacle Asset Management",
      "An email has been sent to swalsh@pinnacle.com."
    );
  };

  const handleReactivate = (investor) => {
    showBottomRightToast("Investor reactivated successfully!");
  };

  const handleDelete = (investor) => {
    setSelectedInvestor(investor);
    setIsDeleteModalOpen(true);
  };

  const handleDisable = (investor) => {
    setSelectedInvestor(investor);
    setIsDisableModalOpen(true);
  };

  const handleRevoke = (investor) => {
    setSelectedInvestor(investor);
    setIsRevokeModalOpen(true);
  };

  const handleSuspend = (investor) => {
    setSelectedInvestor(investor);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement actual delete logic
    showBottomRightToast("Investor deleted successfully!");
    setSelectedInvestor(null);
  };

  const handleConfirmDisable = () => {
    // TODO: Implement actual disable logic
    showBottomRightToast("Investor disabled successfully!");
    setSelectedInvestor(null);
  };

  const handleConfirmRevoke = () => {
    // TODO: Implement actual revoke logic
    showBottomRightToast("Investor revoked successfully!");
    setSelectedInvestor(null);
  };

  const handleConfirmSuspend = () => {
    // TODO: Implement actual suspend logic
    showBottomRightToast("Investor suspended successfully!");
    setSelectedInvestor(null);
  };

  const handleRejected = async (investor) => {
    if (!investor?.kyc_id || !investor?.id) {
      showErrorToast("Invalid investor data");
      return;
    }

    try {
      await changeKYCStatusMutation.mutateAsync({
        user_id: investor.id,
        status: KYC_STATUS.REJECTED,
        remarks: "KYC Rejected",
      });
      showBottomRightToast("KYC rejected successfully!");
      refetchData();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to reject KYC");
    }
  };

  const handleApproved = async (investor) => {
    if (!investor?.kyc_id || !investor?.id) {
      showErrorToast("Invalid investor data");
      return;
    }

    try {
      await changeKYCStatusMutation.mutateAsync({
        user_id: investor.id,
        status: KYC_STATUS.APPROVED,
        remarks: "KYC Approved",
      });
      showBottomRightToast("KYC approved successfully!");
      refetchData();
    } catch (error) {
      showErrorToast(error?.response?.data?.message || "Failed to approve KYC");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:py-[40px] md:px-[25px] bg-[#FFF]">
      <div className="font-['Atacama'] text-[20px] font-normal text-[#0A0A0A] mb-4">
        KYC Users Table
      </div>
      <div className="px-[15px] flex flex-col items-start  gap-[24px]">
        <div className="border-none !p-0 mb-6 w-full">
          <div className="flex flex-col  gap-4">
            <div className="flex flex-wrap items-center gap-2 ">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition ${
                    activeFilter === filter.id
                      ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
                      : "bg-white border text-[#000] font-semibold hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                  {/* <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px]  ${
                      activeFilter === filter.id
                        ? "bg-white text-black"
                        : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]"
                    }`}
                  >
                    {filterCounts[filter.id] || 0}
                  </span> */}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-1  ">
              <button className="flex items-center gap-2 text-[13px] font-medium text-[#000] hover:opacity-80 transition">
                Export CSV
                <HiArrowTopRightOnSquare className="h-4 w-4" />
              </button>
              <div className="w-full md:w-[70%] ">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search opportunities"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[#E5E5EA] overflow-hidden ">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-[#48484A] text-[15px]">Loading...</div>
            </div>
          ) : visibleInvestments.length === 0 ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
              <EmptyState />
            </div>
          ) : (
            <table className="w-full text-left text-[13px] border border-[#E5E5EA] z-10 ">
              <thead className="rounded-t-[10px] border-t border-r border-l border-[#F2F2F7] bg-[#FAFAFC]">
                <tr className="text-[#000] font-[700] text-[13px]">
                  <th className="px-4 py-3 text-left">Investor</th>
                  <th className="px-4 py-3 text-left">Assets Held</th>
                  <th className="px-4 py-3 text-left">Total Tokens</th>
                  <th className="px-4 py-3 text-left">Total Value</th>
                  <th className="px-4 py-3 text-left flex gap-1 items-center">
                    Latest Update{" "}
                    <span>
                      <img src={arrowDown} alt="" className="w-3 h-3" />
                    </span>{" "}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className=" border-t-[0.5px] border-light-gray-5 bg-white">
                {visibleInvestments.map((investment, index) => {
                  const handleRowClick = () => {
                    // Navigate to investor details page
                    // You may want to adjust this route based on your routing structure
                    navigate(`/admin/investors/${investment.id}`);
                  };

                  return (
                    <tr
                      key={`${investment.id}-${index}-${investment.name}`}
                      className="hover:bg-gray-50 cursor-pointer py-[10px] ps-[6px] pe-[15px]"
                      onClick={handleRowClick}
                    >
                      <td className="px-4 py-5">
                        <div className="flex  px-[15px] py-[10px] gap-[7px]">
                          <div className="flex w-5 h-5 flex-col justify-center items-center  rounded-[99px] border border-[#F2F2F7] bg-[#FFF] font-[900]  ">
                            {investment.profile_pic ? (
                              <img
                                src={investment.profile_pic}
                                alt={investment.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-full">
                                {investment.name?.charAt(0)?.toUpperCase() ||
                                  "N"}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[#000] font-[500] text-[15px]">
                              {investment.name}
                            </div>
                            <div className="overflow-hidden text-ellipsis text-[#48484A] font-[400] text-[13px]">
                              {investment.email}
                            </div>
                            <div className="overflow-hidden text-ellipsis text-[#48484A] font-[400] text-[13px]">
                              {investment.l_heading}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="overflow-hidden text-ellipsis text-left ps-4 text-[#000] font-[500] text-[15px] ">
                        {investment.assetsHeld}
                      </td>

                      <td className="overflow-hidden text-ellipsis text-left ps-4 text-[#000] font-[500] text-[15px]">
                        {investment.totalTokens}
                      </td>
                      <td className="overflow-hidden text-ellipsis text-left ps-4 text-[#000] font-[500] text-[15px]">
                        {investment.totalValue}
                      </td>
                      <td className="px-4 py-5 text-[15px] text-[#000] font-[500] flex flex-col gap-[2px] w-fit items-end justify-start ">
                        <div
                          className={`flex h-6  px-[10px] justify-center items-center rounded-[99px] ${
                            investment.status === KYC_STATUS.INREVIEW
                              ? "bg-[rgba(68,174,255,0.2)]"
                              : investment.status === KYC_STATUS.APPROVED
                              ? "bg-[rgba(51,255,201,0.2)]"
                              : investment.status === KYC_STATUS.REJECTED
                              ? "bg-[rgba(255,112,115,0.2)]"
                              : ""
                          }`}
                        >
                          <span className="text-[#000] font-[500] text-[11px]">
                            {investment.status}
                          </span>
                        </div>
                        <p className="text-black text-right font-['Montserrat'] text-[15px] font-medium  ">
                          {investment.l_heading}
                        </p>
                        <p className="overflow-hidden text-[#48484A] text-right text-ellipsis font-['Montserrat'] text-[11px]">
                          {investment.updated_at
                            ? new Date(
                                investment.updated_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </td>

                      <td
                        className="rounded "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionMenuDropdown
                          investor={{
                            ...investment,
                            status: investment.status,
                          }}
                          onResendInvitation={() =>
                            handleResendInvitation(investment)
                          }
                          onDelete={() => handleDelete(investment)}
                          onInviteToKYC={() => handleInviteToKYC(investment)}
                          onDisable={() => handleDisable(investment)}
                          onRevoke={() => handleRevoke(investment)}
                          onSuspend={() => handleSuspend(investment)}
                          onReactivate={() => handleReactivate(investment)}
                          onRejected={() => handleRejected(investment)}
                          onApproved={() => handleApproved(investment)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteInvestorModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedInvestor(null);
        }}
        investor={selectedInvestor}
        onConfirm={handleConfirmDelete}
      />

      <DisableInvestorModal
        isOpen={isDisableModalOpen}
        onClose={() => {
          setIsDisableModalOpen(false);
          setSelectedInvestor(null);
        }}
        investor={selectedInvestor}
        onConfirm={handleConfirmDisable}
      />

      <RevokeInvestorModal
        isOpen={isRevokeModalOpen}
        onClose={() => {
          setIsRevokeModalOpen(false);
          setSelectedInvestor(null);
        }}
        investor={selectedInvestor}
        onConfirm={handleConfirmRevoke}
      />

      <SuspendInvestorModal
        isOpen={isSuspendModalOpen}
        onClose={() => {
          setIsSuspendModalOpen(false);
          setSelectedInvestor(null);
        }}
        investor={selectedInvestor}
        onConfirm={handleConfirmSuspend}
      />
    </div>
  );
}

export default InvestorTable;
