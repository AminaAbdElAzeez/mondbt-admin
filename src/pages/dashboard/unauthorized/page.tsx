import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-red-600">غير مسموح بالدخول</h1>
      <p className="mb-6 text-gray-600">
        ليس لديك صلاحية للوصول إلى هذه الصفحة.
      </p>
      <Button
        type="primary"
onClick={() => navigate("/login")}
        className="bg-[#209163]"
      >
        تسجيل الدخول
      </Button>
    </div>
  );
}
