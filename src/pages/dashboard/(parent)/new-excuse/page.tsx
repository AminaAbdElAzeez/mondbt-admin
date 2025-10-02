import { useEffect, useState } from "react";
import { Select, DatePicker, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import locale from "antd/es/date-picker/locale/ar_EG";
import axios from "utlis/library/helpers/axios";
import { useSelector } from "react-redux";
import RollerLoading from "components/loading/roller";

const { Option } = Select;

const NewExcuse: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [excuseTypes, setExcuseTypes] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [typeId, setTypeId] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { token } = useSelector((state: any) => state.Auth);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [uploadKey, setUploadKey] = useState(Date.now());
  const [dateKey, setDateKey] = useState(Date.now());

  useEffect(() => {
    axios
      .get(`parent/children`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChildren(res.data?.data || []);
      });

    axios
      .get(`parent/excuses/type`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setExcuseTypes(res.data?.data || []);
      });
  }, []);

  const handleSubmit = async () => {
    if (!studentId || !typeId || !date || !file) {
      return message.error("من فضلك املأ كل الحقول قبل الإرسال");
    }

    const formData = new FormData();
    formData.append("student_id", studentId.toString());
    formData.append("type_id", typeId.toString());
    formData.append("date", date);
    formData.append("file", file, file.name);

    try {
      setSubmitting(true);
      await axios.post(`parent/excuses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Accept-Language": "ar",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });
      message.success("تم إرسال العذر بنجاح");

      // Reset fields
      setStudentId(null);
      setTypeId(null);
      setDate(null);
      setFile(null);

      // force reset UI components
      setUploadKey(Date.now());
      setDateKey(Date.now());
    } catch (err) {
      message.error("حدث خطأ أثناء إرسال العذر");
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="mb-2 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              طلب استئذان جديد
            </h2>
          </div>

          {/* Select Student & Excuse */}
          <div
            className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-3 gap-5 w-full lg:w-[67%] ml-auto"
            dir="rtl"
          >
            <Select
              placeholder="اختر الابن"
              value={studentId ?? undefined}
              className="w-full md:w-1/2 h-[42px]"
              onChange={(val) => setStudentId(val)}
            >
              {children.map((child) => (
                <Option key={child.id} value={child.id}>
                  {child.name}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="سبب العذر"
              value={typeId ?? undefined}
              className="w-full md:w-1/2 h-[42px]"
              onChange={(val) => setTypeId(val)}
            >
              {excuseTypes.map((excuse) => (
                <Option key={excuse.id} value={excuse.id}>
                  {excuse.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Date Picker */}
          <div
            className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-3 gap-5 w-full lg:w-[67%] ml-auto"
            dir="rtl"
          >
            <DatePicker
              key={dateKey} // force reset
              locale={locale}
              format="YYYY/MM/DD"
              value={date ? dayjs(date, "YYYY/MM/DD") : null}
              className="w-full  h-[42px]"
              onChange={(dateObj) =>
                setDate(dateObj ? dayjs(dateObj).format("YYYY/MM/DD") : null)
              }
            />
            <div
              className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-3 gap-5 lg:w-[67%] ml-auto group w-full md:w-[1/2] file"
              dir="rtl"
            >
              <Upload
                key={uploadKey} // force reset
                beforeUpload={() => false}
                className="!w-full"
                maxCount={1}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={({ fileList }) => {
                  if (fileList.length > 0) {
                    const rawFile = fileList[0].originFileObj as File;
                    setFile(rawFile);
                  } else {
                    setFile(null);
                  }
                }}
              >
                <Button
                  className="w-full h-[42px]"
                  icon={
                    <UploadOutlined className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500 text-xl !h-[42px]" />
                  }
                >
                  ارفع ملف (صورة / PDF)
                </Button>
              </Upload>
            </div>{" "}
          </div>

          {/* Submit Button */}
          <div className="ml-auto mt-6 ">
            <Button
              loading={submitting}
              onClick={handleSubmit}
              className="bg-[#07A869] w-full h-[45px] sm:w-[220px] text-[#fff] text-base sm:text-lg font-semibold px-8 py-3 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500"
            >
              <bdi>{submitting ? "جاري الإرسال..." : "طلب استئذان جديد"}</bdi>
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default NewExcuse;
