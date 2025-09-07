import React, { useState } from "react";
import { FaRunning } from "react-icons/fa";

function TopBar() {
  const [enabled, setEnabled] = useState(true);

  return (
    <section className="bg-[#fff] px-4 py-3 flex flex-row-reverse justify-between items-center gap-5 shadow-[0_0_7px_-1px_#07A869]">
      <div className="flex flex-row-reverse justify-between items-center w-[35%]">
        <button className="cursor-pointer border !border-[#C2C1C1] rounded-3xl py-2 px-4 text-[#C2C1C1] font-[400] text-sm">
          تسجيل الخروج
        </button>
        <div
          onClick={() => setEnabled(!enabled)}
          className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors duration-300
    ${
      enabled
        ? "bg-[#fff] border border-[#07A869]"
        : "bg-[#07A869] border border-gray-400"
    }
  `}
        >
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-300
      ${enabled ? "-translate-x-7" : "translate-x-0"}
    `}
          >
            <span
              className={`text-sm font-bold ${
                enabled
                  ? "text-[#07A869] bg-[#fff]"
                  : "text-[#07A869] bg-[#07A869]"
              }`}
            >
              {enabled ? "ه" : "م"}
            </span>
          </div>
        </div>
        <h5 className="text-[#15445A] text-base">اهلا معالي الوزير</h5>
      </div>
      <div className="flex flex-row-reverse justify-between items-center w-[33%]">
        <p className="text-[#15445A] text-sm">
          <strong className="text-[#07A869] mx-1">الموافق:</strong>
          2025/10/05
        </p>
        <p className="text-[#15445A] text-sm">
          <strong className="text-[#07A869] mx-1">الموافق:</strong>
          الاربعاء 1447/03/27
        </p>
      </div>
    </section>
  );
}

export default TopBar;
