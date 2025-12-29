import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import GenericModal from '@/components/shared/GenericModal';
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
import { Button, Card } from '@/components/shared';
import axiosInstance from '@/api/axiosInstance';
import urls from '@/constants/urls';
import useToast from '@/hooks/useCustomToast';

const DenyRequestModal = ({ isOpen, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showBottomRightToast: showSuccessToast, showErrorToast } = useToast();
  const [selectedReasons, setSelectedReasons] = useState(new Set());
  const [additionalComments, setAdditionalComments] = useState('');

  const reasons = [
    'Unclear or illegible document',
    'Payment amount does not match',
    'Transaction reference missing',
    'Payment not received',
    'Suspected fraud',
    'Other',
  ];

  const rejectOrderMutation = useMutation({
    mutationFn: ({ purchaseRequestId, rejectionRemarks, rejectionReason }) => {
      return axiosInstance.put(urls.ASSETS.REJECT_ORDER(purchaseRequestId), {
        rejection_remarks: rejectionRemarks,
        rejection_reason: rejectionReason,
      });
    },
    onSuccess: () => {
      showSuccessToast('Purchase request rejected successfully');
      onClose();
      navigate('/issuer/purchase-requests');
    },
    onError: (error) => {
      showErrorToast(
        error?.response?.data?.message || 'Failed to reject purchase request'
      );
    },
  });

  const handleToggleReason = reason => {
    setSelectedReasons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reason)) {
        newSet.delete(reason);
      } else {
        newSet.add(reason);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (selectedReasons.size === 0 && !additionalComments.trim()) {
      showErrorToast('Please select at least one reason or provide additional comments');
      return;
    }

    if (!id) {
      showErrorToast('Purchase request ID is missing');
      return;
    }

    const rejectionRemarks = Array.from(selectedReasons).join(', ');
    const rejectionReason = additionalComments.trim() || 'No additional comments provided';

    rejectOrderMutation.mutate({
      purchaseRequestId: id,
      rejectionRemarks,
      rejectionReason,
    });
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title='Deny Request'
      subheader='Provide a reason for denying this purchase request. The Investor will be notified and may resubmit.'
    >
       <Card className="h-[410px] max-h-[430px] overflow-y-auto scrollbar-hide">

        <div
          
        >
          <p className='text-[15px] text-black font-medium'>
            Reasons for Denial
          </p>
          <div className='border-b border-b-[#000000] my-[15px]'></div>
          <div className='flex flex-col gap-[15px]'>
            {reasons.map((reason, index) => {
              const isSelected = selectedReasons.has(reason);
              return (
                <div
                  key={index}
                  className='flex items-center gap-2.5 cursor-pointer'
                  onClick={() => handleToggleReason(reason)}
                >
                  {isSelected ? (
                    <MdCheckBox className='w-4 h-4 text-[#000000] flex-shrink-0' />
                  ) : (
                    <MdCheckBoxOutlineBlank className='w-4 h-4 text-[#AEAEB2] flex-shrink-0' />
                  )}
                  <p className='text-[13px] text-black font-medium'>{reason}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className='w-full whiteborder border-[#E5E5EA] p-[18px] pb-6 shadow-[0px_0px_30px_0px_rgba(0,0,0,0.08)] mt-[18px] rounded-xl'>
          <p className='text-[15px] text-black font-medium mb-[15px]'>
            Additional Comments
          </p>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            disabled={rejectOrderMutation.isPending}
            rows={4}
            className='w-full px-3 py-4 border border-[#0D4BEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D4BEF] focus:border-blue-700 text-[13px] font-normal text-[#000] resize-none bg-transparent'
            placeholder='Provide specific details about what needs to be addressed for resubmission.'
          />
        </div>
        <div className='grid grid-cols-2 gap-4 mt-[25px]'>
          <Button
            variant='secondary'
            size='sm'
            className='!h-[50px] !text-[17px] !px-20'
            onClick={onClose}
            disabled={rejectOrderMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size='sm'
            className='!h-[50px] !text-[17px] !px-2 bg-red-600 hover:!bg-red-700 !text-white'
            onClick={handleSubmit}
            disabled={rejectOrderMutation.isPending || (selectedReasons.size === 0 && !additionalComments.trim())}
          >
            {rejectOrderMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </Card>
    </GenericModal>
  );
};
export default DenyRequestModal;
