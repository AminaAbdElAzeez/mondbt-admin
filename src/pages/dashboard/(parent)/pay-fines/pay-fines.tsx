import RollerLoading from 'components/loading/roller';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'utlis/library/helpers/axios';

type Fine = {
  id: number;
  type: string;
  amount: number;
};

const PayFines: React.FC = () => {
  const [method, setMethod] = useState('credit');
  const [isLoading, setIsLoading] = useState(false);
  const [totalFines, setTotalFines] = useState<number>(0);
  const { token } = useSelector((state: any) => state.Auth);

  const options = [
    { id: 'bank', label: 'تحويل بنكي' },
    { id: 'credit', label: 'بطاقة ائتمان' },
    { id: 'apple', label: 'Apple Pay' },
    { id: 'sadad', label: 'فاتورة سداد' },
  ];
  const { id } = useParams<{ id: string }>();
  const [finesData, setFinesData] = useState<{ fines: Fine[]; total: number }>({
    fines: [],
    total: 0,
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/parent/student/fines/${id}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          'Accept-Language': 'ar',
        },
      })
      .then((res) => {
        setFinesData(res.data.data);
      })
      .catch((err) => console.error(err));
  }, [id, token]);

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
          <div className=" mb-2 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              دفع الغرامات
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center md:justify-between  items-end md:items-start mb-3 gap-1 w-full lg:w-[67%] ml-auto">
            <div className="flex items-center gap-2 justify-end text-[#07A869]">
              <img src="/green-riyal.png" alt="icon" className="w-7 md:w-9 h-auto" />
              <span className="text-[#07A869]  text-2xl font-semibold">{finesData.total} </span>
            </div>
            <h3 className="text-[#07A869] hover:text-[#15445A] transition-colors duration-500  text-xl sm:text-xl font-semibold">
              <bdi>مجموع الغرامات:</bdi>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-[#15445A] w-full lg:w-[67%] ml-auto mb-4 hover:text-[#07A869] transition-colors duration-500 group">
            <hr className="flex-grow h-px border-none bg-[#15445A] group-hover:bg-[#07A869] transition-colors duration-500" />
            <h4 className="w-max text-lg">اختر وسيلة الدفع</h4>
            <hr className="flex-grow h-px border-none bg-[#15445A] group-hover:bg-[#07A869] transition-colors duration-500" />
          </div>

          <div className="flex flex-col gap-5 w-full lg:w-[67%] ml-auto">
            {options.map((opt) => (
              <label
                key={opt.id}
                style={{ border: '1px solid #DDDDDD' }}
                className={`flex items-center justify-end gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
        ${method === opt.id ? 'border-[#07A869] bg-[#07A869]' : 'border-gray-300 bg-white'}`}
              >
                <span
                  className={`${method === opt.id ? 'text-white' : 'text-[#15445A]'} font-medium`}
                >
                  {opt.label}
                </span>

                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={method === opt.id}
                  onChange={() => setMethod(opt.id)}
                  className="hidden"
                />

                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 border-solid
          ${
            method === opt.id ? 'bg-white border border-white' : 'bg-white border border-[#15445A]'
          }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
            ${method === opt.id ? 'bg-[#07A869]' : 'bg-[#fff]'}`}
                  >
                    {method === opt.id && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                    )}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div className=" ml-auto mt-6">
            <button className="bg-[#07A869] w-full sm:w-[220px] text-[#fff] text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 ">
              ادفع الآن
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default PayFines;
