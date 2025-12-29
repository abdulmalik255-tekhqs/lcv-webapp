import { FaCopy } from "react-icons/fa6";
import Button from "@/components/shared/button";
import cantonIcon from "@/assets/admin-assets/canton.svg";
import exclamationIcon from "@/assets/admin-assets/action.svg";
import IssuerMintedTokenizationTimeline from "./IssuerMintedTokenizationTimeline";
import WalletAddress from "@/components/shared/WalletAddress";

function RightSidebar({
  asset,
  canPublishToMarketplace,
  onPublishClick,
}) {
  return (
    <div className="border-l border-[#E5E5EA] ">
      <div className=" rounded-lg  p-6">
        <div className="flex items-start gap-3 mb-4">
          <img
            src={exclamationIcon}
            alt="Exclamation Icon"
            className="w-5 h-5"
          />
          <h3 className="text-[15px] font-medium text-[#000] ">
            Publish to Marketplace
          </h3>
        </div>

        <p className="text-[13px] font-normal text-[#364153]">
          Confirm the details of your listing and publish it to make it
          available to investors.
        </p>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="gradient"
            onClick={onPublishClick}
            className="w-full h-[40px]"
            disabled={!canPublishToMarketplace}
          >
            Publish
          </Button>
        </div>
        <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
      </div>
      {/* Issuer Submission */}
      <div className=" rounded-lg  !px-6">
        <h3 className="text-[15px] font-medium text-[#000] mb-4 !font-['Montserrat']">
          Issuer Submission
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Company Name
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              TechCorp Inc.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">Email</p>
            <a
              href={`mailto:contact@techcorp.com`}
              className="text-[13px] font-medium text-[#0734A9] hover:underline"
            >
              contact@techcorp.com
            </a>
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Contact Phone
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              (415) 555-0123
            </p>
          </div> */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Registration Status
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 ">
              Active
            </span>
          </div>
        </div>
        <div className="mt-4 p-4 border border-[#E5E5EA] bg-gray-100 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Request ID
              </p>
              <div className="flex items-center gap-2 bg-white rounded border border-[#E5E5EA]">
                <div className="px-2 py-1 ">
                  <p className="text-[13px] font-medium text-[#000]">
                    REQ-2024-1159
                  </p>
                </div>
                <button
                  onClick={() => {
                    const requestId = asset.id
                      ? `REQ-${new Date(
                          asset.created_at || Date.now()
                        ).getFullYear()}-${String(asset.id).padStart(4, "0")}`
                      : "REQ-2024-1159";
                    navigator.clipboard.writeText(requestId);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy Request ID"
                >
                  <FaCopy className="w-3 h-3 text-[#48484A]" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Asset ID
              </p>
              <div className="flex items-center gap-2 bg-white rounded border border-[#E5E5EA]">
                <div className="px-2 py-1 ">
                  <p className="text-[13px] font-medium text-[#000]">
                    REQ-2024-1159
                  </p>
                </div>
                <button
                  onClick={() => {
                    const assetId = asset.id
                      ? `AST-${new Date(
                          asset.created_at || Date.now()
                        ).getFullYear()}-${String(asset.id).padStart(3, "0")}`
                      : "AST-2025-001";
                    navigator.clipboard.writeText(assetId);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copy Asset ID"
                >
                  <FaCopy className="w-3 h-3 text-[#48484A]" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Submission Date
              </p>
              <p className="text-[13px] font-medium text-[#000]">
                {asset.created_at
                  ? new Date(asset.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Dec 5, 2025"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-[#000]">
                Approved Date
              </p>
              <p className="text-[13px] font-medium text-[#000]">
                {asset.approved_at || asset.updated_at
                  ? new Date(
                      asset.approved_at || asset.updated_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Dec 6, 2025"}
              </p>
            </div>
          </div>
          <hr className="border-t border-[#E5E5EA] my-4"></hr>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Asset Approved and Ready to be Minted
            </p>
            <span className="px-3 py-1 bg-[#83F63B33] border border-[#83F63B33] rounded-full text-[11px] font-medium text-[#000]">
              Approved
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <p className="text-[11px] font-medium text-[#000]">
            Available Treasury
          </p>
          <p className="text-[13px] font-medium text-[#000]">
            50,000 Tokens
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">
            Initial Treasury
          </p>
          <p className="text-[13px] font-medium text-[#000]">
            50,000 Tokens
          </p>
        </div>
        <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
      </div>

      {/* Blockchain Transaction */}
      <div className=" rounded-lg  !px-6 pt-6">
        <h3 className="text-[15px] font-medium text-[#000] mb-2  !font-['Montserrat']">
          Blockchain Transaction
        </h3>

        <div className="space-y-3">
          
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Contract Address
            </p>
            <div className="flex items-center gap-2 bg-white rounded border border-[#E5E5EA]">
              
                <WalletAddress
                  value={asset.asset_contract_id}
                />
           
            </div>
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Transaction Hash
            </p>
            <div className="flex items-center gap-2 bg-white rounded border border-[#E5E5EA]">
              <div className="px-2 py-1 ">
                <p className="text-[13px] font-medium text-[#000]">
                  0x7d4S..34D7
                </p>
              </div>
              <button
                onClick={() => {
                  const requestId = asset.id
                    ? `0xTh47..Df4y${new Date(
                        asset.created_at || Date.now()
                      ).getFullYear()}-${String(asset.id).padStart(4, "0")}`
                    : "0xTh47..Df4y";
                  navigator.clipboard.writeText(requestId);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Contract Address"
              >
                <FaCopy className="w-3 h-3 text-[#48484A]" />
              </button>
            </div>
          </div> */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Timestamp
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              Dec 2, 2024, 2:34 PM
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Initial Mint
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {asset.initial_mint || "Not Provided"} Tokens
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Total Supply
            </p>
            <p className="text-[13px] font-medium text-[#000]">
              {asset.total_supply || "Not Provided"} Tokens
            </p>
          </div>
          {/* <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">
              Block Number
            </p>
            <div className="flex items-center gap-2 bg-white rounded border border-[#E5E5EA]">
              <div className="px-2 py-1 ">
                <p className="text-[13px] font-medium text-[#000]">
                  0xTh47..Df4y
                </p>
              </div>
              <button
                onClick={() => {
                  const requestId = asset.id
                    ? `0xTh47..Df4y${new Date(
                        asset.created_at || Date.now()
                      ).getFullYear()}-${String(asset.id).padStart(4, "0")}`
                    : "0xTh47..Df4y";
                  navigator.clipboard.writeText(requestId);
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copy Contract Address"
              >
                <FaCopy className="w-3 h-3 text-[#48484A]" />
              </button>
            </div>
          </div> */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-[#000]">Network</p>
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-medium text-[#000]">
                Canton
              </p>
              <img
                src={cantonIcon}
                alt="Canton Icon"
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>
        <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
      </div>

      {/* Tokenization Timeline */}
      <div className="!px-6 pt-6">
        <IssuerMintedTokenizationTimeline currentStep={3} />
      </div>
    </div>
  );
}

export default RightSidebar;

