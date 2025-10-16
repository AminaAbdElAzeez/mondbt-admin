import { useEffect, useState } from "react";
import { Select, Input, Button, message } from "antd";
import axios from "utlis/library/helpers/axios";
import { useSelector } from "react-redux";
import RollerLoading from "components/loading/roller";

const { TextArea } = Input;
const { Option } = Select;

const ParentContact: React.FC = () => {
  const [contactType, setContactType] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>("");
  const { token } = useSelector((state: any) => state.Auth);
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contactTypes = [
    { value: "inquiry", label: "استفسار" },
    { value: "suggestion", label: "اقتراح" },
    { value: "complaint", label: "شكوى" },
    { value: "support_request", label: "طلب دعم" },
  ];

  const handleSubmit = async () => {
    if (!contactType || !subject.trim()) {
      return message.error("من فضلك اختر نوع الرسالة وأدخل المحتوى");
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        `parent/contact`,
        {
          type: contactType,
          subject: subject,
        },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
            "Accept-Language": "ar",
          },
        }
      );

      if (res.data.status) {
        message.success("تم إرسال الرسالة بنجاح");
        setContactType(null);
        setSubject("");
      } else {
        message.error("فشل في إرسال الرسالة");
      }
    } catch (err) {
      message.error("حدث خطأ أثناء إرسال الرسالة");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 600));
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
              تواصل معنا
            </h2>
          </div>

          {/* Select type */}
          <div
            className="flex flex-col md:flex-row justify-center md:justify-between items-end md:items-start mb-5 gap-5 w-full lg:w-[67%] ml-auto"
            dir="rtl"
          >
            <Select
              placeholder="اختر نوع الرسالة"
              value={contactType ?? undefined}
              className="w-full h-[42px]"
              onChange={(val) => setContactType(val)}
            >
              {contactTypes.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </div>

          {/* Subject input */}
          <div
            className="flex flex-col justify-center items-end mb-3 gap-3 w-full lg:w-[67%] ml-auto"
            dir="rtl"
          >
            <TextArea
              placeholder="اكتب رسالتك هنا..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="ml-auto mt-6">
            <Button
              loading={submitting}
              onClick={handleSubmit}
              className="bg-[#07A869] w-full h-[45px] sm:w-[220px] text-[#fff] text-base sm:text-lg font-semibold px-8 py-3 rounded-3xl outline-none border border-[#07A869] border-solid cursor-pointer hover:text-[#07A869] hover:bg-[#fff] transition-colors duration-500"
            >
              <bdi>{submitting ? "جاري الإرسال..." : "إرسال الرسالة"}</bdi>
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default ParentContact;
