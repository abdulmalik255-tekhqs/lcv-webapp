import SubHeading from "@/components/shared/subheading";
import ShareHoldersDetialsCard from "./IssuersDetialsCard";
import ShareHoldersDetialsTable from "./IssuersDetialsTable";

function IssuersDetails() {
  return (
    <div className="border rounded-tr-[24px] min-h-[calc(100vh-100px)] p-4 sm:p-6">
      <div className="text-start px-5 pt-5 pb-2  text-[24px] bg-[#FFFFFF]  font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000]">
        TechCorp Inc.
      </div>
      <SubHeading className="text-start !py-0 pl-5">
        {" "}
        Issuer account details and activity.
      </SubHeading>
      <div className="p-4">
        <ShareHoldersDetialsCard />
        <ShareHoldersDetialsTable />
      </div>
    </div>
  );
}

export default IssuersDetails;
