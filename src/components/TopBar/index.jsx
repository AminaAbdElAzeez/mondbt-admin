import React, { useState } from 'react';
import { Switch } from 'antd';
import 'antd/dist/reset.css';
import { AnimatePresence, motion } from 'framer-motion';


function TopBar({ collapsed }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className={`
        bg-[#fff] px-4 py-3 fixed top-0 z-40 shadow-[0_0_7px_-1px_#07A869]
        transition-all duration-500
        ${
          collapsed
            ? 'right-0 sm:right-80 w-full sm:w-[calc(100%-320px)]'
            : 'right-0 sm:right-16 w-full sm:w-[calc(100%-64px)]'
        }
      `}
    >
      {/* mobile */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <h5 className="text-[#15445A] text-base hover:text-[#07A869] transition-colors p-0 m-0">
          اهلا معالي الوزير
        </h5>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`border-slate-300 dark:border-[#3e3e3e] dark:bg-[#151516] dark:text-white border border-solid  rounded-md shadow-md dark:shadow-black px-2 py-1 cursor-pointer bg-[#fff]`}
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg
            aria-hidden="true"
            className="w-6 h-6 text-[#07A869]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>

      {/* menu in mobile*/}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden lg:hidden"
          >
            <div className="flex flex-col items-center mt-3">
              <Switch
                checkedChildren="م"
                unCheckedChildren="هـ"
                defaultChecked
                style={{
                  backgroundColor: '#07A869',
                  border: '1px solid #07A869',
                }}
                className="big-switch mb-4"
              />
              <button className="cursor-pointer border border-[#C2C1C1] border-t-[#C2C1C1] border-b-[#C2C1C1] border-l-[#C2C1C1] border-r-[#C2C1C1] border-solid rounded-3xl py-2 px-4 text-[#C2C1C1] font-[500] text-sm bg-[#fff] hover:text-[#07A869] transition-colors duration-500 hover:border-[#07A869] mb-3">
                تسجيل الخروج
              </button>

              <p className="text-[#15445A] text-sm p-0 mb-2">
                <strong className="text-[#07A869] mx-1">الموافق:</strong> 2025/10/05
              </p>
              <p className="text-[#15445A] text-sm p-0 mb-3">
                <strong className="text-[#07A869] mx-1">الموافق:</strong> الاربعاء 1447/03/27
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*desktop */}
      <div className="hidden lg:flex flex-row-reverse justify-between items-center w-full">
        <div className="flex items-center gap-5">
          <h5 className="text-[#15445A] text-base hover:text-[#07A869] transition-colors duration-500 p-0 m-0">
            اهلا معالي الوزير
          </h5>
          <Switch
            checkedChildren="م"
            unCheckedChildren="هـ"
            defaultChecked
            style={{
              backgroundColor: '#07A869',
              border: '1px solid #07A869',
            }}
            className="big-switch"
          />
          <button className="cursor-pointer border border-[#C2C1C1] border-t-[#C2C1C1] border-b-[#C2C1C1] border-l-[#C2C1C1] border-r-[#C2C1C1] border-solid rounded-3xl py-2 px-4 text-[#C2C1C1] font-[500] text-sm bg-[#fff] hover:text-[#07A869] transition-colors duration-500 hover:border-[#07A869]">
            تسجيل الخروج
          </button>
        </div>

        <div className="flex flex-row-reverse items-center gap-5">
          <p className="text-[#15445A] text-sm p-0 m-0">
            <strong className="text-[#07A869] mx-1 text-base">الموافق:</strong>
            2025/10/05
          </p>
          <p className="text-[#15445A] text-sm p-0 m-0">
            <strong className="text-[#07A869] mx-1 text-base">الموافق:</strong>
            الاربعاء 1447/03/27
          </p>
        </div>
      </div>
    </section>
  );
}

export default TopBar;
