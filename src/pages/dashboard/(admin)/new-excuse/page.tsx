import { Select } from "antd";
import "antd/dist/reset.css";

const { Option } = Select;

const NewExcuse: React.FC = () => {
  return (
    <section dir="ltr" className="text-right px-2">
      <div className="mb-2 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start gap-1 lg:gap-5">
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          تقديم عذر جديد
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-3 gap-5 w-full lg:w-[67%] ml-auto" dir="rtl">
        <input
          type="text"
          placeholder="اسم الابن"
          className="text-[#15445A] placeholder:text-[#15445A] border border-[#DDDDDD] border-solid rounded-md p-3 focus:border-[#07A869] outline-none w-full md:w-1/2 font-medium placeholder:font-medium"
        />

        <Select
          placeholder="سبب العذر"
          className="w-full md:w-1/2 custom-select placeholder:!text-[#15445A] placeholder:!font-medium"
        >
          <Option value="1">سبب العذر</Option>
          <Option value="2">سبب العذر</Option>
          <Option value="3">سبب العذر</Option>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-3 gap-5 w-full lg:w-[67%] ml-auto" dir="rtl">
        <Select
          placeholder="اختر يوم العذر"
          className="w-full md:w-1/2 custom-select"
        >
          <Option value="sunday">الأحد</Option>
          <Option value="monday">الإثنين</Option>
          <Option value="tuesday">الثلاثاء</Option>
          <Option value="wednesday">الأربعاء</Option>
          <Option value="thursday">الخميس</Option>
        </Select>
        <div className="w-1/2 hidden md:block"></div>
      </div>

      <div className="ml-auto mt-6">
        <button className="bg-[#07A869] w-full sm:w-[220px] text-[#fff] text-base sm:text-lg font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500">
          قدم العذر
        </button>
      </div>      
    </section>
  );
};

export default NewExcuse;
