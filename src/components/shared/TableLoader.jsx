const TableLoader = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#E5E5EA] border-t-[#0734A9] rounded-full animate-spin"></div>
        </div>
        <p className="text-[15px] font-medium text-[#48484A]">{message}</p>
      </div>
    </div>
  );
};

export default TableLoader;

