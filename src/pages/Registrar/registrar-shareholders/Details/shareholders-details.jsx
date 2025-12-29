import SubHeading from "@/components/shared/subheading";
import ShareHoldersDetialsCard from "./ShareHoldersDetialsCard";
import ShareHoldersDetialsTable from "./ShareHoldersDetialsTable";

function ShareholdersDetails() {
  return (
    <div>
      <div className="text-start pl-5 pt-6 text-[24px] bg-[#FFFFFF]  font-normal font-['Atacama'] leading-[120%] tracking-[0.48px] text-[#000] rounded-tr-[24px]">
        Morgan Stanley Wealth
      </div>
      <SubHeading className="text-start !py-0 pl-5">
        {" "}
        Institutional shareholder account details and activity.
      </SubHeading>
      <div className="p-4">
        <ShareHoldersDetialsCard />
        <ShareHoldersDetialsTable />
      </div>
    </div>
  );
}

export default ShareholdersDetails;
