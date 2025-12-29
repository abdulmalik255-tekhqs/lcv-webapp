import SubHeading from "@/components/shared/subheading";
import ShareHoldersCard from "./ShareholdersCards";
import IssuersTable from "./ShareHoldersTable";

function RegistrarShareholdersSection() {
  return (
    <div className=" border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Shareholders
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Token holders across all assets on the platform.
          </SubHeading>
        </div>
      </div>

      <div className="px-4 ">
        <ShareHoldersCard />
      </div>
      <div className="px-4 ">
        <IssuersTable />
      </div>
    </div>
  );
}

export default RegistrarShareholdersSection;
