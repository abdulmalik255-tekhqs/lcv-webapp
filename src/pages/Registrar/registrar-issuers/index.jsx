import SubHeading from "@/components/shared/subheading";
import IssuersCard from "./IssuersCards";
import IssuersTable from "./IssuersTable";

function RegistrarIssuersSection() {
  return (
    <div className=" border rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between bg-[#FFFFFF] rounded-tr-[24px] px-5 pt-6 ">
        <div className="pl-4 mt-2 mb-2">
          <div className="text-start text-[32px] font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
            Issuers
          </div>
          <SubHeading className="text-start !py-0 mt-[10px] !text-[#000]">
            Manage and monitor issuer accounts
          </SubHeading>
        </div>
      </div>
     

      <div className="px-4 ">
        <IssuersCard />
      </div>
      <div className="px-4 ">
        <IssuersTable />
      </div>
    </div>
  );
}

export default RegistrarIssuersSection;
