import React, { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import ClickAwayListener from 'react-click-away-listener';

const TabButton = ({
  filter,
  activeFilter,
  setActiveFilter,
  filterCounts,
  menuList = [],
}) => {
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  return (
    <div key={filter.id} className='relative'>
      <button
        onClick={() => setActiveFilter(filter.id)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] transition ${
          activeFilter === filter.id
            ? 'bg-gradient-to-tr from-[#0734A9] via-[#0E1696] to-[#4B0792] font-semibold text-white'
            : 'bg-white border text-[#000] font-semibold hover:bg-slate-200'
        }`}
      >
        {filter.label}
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
            activeFilter === filter.id
              ? 'bg-white text-black'
              : 'bg-[linear-gradient(135deg,rgba(155,60,255,0.15)_0%,rgba(45,103,255,0.15)_100%)] text-[#000]'
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
          <div className='absolute left-0 top-full mt-1 w-[360px] bg-white border border-gray-200  shadow-lg z-10 rounded-[15px] '>
            <div className='py-1'>
              <button
                className='w-full text-left flex px-6 items-center justify-between  py-2 text-sm text-gray-700 hover:bg-gray-100'
                onClick={e => {
                  e.stopPropagation();
                  console.log(`Approve all ${filter.label}`);
                }}
              >
                <p className='text-[15px]'>All</p>
                <p className='text-[15px]'>1</p>
              </button>
              <div className='border-b border-[#D1D1D6] my-3 mx-6'></div>
              {menuList.map(item => (
                <button
                  className='w-full text-left flex px-6 items-center justify-between  py-2 text-sm text-gray-700 hover:bg-gray-100'
                  onClick={e => {
                    e.stopPropagation();
                    console.log(`${item.label} ${filter.label}`);
                  }}
                >
                  <p className='text-[15px]'>{item.label}</p>
                  <p className='text-[15px]'>{item.count}</p>
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
