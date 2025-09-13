import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdAccessAlarms } from 'react-icons/md';
import { RiFileEditLine, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Table, TableColumnsType, Tag } from 'antd';
import { FiEye } from 'react-icons/fi';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

interface Excuse {
  key: string;
  description: string;
  date: string;
  son: string;
  status: string;
}

const dataTable: Excuse[] = [
  {
    key: '1',
    description: 'مرض الطالب/ أحمد علي',
    date: '1447/03/22',
    son: 'أحمد',
    status: 'مقبول',
  },
  {
    key: '2',
    description: 'وفاة قريبة من الدرجو الاولي',
    date: '1447/03/23',
    son: 'محمد',
    status: 'مقبول',
  },
  {
    key: '3',
    description: 'موعد طبي للطالبة/ زهرة علي',
    date: '1447/03/24',
    son: 'زهرة',
    status: 'مقبول',
  },
  {
    key: '4',
    description: 'مرض الطالب/ أحمد علي',
    date: '1447/03/22',
    son: 'أحمد',
    status: 'مقبول',
  },
  {
    key: '5',
    description: 'وفاة قريبة من الدرجو الاولي',
    date: '1447/03/23',
    son: 'محمد',
    status: 'مقبول',
  },
  {
    key: '6',
    description: 'موعد طبي للطالبة/ زهرة علي',
    date: '1447/03/24',
    son: 'زهرة',
    status: 'مقبول',
  },
];

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

      <span className="absolute text-3xl font-bold text-[#15445A]">%{percentage}</span>
    </div>
  );
}

const Orders: React.FC = () => {
  const [selected, setSelected] = useState<'سنة' | 'شهر' | 'يوم'>('يوم');
  const buttons: Array<'سنة' | 'شهر' | 'يوم'> = ['سنة', 'شهر', 'يوم'];

  const [selectedAttend, setSelectedAttend] = useState<
    'التأخير' | 'الأعذار' | 'المكأفات' | 'الغياب' | 'الحضور'
  >('الحضور');

  const buttonsAttend: Array<'التأخير' | 'الأعذار' | 'المكأفات' | 'الغياب' | 'الحضور'> = [
    'التأخير',
    'الأعذار',
    'المكأفات',
    'الغياب',
    'الحضور',
  ];
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

  const cardsData = [
    { name: 'احمد', grade: 'الثالث', school: 'ابتدائية المنصورة - الرياض' },
    { name: 'محمد', grade: 'السادس', school: 'ابتدائية يزيد الشيباني' },
    { name: 'لبني', grade: 'الثاني', school: 'ابتدائية المنصورة - الرياض' },
    { name: 'احمد', grade: 'الثالث', school: 'ابتدائية المنصورة - الرياض' },
  ];

  const columns: TableColumnsType<Excuse> = [
    {
      title: 'الوصف',
      dataIndex: 'description',
      key: 'description',
      width: '31%',
      align: 'center',
      // render: (text) =>
      //   text || (
      //     <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
      //   ),
    },
    {
      title: 'التاريخ',
      dataIndex: 'date',
      key: 'date',
      width: '23%',
      align: 'center',
    },
    {
      title: 'الابن',
      dataIndex: 'son',
      key: 'son',
      width: '19%',
      align: 'center',
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      key: 'status',
      width: '19%',
      align: 'center',

      render: (status: string) => <span className="!m-0">{status}</span>,
    },

    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: '8%',
      render: () => (
        <Tooltip title="عرض التفاصيل" color="#07A869">
          <a href="permission/details">
            <FiEye className="text-[#15445A] text-xl cursor-pointer" />
          </a>
        </Tooltip>
      ),
    },
  ];

  return (
    <section dir="ltr" className="text-right px-2">
      <div className=" mb-1 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          أبنائي
        </h2>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-5 py-2 mb-5" dir="rtl">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl flex-grow w-[230px] text-right"
            style={{ border: '1px solid #07A86940' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-max flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D9D9D9]"></div>
                <span className="text-[#07A869] text-xl font-semibold">{card.name}</span>
              </div>
              <BsThreeDotsVertical className="text-2xl w-auto text-[#15445A] cursor-pointer hover:text-[#07A869] transition-colors duration-500 " />
            </div>
            <div className="flex flex-col  items-start gap-2">
              <div className="flex  items-center gap-2 text-right group text-sm">
                <strong className="text-[#07A869] w-[50px] group-hover:text-[#07A869] transition-colors duration-500">
                  <bdi>الصف:</bdi>
                </strong>
                <strong className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                  {card.grade}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-sm text-right group mb-2">
                <strong className="text-[#07A869] w-[50]px] group-hover:text-[#07A869] transition-colors duration-500">
                  <bdi>المدرسة:</bdi>
                </strong>
                <strong className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500 text-[13px]">
                  {card.school}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className=" mb-1 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          قائمة الأعذار
        </h2>
      </div>
      <Table<Excuse>
        bordered
        dataSource={dataTable}
        columns={columns}
        pagination={false}
        scroll={{ x: 800 }}
        className="custom-table rounded-lg"
        style={{ border: '1px solid #D9D9D9' }}
        footer={() => (
          <div className="flex justify-end">
            <button className="bg-[#07A869] text-[#fff] text-sm sm:text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 ">
              عرض الكل
            </button>
          </div>
        )}
      />
      <div
        className={`rounded-xl shadow-md p-4 transform transition duration-300  mt-5`}
        style={{ border: '1px solid #D9D9D9' }}
      >
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-1.5 gap-1">
          <div className="flex items-center gap-2 justify-end text-[#07A869]">
            <img src="/green-riyal.png" alt="icon" className="w-7 md:w-9 h-auto" />
            <span className="text-[#07A869]  text-2xl font-semibold">1,020,935</span>
          </div>
          <h3 className="text-[#07A869] hover:text-[#15445A] transition-colors duration-500  text-xl sm:text-2xl font-semibold">
            <bdi>مجموع الغرامات:</bdi>
          </h3>
        </div>

        <div className="flex justify-center md:justify-start mb-1.5">
          <Link
            to="details/pay-fines"
            className="bg-[#07A869] text-[#fff] text-sm sm:text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 "
          >
            دفع الغرامات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Orders;

// {isLoading ? (
//             <RollerLoading />
//           ) : (
