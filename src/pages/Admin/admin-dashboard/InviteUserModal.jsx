import Heading from "@/components/shared/heading";
import SubHeading from "@/components/shared/subheading";
import { useState } from "react";
import InputField from "@/components/shared/InputField";
import Dropdown from "@/components/shared/Dropdown";
import Button from "@/components/shared/button";
import { FieldCross } from "@/assets";
import { useCreateInvitation, useGetRoles } from "@/api";
import useToast from "@/hooks/useCustomToast";

const InviteUserModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [success, setSuccess] = useState(false);
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const createInvitation = useCreateInvitation();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !roleId) return;

    try {
      await createInvitation.mutateAsync({
        email,
        role_id: roleId,
      });
      setSuccess(true);
      showSuccessToast("Invitation sent successfully!");
      setTimeout(() => {
        setSuccess(false);
        setEmail("");
        setRoleId("");
        onClose?.();
      }, 1800);
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message || "Failed to send invitation"
      );
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail("");
    setRoleId("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[14px] bg-white py-8 px-16">
        <div className="mb-8 text-center">
          <Heading>Invite User</Heading>
          <SubHeading>
            {" "}
            Send an invitation to a new user. They will receive an email with
            instructions to join.
          </SubHeading>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            hideLabel
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            clearButton={email ? <FieldCross /> : null}
            onClear={() => setEmail("")}
          />

          <Dropdown
            label="Role"
            hideLabel
            options={
              roles?.map((role) => ({
                label: role.title,
                value: role.id,
              })) || []
            }
            selectedValue={roleId}
            onChange={(value) => setRoleId(value)}
            placeholder={isLoadingRoles ? "Loading roles..." : "Role"}
            disabled={isLoadingRoles}
          />
          <div className="mt-6 flex flex-col gap-3">
            <Button
              type="submit"
              variant="gradient"
              className="h-10"
              disabled={createInvitation.isPending}
            >
              {createInvitation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="!rounded-full h-10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
