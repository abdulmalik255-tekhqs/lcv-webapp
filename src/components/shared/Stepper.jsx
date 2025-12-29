import clsx from "clsx";

const Stepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex flex-col gap-2 mb-6 !mt-[4px]">
      <div className="text-center text-[13px] font-normal text-[#48484A] pb-[24px]">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isActive = step <= currentStep;
          
          return (
            <div
              key={step}
              className={clsx(
                "flex-1 h-1 rounded-full transition-all duration-300 ",
                isActive
                  ? "bg-gradient-to-r from-[#0734A9] via-[#0E1696] to-[#4B0792]"
                  : "bg-[#F2F2F7]"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

