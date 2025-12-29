import { useState } from "react";
import { useGetInvitations, useCancelInvitation } from "@/api";
import { EmptyState } from "@/components/shared";
import useToast from "@/hooks/useCustomToast";

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    className="text-red-500"
  >
    <path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InvitationsTable = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useGetInvitations(page, limit);
  const cancelInvitation = useCancelInvitation();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to cancel this invitation?")) {
      try {
        await cancelInvitation.mutateAsync(id);
        showSuccessToast("Invitation cancelled successfully");
      } catch (error) {
        showErrorToast(
          error?.response?.data?.message || "Failed to cancel invitation"
        );
      }
    }
  };

  const invitations = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="py-6 px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">
            Invitations
          </h2>
          <p className="text-sm text-[#4A5565]">
            Manage user invitations
          </p>
        </div>
      </div>

      <div className="border-none bg-white !p-0 mt-5">
        <div className="mt-6 w-full overflow-x-auto">
          {isLoading ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
              <div className="text-center text-[#4A5565]">Loading...</div>
            </div>
          ) : error ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white p-8">
              <div className="text-center text-red-500">
                Error loading invitations
              </div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="mx-auto w-full max-w-full rounded-[12px] border border-dashed border-[#CBD5F5] bg-white">
              <EmptyState />
            </div>
          ) : (
            <>
              <div className="mx-auto w-full max-w-full overflow-hidden rounded-[12px] border border-[#E5E7EB]">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#FAFAFC] overflow-x-auto">
                    <tr className="text-[13px] font-[700px]">
                      <th className="py-3 pl-4">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Invited At</th>
                      <th className="py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr
                        key={invitation.id}
                        className="items-center justify-center border-t border-slate-200 text-start"
                      >
                        <td className="items-start py-1 pl-4 font-medium text-[#000]">
                          {invitation.email}
                        </td>
                        <td className="py-1 text-[#000]">
                          <span className="rounded-full bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] py-1 px-3 text-[13px] !font-semibold text-[#000000]">
                            {invitation.role}
                          </span>
                        </td>
                        <td className="py-1 text-[#000]">
                          {formatDate(invitation.invited_at)}
                        </td>
                        <td className="py-1 text-center">
                          <button
                            onClick={() => handleDelete(invitation.id)}
                            disabled={cancelInvitation.isPending}
                            className="rounded-full p-2 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cancel Invitation"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-full px-4 py-2 text-sm font-medium border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#4A5565]">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-full px-4 py-2 text-sm font-medium border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationsTable;

