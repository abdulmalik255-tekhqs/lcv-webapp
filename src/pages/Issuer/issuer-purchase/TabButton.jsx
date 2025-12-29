import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { HiCheck } from 'react-icons/hi';
import ClickAwayListener from 'react-click-away-listener';

const TabButton = ({
  filter,
  activeFilter,
  setActiveFilter,
  filterCounts,
  menuList = [],
  onFilterSelect,
  selectedFilter,
  allCount,
  showAllOption = true,
}) => {
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const handleFilterSelect = (filterId) => {
    if (onFilterSelect) {
      onFilterSelect(filterId);
    }
    closeMenu();
  };

  return (
    <div key={filter.id} className='relative'>
      <button
        onClick={() => {
          setActiveFilter(filter.id);
          closeMenu();
        }}
        className={`flex items-center gap-2 rounded-full px-4 py-1 h-[42px] text-[13px] transition ${
          activeFilter === filter.id
            ? "bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white"
            : "bg-white border text-[#000] font-semibold hover:bg-[linear-gradient(135deg,rgba(155,60,255,0.06)_0%,rgba(45,103,255,0.06)_100%)] hover:text-[#000]"
        }`}
      >
        {filter.label}
        <span
          className={`flex h-5 items-center justify-center rounded-full px-[5px] text-[11px]  ${
            activeFilter === filter.id
              ? "bg-white text-black"
              : "bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000] hover:!bg-white hover:!bg-none"
          }`}
        >
          {filterCounts[filter.id] || 0}
        </span>

        {/* Down arrow for specific tabs */}
        {filter.showArrow && (
          <FaAngleDown
            className={`h-3 w-3 transition-transform ${
              menu ? 'rotate-180' : ''
            }`}
            onClick={e => {
              e.stopPropagation();
              toggleMenu();
            }}
          />
        )}
      </button>

      {/* Dropdown menu for pending and registrar_pending tabs */}
      {menu && (
        <ClickAwayListener onClickAway={closeMenu}>
          <div className='absolute left-0 top-full mt-2 bg-white border border-[#E5E5EA] rounded-lg shadow-lg z-50 min-w-[200px]'>
            <div className='py-1'>
              {showAllOption && (
                <>
                  <button
                    className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[13px] text-[#000]'
                    onClick={e => {
                      e.stopPropagation();
                      handleFilterSelect('all');
                    }}
                  >
                    <span>All</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#666]">
                        {allCount}
                      </span>
                      {selectedFilter === 'all' && (
                        <HiCheck className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                  {menuList.length > 0 && (
                    <div className='border-b border-[#D1D1D6] my-1 mx-4'></div>
                  )}
                </>
              )}
              {menuList.map(item => (
                <button
                  key={item.id}
                  className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[13px] text-[#000]'
                  onClick={e => {
                    e.stopPropagation();
                    handleFilterSelect(item.id);
                  }}
                >
                  <span>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#666]">
                      {item.count}
                    </span>
                    {selectedFilter === item.id && (
                      <HiCheck className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default TabButton;
