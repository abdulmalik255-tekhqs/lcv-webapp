import cantonIcon from "@/assets/admin-assets/canton.svg";
import { FaCopy } from "react-icons/fa6";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

// Format date

function PublishedBlockchainTransaction({ asset }) {

  return (
    <div className=" pt-8">
      <h3 className="text-[15px] font-medium text-[#000]  !font-['Montserrat']">
        Blockchain Transaction
      </h3>
      <div className="space-y-3 mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">
            Transaction Hash
          </p>
          <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
            <p className="text-[13px] font-medium text-[#000]">
              {asset?.transaction_hash ? `${asset.transaction_hash.substring(0, 6)}..${asset.transaction_hash.slice(-4)}` : "TBD"}
            </p>
            {asset?.transaction_hash && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(asset.transaction_hash);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <FaCopy className="w-3 h-3 text-[#000]" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Initial Mint</p>
          <p className="text-[13px] font-medium text-[#000]">
            {asset?.initial_mint ?? "Not Provided"} Tokens
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Total Supply</p>
          <p className="text-[13px] font-medium text-[#000]">
            {asset?.total_supply ?? "Not Provided"} Tokens
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Timestamp</p>
          <p className="text-[13px] font-medium text-[#000]">
            {asset?.updated_at ? asset.updated_at : "TBD"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">
            Contract Address
          </p>
          <div className="flex items-center gap-2 border border-[#E5E5EA] rounded-md p-1 bg-[#FAFAFC]">
            <p className="text-[13px] font-medium text-[#000]">
              {asset?.contract_address ? `${asset.contract_address.substring(0, 6)}..${asset.contract_address.slice(-4)}` : "TBD"}
            </p>
            {asset?.contract_address && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(asset.contract_address);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <FaCopy className="w-3 h-3 text-[#000]" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Block Number</p>
          <p className="text-[13px] font-medium text-[#000]">
            {asset?.block_number ? `#${asset.block_number}` : "TBD"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#000]">Network</p>
          <div className="flex items-center gap-1">
            <p className="text-[13px] font-medium text-[#000]">Canton</p>
            <img src={cantonIcon} alt="Canton Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="mt-4 !text-end !justify-end !items-end">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#0734A9] hover:underline text-[13px] font-medium justify-end items-end"
        >
          View on CantonScan
          <HiArrowTopRightOnSquare className="w-4 h-4" />
        </a>
      </div>
      <hr className="border-t border-[#E5E5EA] px-8 border-1 !mt-6"></hr>
    </div>
  );
}

export default PublishedBlockchainTransaction;

