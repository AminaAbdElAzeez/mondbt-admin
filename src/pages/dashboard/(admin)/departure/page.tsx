import React, { useState } from 'react';
import { MdAccessAlarms } from 'react-icons/md';
import { RiFileEditLine, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Select, Button, Skeleton } from 'antd';
import 'antd/dist/reset.css';
import { IoSearch } from 'react-icons/io5';
import { FaExclamation } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const { Option } = Select;

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
};

function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 20,
  color = '#07A869',
  bgColor = '#D9D9D9', // gray-200
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={(1 - percentage / 100) * circumference}
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* <span className="absolute text-3xl font-bold text-[#15445A]">%{percentage}</span> */}
    </div>
  );
}

const Departure: React.FC = () => {
  const [selected, setSelected] = useState<'سنة' | 'شهر' | 'يوم'>('يوم');
  const buttons: Array<'سنة' | 'شهر' | 'يوم'> = ['سنة', 'شهر', 'يوم'];

  const [selectedAttend, setSelectedAttend] = useState<'الاحصائيات' | 'التقارير'>('الاحصائيات');
  const buttonsAttend: Array<'الاحصائيات' | 'التقارير'> = ['الاحصائيات', 'التقارير'];

  const [selectedHr, setSelectedHr] = useState<'الطلاب' | 'المدراس'>('الطلاب');
  const buttonsHr: Array<'الطلاب' | 'المدراس'> = ['الطلاب', 'المدراس'];

  const stats = [
    {
      title: 'الغرامات',
      value: '1,020,935',
      suffix: 'ريال سعودي',
      bg: 'bg-[#07A869]',
      text: 'text-white',
      icon: '/riyal.png',
    },
    {
      title: 'الاستئذان',
      value: '12,650',
      suffix: 'حالة استئذان',
      bg: 'bg-white',
      text: 'text-[#07A869]',
      borderStyle: { border: '1px solid #C2C1C1', background: '#f9f9f9' },
    },
    {
      title: 'التأخير',
      value: '1,180,935',
      suffix: 'حالة تأخير',
      bg: 'bg-[#07A869]',
      text: 'text-white',
    },
    {
      title: 'الغياب',
      value: '314,919',
      suffix: 'طالب وطالبة',
      bg: 'bg-white',
      text: 'text-[#07A869]',
      borderStyle: { border: '1px solid #C2C1C1', background: '#f9f9f9' },
    },
    {
      title: 'الحضور',
      value: '5,983,404',
      suffix: 'طالب وطالبة',
      bg: 'bg-[#07A869]',
      text: 'text-white',
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = [
    { day: 15, value: 70, hijri: '21' },
    { day: 16, value: 50, hijri: '20' },
    { day: 17, value: 90, hijri: '19' },
    { day: 18, value: 30, hijri: '18' },
    { day: 19, value: 60, hijri: '17' },
    { day: 20, value: 80, hijri: '16' },
    { day: 21, value: 40, hijri: '15' },
  ];

  const [loading, setLoading] = useState(true);
  const onChange = (checked) => {
    setLoading(!checked);
  };

  return (
    <section dir="ltr" className="text-right px-2">
      <div className=" mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
        <div
          className="flex rounded-3xl h-9 w-max  overflow-hidden"
          style={{ border: '1px solid #C2C1C1' }}
        >
          {buttons.map((btn) => {
            const isSelected = selected === btn;
            return (
              <button
                key={btn}
                onClick={() => setSelected(btn)}
                className={`
              text-base h-8.5 w-[76px] sm:w-24 rounded-3xl transition-all duration-200 cursor-pointer
              ${isSelected ? 'bg-[#07A869] text-white' : 'bg-transparent text-[#C2C1C1]'}
              hover:${isSelected ? 'brightness-110' : 'bg-gray-100'}
              outline-none border-none
            `}
              >
                {btn}
              </button>
            );
          })}
        </div>
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          احصائيات الانضباط
        </h2>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5 ">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md p-4 ${item.bg} transform transition duration-300 hover:scale-105 hover:shadow-xl flex-grow w-[160px] text-right`}
            style={item.borderStyle || {}}
          >
            {/* Title */}
            <h3 className={`${item.text} text-lg font-medium mb-1`}>{item.title}</h3>

            {/* Value + Icon */}
            <div className="flex items-center gap-2 justify-end">
              {item.icon && <img src={item.icon} alt="icon" className="w-7 h-7" />}
              <span className={`${item.text} text-2xl font-semibold`}>{item.value}</span>
            </div>

            {/* Suffix */}
            <p className={`${item.text} text-base my-1`}>{item.suffix}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 mt-2 border border-[#C2C1C1] rounded-lg bg-white" dir="rtl">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
          <Select
            placeholder="المنطقة"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="riyadh">الرياض</Option>
            <Option value="jeddah">جدة</Option>
          </Select>

          <Select
            placeholder="المدينة"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="malaz">مكة</Option>
            <Option value="riyadh">الرياض</Option>
          </Select>

          <Select
            placeholder="الرقم الوزاري"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="123">123</Option>
            <Option value="456">456</Option>
          </Select>

          <Select
            placeholder="النوع"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="boys">بنين</Option>
            <Option value="girls">بنات</Option>
          </Select>

          <Select
            placeholder="الجنس"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="male">ذكر</Option>
            <Option value="female">أنثى</Option>
          </Select>

          <Select
            placeholder="اسم المدرسة"
            className="w-full custom-select"
            style={{
              backgroundColor: '#F3F3F3',
              borderColor: '#DDDDDD',
              color: '#15445A',
            }}
            dropdownStyle={{ backgroundColor: '#F3F3F3', color: '#15445A' }}
          >
            <Option value="school1">مدرسة 1</Option>
            <Option value="school2">مدرسة 2</Option>
          </Select>
          <button className="flex justify-center items-center gap-1 transition-colors duration-500 rounded-md bg-[#07A869] border border-[#07A869] border-solid cursor-pointer  hover:bg-white hover:text-[#07A869] text-white py-1.5 ">
            بحث
            <IoSearch className=" text-lg" />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-stretch  gap-6">
        <div style={{ border: '1px solid #C2C1C1' }} className="p-4 rounded-lg w-full xl:w-1/2">
          <div className="px-6 flex justify-center items-center mb-2 lg:mb-0">
            <img src="/map.png" alt="map" className="w-full max-w-[500px] " />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full xl:w-1/2">
          <div
            style={{ border: '1px solid #C2C1C1' }}
            className="flex-1  rounded-lg border border-[#C2C1C1] flex flex-col gap-4 w-full md:w-1/2"
          >
            <div className="flex gap-2 w-full px-4 pt-3 pb-0">
              {buttonsAttend.map((btn) => {
                const isSelected = selectedAttend === btn;
                return (
                  <button
                    key={btn}
                    onClick={() => setSelectedAttend(btn)}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border border-[#07A869] border-solid  cursor-pointer
              ${isSelected ? 'bg-[#07A869] text-white' : 'bg-gray-100 text-[#15445A]'}
            `}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
            <div className="w-full h-px bg-gray-300 " />
            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              <CircularProgress
                percentage={80}
                size={70}
                strokeWidth={10}
                color="#07A869"
                bgColor="#E5E7EB"
              />
              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                الحضور
              </span>
            </div>
            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              <CircularProgress
                percentage={80}
                size={70}
                strokeWidth={10}
                color="#07A869"
                bgColor="#E5E7EB"
              />
              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                الغياب
              </span>
            </div>
            <div className="flex items-center gap-4 justify-between px-4 mb-8">
              <CircularProgress
                percentage={80}
                size={70}
                strokeWidth={10}
                color="#07A869"
                bgColor="#E5E7EB"
              />
              <span className="text-[#15445A] text-lg font-medium hover:text-[#07A869] transition-colors duration-500 ">
                المكافئات
              </span>
            </div>
          </div>

          <div
            className="flex-1 rounded-lg border border-[#C2C1C1] flex flex-col gap-4 w-full md:w-1/2"
            style={{ border: '1px solid #C2C1C1' }}
          >
            <div className="flex gap-2 w-full px-4 pt-3 pb-0">
              {buttonsHr.map((btn) => {
                const isSelected = selectedHr === btn;
                return (
                  <button
                    key={btn}
                    onClick={() => setSelectedHr(btn)}
                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 border border-[#07A869] border-solid  cursor-pointer
              ${isSelected ? 'bg-[#07A869] text-white' : 'bg-gray-100 text-[#15445A]'}
            `}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
            <div className="w-full h-px bg-gray-300 " />

            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-1">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center px-4 bg-white rounded-lg border border-[#C2C1C1] w-full mb-6">
              <Link
                to="/admin/departure/excuse-status"
                className="text-2xl text-[#15445A] cursor-pointer"
              >
                <FiEye />
              </Link>

              <div className="flex items-center gap-3 w-[80%]">
                <div className="flex-1 flex flex-col gap-2 justify-end items-end">
                  <div className="w-full h-2.5 bg-[#C2C1C1] rounded-md"></div>
                  <div className="w-[70%] h-2.5 bg-[#C2C1C1] rounded-md"></div>
                </div>

                <div className="w-10 h-10 bg-[#C2C1C1] rounded-full flex-shrink-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Departure;
