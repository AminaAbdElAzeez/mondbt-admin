const ExcuseStatus: React.FC = () => {
  return (
    <section dir="ltr" className="text-right px-2">
      <div className=" mb-3 flex flex-col-reverse lg:flex-row justify-end items-end lg:items-start  gap-1 lg:gap-5">
        <h2 className="text-[#15445A] font-semibold hover:text-[#07A869] transition-colors duration-500">
          حالة العذر
        </h2>
      </div>
      <div className="flex flex-col items-end gap-7">
        <div className="flex items-center gap-2 text-base text-right group">
          <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500">إجازة مرضية</span>
          <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500"><bdi>الوصف:</bdi></strong>
        </div>

        <div className="flex items-center gap-2 text-base text-right group">
          <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500"> احمد علي ابراهيم</span>
          <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500"><bdi>الولد:</bdi></strong>
        </div>

        <div className="flex items-center gap-2 text-base text-right group">
          <span className="text-[#07A869] group-hover:text-[#07A869] transition-colors duration-500">مقبول </span>
          <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500"><bdi>الحالة:</bdi></strong>
        </div>

        <div className="flex items-center gap-2 text-base text-right group">
          <span className="text-[#15445A] group-hover:text-[#07A869] transition-colors duration-500"> 26 ربيع الاول 1447</span>
          <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500"><bdi>التاريخ:</bdi></strong>
        </div>

        <div className="flex items-start gap-2 text-base text-right group">
          <div className="w-36 sm:w-44 md:w-56 h-28 bg-[#C2C1C1] rounded-md"></div>
          <strong className="text-[#15445A] w-[85px] group-hover:text-[#07A869] transition-colors duration-500"><bdi>المرافقات:</bdi></strong>
        </div>
      </div>
    </section>
  );
};

export default ExcuseStatus;
