import { useState } from "react";
import Button from "@/components/shared/button";
import GenericModal from "@/components/shared/GenericModal";
import Dropdown from "@/components/shared/Dropdown";
import { useGetRegistrars } from "@/api";
import { TableLoader } from "@/components/shared";

const AssignRegistrarModal = ({ isOpen, onClose, onAssign, assetId }) => {
  const [selectedRegistrarId, setSelectedRegistrarId] = useState("");
  const { data: registrarsData, isLoading, isError } = useGetRegistrars();

  // Transform registrars data to dropdown options
  // React Query returns response.data, so registrarsData is the array directly
  const registrarsList = Array.isArray(registrarsData) ? registrarsData : [];
  
  const registrarOptions = registrarsList.map((registrar) => ({
    value: registrar.id,
    label: `${registrar.first_name} ${registrar.last_name} (${registrar.email})`,
  }));

  const handleAssign = () => {
    if (!selectedRegistrarId) {
      return;
    }
    onAssign(selectedRegistrarId);
  };

  const handleClose = () => {
    setSelectedRegistrarId("");
    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Registrar"
      subheader="Select a registrar to review this asset tokenization request."
      zIndex="z-[70]"
    >
      {isLoading ? (
        <div className="py-8">
          <TableLoader message="Loading registrars..." />
        </div>
      ) : isError ? (
        <div className="py-8 text-center">
          <p className="text-red-500 text-sm">
            Failed to load registrars. Please try again.
          </p>
        </div>
      ) : registrarOptions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 text-sm">No registrars available.</p>
        </div>
      ) : (
        <>
        <div className="p-4">
        <div className="mb-6 p-2 h-[300px] overflow-y-auto">
            <Dropdown
              label="Select Registrar"
              options={registrarOptions}
              selectedValue={selectedRegistrarId}
              onChange={setSelectedRegistrarId}
              placeholder="Choose a registrar..."
              required={true}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="h-[40px] flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleAssign}
              disabled={!selectedRegistrarId}
              className="h-[40px] flex-1"
            >
              Assign Registrar
            </Button>
          </div>
        </div>
          
        </>
      )}
    </GenericModal>
  );
};

export default AssignRegistrarModal;

