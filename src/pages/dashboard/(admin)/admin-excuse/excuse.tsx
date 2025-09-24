import RollerLoading from 'components/loading/roller';
import SaudiMap from 'components/SaudiMap/SaudiMap';
import React, { useEffect, useState } from 'react';
import { MdAccessAlarms } from 'react-icons/md';
import { RiFileEditLine, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
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
import axios from 'utlis/library/helpers/axios';

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
};

function CircularProgress({
  percentage,
  size = 200,
  strokeWidth = 18,
  color = '#07A869',
  bgColor = '#D9D9D9',
  label,
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
      {label && (
        <span className=" absolute top-[32%] text-base font-semibold text-[#15445A] mb-2">
          {label}
        </span>
      )}

      <span className="absolute top-[47%] text-2xl font-bold text-[#07A869]">{percentage}%</span>
    </div>
  );
}

const AdminExcuse: React.FC = () => {
  const [selected, setSelected] = useState<'سنة' | 'شهر' | 'يوم'>('يوم');
  const buttons: Array<'سنة' | 'شهر' | 'يوم'> = ['سنة', 'شهر', 'يوم'];
  const [selectedBottom, setSelectedBottom] = useState<'سنة' | 'شهر' | 'يوم'>('يوم');
  const buttonsBottom: Array<'سنة' | 'شهر' | 'يوم'> = ['سنة', 'شهر', 'يوم'];
  const { token } = useSelector((state: any) => state.Auth);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [attendanceData, setAttendanceData] = useState({
    all: 0,
    male: 0,
    female: 0,
    primary: 0,
    intermidite: 0,
    secondary: 0,
  });

  const filterTypeMapping: Record<'يوم' | 'شهر' | 'سنة', number> = {
    يوم: 1,
    شهر: 2,
    سنة: 3,
  };

  const region = [
    { id: 1, code: 'SA01', name: 'الرياض' },
    { id: 2, code: 'SA02', name: 'مكة المكرمة' },
    { id: 3, code: 'SA03', name: 'المدينة المنورة' },
    { id: 4, code: 'SA04', name: 'الشرقية' },
    { id: 5, code: 'SA05', name: 'القصيم' },
    { id: 6, code: 'SA06', name: 'حائل' },
    { id: 7, code: 'SA07', name: 'تبوك' },
    { id: 8, code: 'SA08', name: 'الحدود الشمالية' },
    { id: 9, code: 'SA09', name: 'جازان' },
    { id: 10, code: 'SA10', name: 'نجران' },
    { id: 11, code: 'SA11', name: 'الباحة' },
    { id: 12, code: 'SA12', name: 'الجوف' },
    { id: 13, code: 'SA13', name: 'الشمال' },
    { id: 14, code: 'SA14', name: 'عسير' },
  ];

  // تحويل كود الخريطة لكود backend مع تعديل الـ id للـ backend
  const regionMap: Record<string, { code: string; id: number }> = {
    SA01: { code: '01', id: 1 }, // الرياض
    SA02: { code: '02', id: 2 }, // مكة
    SA03: { code: '03', id: 3 }, // المدينة
    SA04: { code: '05', id: 5 }, // الشرقية
    SA05: { code: '04', id: 4 }, // القصيم
    SA06: { code: '08', id: 8 }, // حائل
    SA07: { code: '07', id: 7 }, // تبوك
    SA08: { code: '09', id: 9 }, // الحدود الشمالية
    SA09: { code: '10', id: 10 }, // جازان
    SA10: { code: '11', id: 11 }, // نجران
    SA11: { code: '12', id: 12 }, // الباحة
    SA12: { code: '13', id: 13 }, // الجوف
    SA13: { code: '13', id: 13 }, // Northern Borders → استخدم نفس الجوف إذا مش موجود
    SA14: { code: '06', id: 6 }, // عسير
  };

  const [regions] = useState(
    Object.entries(regionMap).map(([mapCode, { id }]) => ({
      id,
      code: mapCode,
      name: region.find((r) => r.code === mapCode)?.name || '',
    }))
  );

  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(regions[0]?.id || null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedRegionId) return;
      try {
        setLoading(true);
        const type = filterTypeMapping[selected];
        const res = await axios.get(
          `/admin/excuses?filter[type]=${type}&region_id=${selectedRegionId}`,
          {
            headers: {
              Authorization: `Bearer ${token || localStorage.getItem('token')}`,
              'Accept-Language': 'ar',
            },
          }
        );
        if (res.data.status) {
          setAttendanceData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching attendance data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selected, selectedRegionId]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
          <div className=" mb-5 md:mb-3 flex flex-col-reverse md:flex-row justify-end items-end lg:items-start gap-1 md:gap-2">
            <button
              onClick={async () => {
                try {
                  const res = await axios.get(
                    `/exports/excuses?filter[type]=${filterTypeMapping[selected]}&region_id=${selectedRegionId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token || localStorage.getItem('token')}`,
                        'Accept-Language': 'ar',
                      },
                      responseType: 'blob', // مهم عشان يرجع كملف
                    }
                  );

                  // إنشاء رابط تحميل
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `attendance_${selectedRegionId}.xlsx`); // أو .csv
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (error) {
                  console.error('خطأ أثناء تحميل الملف', error);
                }
              }}
              className="bg-[#07A869] outline-0 border border-[#07A869] border-solid rounded-3xl py-2 px-8 text-[#fff] text-base font-medium hover:bg-[#fff] hover:text-[#07A869] transition-colors duration-500 cursor-pointer"
            >
              اصدار التقرير
            </button>
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              احصائيات الاعذار
            </h2>
          </div>

          <div className="flex flex-col xl:flex-row justify-between items-stretch  gap-6">
            <div style={{ border: '1px solid #C2C1C1' }} className="p-4 rounded-lg w-full xl:w-1/2">
              <SaudiMap
                regions={regions}
                selectedRegionId={selectedRegionId}
                handleSearch={setSelectedRegionId}
              />
            </div>

            <div
              style={{ border: '1px solid #C2C1C1' }}
              className="p-4 rounded-lg w-full xl:w-1/2 "
            >
              <h3 className="text-xl font-semibold text-[#07A869] mb-8">
                {regions.find((r) => r.id === selectedRegionId)?.name || 'اختر منطقة'}
              </h3>
              <div
                className="flex rounded-3xl h-9 w-full sm:w-max  overflow-hidden mx-auto"
                style={{ border: '1px solid #C2C1C1' }}
              >
                {buttons.map((btn) => {
                  const isSelected = selected === btn;
                  return (
                    <button
                      key={btn}
                      onClick={() => setSelected(btn)}
                      className={`
              text-base h-8.5 w-1/3 sm:w-24 rounded-3xl transition-all duration-200 cursor-pointer
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

              <div className="mt-6 grid max-[400px]:grid-cols-1 min-[401px]:grid-cols-2  md:grid-cols-3  gap-6 justify-items-center">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div className="w-[140px] h-[140px] rounded-full bg-gray-200 animate-pulse" />
                  ))
                ) : (
                  <>
                    <CircularProgress
                      label="البنات"
                      percentage={attendanceData.female}
                      size={140}
                    />
                    <CircularProgress label="البنين" percentage={attendanceData.male} size={140} />
                    <CircularProgress label="الكل" percentage={attendanceData.all} size={140} />
                    <CircularProgress
                      label="الثانوي"
                      percentage={attendanceData.secondary}
                      size={140}
                    />
                    <CircularProgress
                      label="المتوسط"
                      percentage={attendanceData.intermidite}
                      size={140}
                    />
                    <CircularProgress
                      label="الابتدائي"
                      percentage={attendanceData.primary}
                      size={140}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* <div className="mt-6 mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start gap-1 lg:gap-5">
        <div
          className="flex rounded-3xl h-9 w-max  overflow-hidden"
          style={{ border: '1px solid #C2C1C1' }}
        >
          {buttonsBottom.map((btn) => {
            const isSelected = selectedBottom  === btn;
            return (
              <button
                key={btn}
                onClick={() => setSelectedBottom(btn)}
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
      </div> */}
        </section>
      )}
    </>
  );
};

export default AdminExcuse;
