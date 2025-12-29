import React from 'react';
import { FaArrowRight, FaCheck } from 'react-icons/fa6';

const PurchaseRequestTimeline = () => {
  const steps = [
    {
      id: 1,
      label: 'Purchase Request Submitted',
      referenceNumber: 'PUR-2025-042',
      date: 'Dec 1, 2025',
      completed: true,
    },
    {
      id: 2,
      label: 'Issuer Verified',
      status: 'Action Required',
      isCurrent: true,
    },
    {
      id: 3,
      label: 'Send to Registrar',
      completed: false,
    },
    {
      id: 4,
      label: 'Tokens Issued',
      completed: false,
    },
  ];
  return (
    <div className='space-y-4'>
      <span className="text-[15px] font-medium text-[#000] !font-['Montserrat']">
        Purchase Request Timeline
      </span>
      <div className='relative'>
        {/* Vertical line */}
        <div className='absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200'></div>

        {steps.map(step => {
          const isStepCompleted = step.completed;
          const isCurrent = step.isCurrent && !isStepCompleted;
          const isFuture = !isStepCompleted && !isCurrent;

          return (
            <div
              key={step.id}
              className='relative flex items-start gap-4 pb-6 last:pb-0'
            >
              {/* Icon */}
              <div className='relative z-16 flex-shrink-0'>
                {isStepCompleted ? (
                  <div className='w-6 h-6 rounded-full bg-[#0734A9] flex items-center justify-center'>
                    <FaCheck className='w-3 h-3 text-white' />
                  </div>
                ) : isCurrent ? (
                  <div className='w-6 h-6  rounded-full !bg-white !border-2 !border-[#0734A9] flex items-center justify-center'>
                    <FaArrowRight className='w-3 h-3 text-[#0734A9]' />
                  </div>
                ) : (
                  <div className='w-6 h-6 rounded-full !bg-white !border-2 !border-gray-300 flex items-center justify-center'>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className='flex-1 '>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium text-[#000]'>
                    {step.label}
                  </p>
                </div>
                {step.referenceNumber && (
                  <p className='text-xs text-gray-600 mt-1'>{step.referenceNumber}</p>
                )}
                {step.date && (
                  <p className='text-xs text-gray-600 mt-1'>{step.date}</p>
                )}
                {step.status && (
                  <p className='text-xs text-[#0734A9] font-medium mt-1'>
                    {step.status}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PurchaseRequestTimeline;
