import RollerLoading from "components/loading/roller";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "utlis/library/helpers/axios";

type Excuse = {
  id: number;
  type: string;
  student: string;
  status: string;
  date: string;
  file: string;
};

const ExcuseStatus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [excuse, setExcuse] = useState<Excuse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`/parent/excuses/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Accept-Language": "ar",
        },
      })
      .then((res) => {
        setExcuse(res.data.data.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

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

  // if (!excuse) return <p>جاري التحميل...</p>;

  return (
    <>
      {!excuse ? (
        <RollerLoading />
      ) : (
        <section dir="ltr" className="text-right px-2">
          <div className=" mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
            <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
              حالة العذر
            </h2>
          </div>
          <div className="flex flex-col items-end gap-7">
            <div className="flex items-center gap-2 text-base text-right group">
              <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                {excuse.type}
              </span>
              <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500">
                <bdi>الوصف:</bdi>
              </strong>
            </div>

            <div className="flex items-center gap-2 text-base text-right group">
              <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                {" "}
                {excuse.student}
              </span>
              <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500">
                <bdi>الولد:</bdi>
              </strong>
            </div>

            <div className="flex items-center gap-2 text-base text-right group">
              <span className="text-[#07A869] group-hover:text-[#07A869] transition-colors duration-500">
                {" "}
                {excuse.status}
              </span>
              <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500">
                <bdi>الحالة:</bdi>
              </strong>
            </div>

            <div className="flex items-center gap-2 text-base text-right group">
              <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">
                {" "}
                {excuse.date}
              </span>
              <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500">
                <bdi>التاريخ:</bdi>
              </strong>
            </div>

            {excuse.file && (
              <div className="flex items-start gap-2 text-base text-right group">
                <a
                  href={excuse.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  تحميل المرفق
                </a>
                <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500">
                  <bdi>المرافقات:</bdi>
                </strong>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default ExcuseStatus;
