import UserCards from "./UsersCards";
import IssuanceQueue from "./IssuanceQueue";
import TokenizationRequests from "./TokenizationRequests";

function AdminDashboardSection() {
  return (
    <div className=" border border-s-gray-200 rounded-tr-[24px] min-h-[calc(100vh-100px)]">
      <UserCards />
      <div className="md:px-[30px] md:py-0  md:pb-[30px] flex flex-row border border-t-[#E5E5EA]  gap-6">
        <div className=" rounded-lg p-4 md:p-4 w-1/2  bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.08)] ">
          <TokenizationRequests />
        </div>
        <div className=" rounded-lg p-4 md:p-4 w-1/2  bg-white shadow-[0_0_30px_0_rgba(0,0,0,0.08)] ">
          <IssuanceQueue />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardSection;
