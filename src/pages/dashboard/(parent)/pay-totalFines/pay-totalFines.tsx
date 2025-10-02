import { Modal } from "antd";
import RollerLoading from "components/loading/roller";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "utlis/library/helpers/axios";

type Fine = {
  id: number;
  type: string;
  amount: number;
};

const PayTotalFines: React.FC = () => {
  const [method, setMethod] = useState("credit");
  const [isLoading, setIsLoading] = useState(false);
  const [totalFines, setTotalFines] = useState<number>(0);
  const { token } = useSelector((state: any) => state.Auth);
  const [fine, setFine] = useState<number>(0);
  const [loadingFine, setLoadingFine] = useState(false);
  const [open, setOpen] = useState(false);

  const options = [
    { id: "bank", label: "تحويل بنكي" },
    { id: "credit", label: "بطاقة ائتمان" },
    { id: "apple", label: "Apple Pay" },
    { id: "sadad", label: "فاتورة سداد" },
  ];

  // fetch total fine
  useEffect(() => {
    const fetchFine = async () => {
      try {
        setLoadingFine(true);
        const res = await axios.get(`parent/totalfine`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        });
        setFine(res.data?.data?.fine_amount || 0);
      } catch (error) {
        console.error("Error fetching fine", error);
      } finally {
        setLoadingFine(false);
      }
    };

    fetchFine();
  }, []);

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
              <img
                src="/green-riyal.png"
                alt="icon"
                className="w-7 md:w-9 h-auto"
              />
              {loadingFine ? (
                <span className="text-[#07A869]  text-xl">جار التحميل...</span>
              ) : (
                <span className="text-[#07A869]  text-2xl font-semibold">
                  {fine.toLocaleString()}
                </span>
              )}{" "}
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
                style={{ border: "1px solid #DDDDDD" }}
                className={`flex items-center justify-end gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300
        ${
          method === opt.id
            ? "border-[#07A869] bg-[#07A869]"
            : "border-gray-300 bg-white"
        }`}
              >
                <span
                  className={`${
                    method === opt.id ? "text-white" : "text-[#15445A]"
                  } font-medium`}
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
            method === opt.id
              ? "bg-white border border-white"
              : "bg-white border border-[#15445A]"
          }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
            ${method === opt.id ? "bg-[#07A869]" : "bg-[#fff]"}`}
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
            <button
              onClick={() => setOpen(true)}
              className="bg-[#07A869] w-full sm:w-[220px] text-[#fff] text-base font-semibold px-8 py-2 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500 "
            >
              ادفع الآن
            </button>
          </div>

          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            centered
          >
            <div className="text-center py-4">
              <div className="relative flex justify-center items-center w-32 h-32 mx-auto">
                <span className="wave w-16 h-16 z-0"></span>
                <span className="wave w-16 h-16 z-0"></span>
                <span className="wave w-16 h-16 z-0"></span>

                <FaCheckCircle className="text-4xl text-[#fff] relative z-10" />
              </div>

              <h3 className="text-[#07A869] text-2xl font-bold mb-2">
                شكرًا لك
              </h3>
              <p className="text-[#15445A] text-xl font-bold">
                تم دفع الغرامة بنجاح. نتمنى لك يومًا سعيدًا
              </p>
            </div>
          </Modal>
        </section>
      )}
    </>
  );
};

export default PayTotalFines;
