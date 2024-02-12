import React, { useEffect, useState, useRef } from 'react';
import hamburgerMenu from "../assets/menuHamburger.svg";
import logoIcon from "../assets/logoIcon.svg";
import closeIcon from "../assets/closeIcon.svg";
import { featureSubmenu } from '../data/data';
import FeatureSubmenuLinkItem from './ui/FeatureSubmenuLinkItem';
import NavItem from './ui/NavLink';
// import Link from 'next/link'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  const submenuRef = useRef(null);

  const handleItemClick = (index) => {
    setClickedItem(index);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setClickedItem(null);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className='md:flex md:justify-between md:gap-6 md:items-center'>
      <a href="/"><img className='hidden md:block md:w-[138px] md:h-[38px]' src={logoIcon} alt="playroom logo" /></a>
      <div className='flex justify-between items-center border-[#3F3F48] border-[1px] md:hidden bg-[#0F0F10] md:text-center md:w-1/2 mx-auto mt-6 px-10 py-6 rounded-full'>
        <a href="/"><img className='md:hidden' src={logoIcon} alt="playroom logo" /></a>
        {!isOpen && <img onClick={() => setIsOpen(true)} className='md:hidden h-[13px] w-[20px]' src={hamburgerMenu} alt="hamburger menu" />}
        {isOpen && <img onClick={() => setIsOpen(false)} className='md:hidden h-[30px] w-[20px]' src={closeIcon} alt="close icon" />}
      </div>
      {isOpen && (
        <ul
          ref={submenuRef}
          className='flex py-6 md:py-4 flex-col md:w-[70%] lg:w-auto lg:relative lg:right-24 lg:mx-auto cursor-pointer gap-6 md:flex md:flex-row md:gap-0 text-[1.4rem] bg-[#0F0F10] mt-6 md:mt-0 p-6 md:rounded-full md:justify-between mx-auto rounded-[18px] border-[0.67px] border-primaryBorderColor px-12'
        >
          <NavItem itemIndex={1} handleItemClick={handleItemClick} clickedItem={clickedItem}>
            Development Kit
          </NavItem>
          <a href="/pricing">
            <NavItem itemIndex={2} handleItemClick={handleItemClick} clickedItem={clickedItem}>
            Pricing
            </NavItem>
          </a>
          <li
            onMouseEnter={() => handleItemClick(3)}
            className={`rounded-full my-3 md:my-0 relative hover:text-[#efefefc8] border-[1px] border-lightBlack transition-colors duration-150 md:p-2 md:py-4 md:px-6 lg:py-5 lg:px-11 ${clickedItem === 3 ? 'md:border-[#8C72F4]' : ''}`}
          >
            <a href="/features">Features</a>
            {clickedItem === 3 && (
              <div
                className='featureMenu absolute w-[500px] h-fit rounded-2xl right-[-20rem] hidden md:block border-[#3F3F48] border-[0.67px] top-[6.5rem] p-10 md:grid grid-cols-2 gap-14 lg:p-16'
              >
                {featureSubmenu.map((feature, index) => (
                  <FeatureSubmenuLinkItem key={index} title={feature.title} description={feature.description} />
                ))}
              </div>
            )}
          </li>
          <NavItem itemIndex={4} handleItemClick={handleItemClick} clickedItem={clickedItem}>
            Partners
          </NavItem>
          <a href="/resources">
            <NavItem itemIndex={5} handleItemClick={handleItemClick} clickedItem={clickedItem}>
            Resources
            </NavItem>
          </a>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
