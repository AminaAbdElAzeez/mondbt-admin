import React, { useEffect, useState } from "react";
import { Badge, Card, DatePicker, Progress } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { BsArrowUpShort } from "react-icons/bs";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { FaCodeBranch, FaUsers } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { FaCarOn } from "react-icons/fa6";
import axios from "utlis/library/helpers/axios";
import { MdOutlineBrandingWatermark, MdOutlineCategory } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import RollerLoading from "components/loading/roller";
import dayjs from "dayjs";

const Statistics: React.FC = () => {
  const intl = useIntl();
  const [statistics, setStatistics] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const language = intl.locale === "ar" ? "ar-SA" : "en";
        const { data } = await axios.get("admin/statistics", {
          headers: {
            "Accept-Language": language,
          },
          params: {
            year: selectedYear,
          },
        });
        setStatistics(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatistics();
  }, [selectedYear, intl.locale]);

  if (!statistics) {
    return <RollerLoading />;
  }

  const {
    clients_count,
    branches_count,
    brands_count,
    categories_count,
    sub_categories_count,
    products_count,
    drivers_count,
    total_price,
    total_per_month,
    total_products_sold,
    prescription_orders_count,
    accepted_orders_count,
    completed_orders_count,
    refunded_orders_count,
    away_orders_count,
    pharmacy_pickup_orders_count,
    home_delivery_orders_count,
    cash_orders_count,
    credit_orders_count,
    mada_orders_count,
  } = statistics;

  const overviewCards = [
    {
      id: 1,
      label: "statistics.clients",
      value: clients_count,
      icon: <FaUsers />,
      color: "#ee6c5e",
      percentage: 50,
    },
    {
      id: 2,
      label: "statistics.branches",
      value: branches_count,
      icon: <FaCodeBranch />,
      color: "#2ea5b8",
      percentage: 50,
    },
    {
      id: 3,
      label: "statistics.brands",
      value: brands_count,
      icon: <MdOutlineBrandingWatermark />,
      color: "#fac03f",
      percentage: 50,
    },
    {
      id: 4,
      label: "statistics.productsCount",
      value: products_count,
      icon: <AiFillProduct />,
      color: "#9976c3",
      percentage: 50,
    },
    {
      id: 5,
      label: "statistics.drivers",
      value: drivers_count,
      icon: <FaCarOn />,
      color: "#1abc9c",
      percentage: 50,
    },
    {
      id: 6,
      label: "statistics.categories",
      value: categories_count,
      icon: <BiCategoryAlt />,
      color: "#8ac578",
      percentage: 50,
    },
    {
      id: 7,
      label: "statistics.subCategories",
      value: sub_categories_count,
      icon: <MdOutlineCategory />,
      color: "#dd5ec2",
      percentage: 50,
    },
  ];

  const ordersStatus = [
    {
      name: "acceptedOrders",
      value: accepted_orders_count,
    },
    {
      name: "completedOrders",
      value: completed_orders_count,
    },
    {
      name: "refundedOrders",
      value: refunded_orders_count,
    },
    {
      name: "awayOrders",
      value: away_orders_count,
    },
  ];

  const maxOrders = Math.max(
    accepted_orders_count,
    completed_orders_count,
    refunded_orders_count,
    away_orders_count
  );
  const currentYear = new Date().getFullYear();

  const newOrdersData = [
    {
      // year: "2025",
      // year: currentYear.toString(),
      year: selectedYear,
      pharmacyPickup: parseInt(pharmacy_pickup_orders_count),
      homeDelivery: parseInt(home_delivery_orders_count),
      cashOrders: parseInt(cash_orders_count),
      creditOrders: parseInt(credit_orders_count),
      madaOrders: parseInt(mada_orders_count),
      prescriptionOrders: parseInt(prescription_orders_count),
    },
  ];

  const gradientColors = [
    { from: "#03b89e", to: "#10b981" },
    { from: "#6366f1", to: "#8b5cf6" },
    { from: "#f97316", to: "#facc15" },
    { from: "#ec4899", to: "#f472b6" },
  ];

  // const orderData = Object.entries(total_per_month).map(([month, total]) => ({
  //   month,
  //   total: parseFloat(total as string),
  // }));

  const orderData = Object.entries(total_per_month).map(([month, total]) => ({
    month: intl.formatMessage({ id: `months.${month.toLowerCase()}` }),
    total: parseFloat(total as string),
  }));

  return (
    <section className="container mx-auto">
      <div>
        <h2 className="text-[#15445A] hover:text-[#1384ad] transition-colors duration-[0.5s] text-[25px] tracking-wider font-[600] mt-4 mb-3">
          {/* {intl.formatMessage({ id: "statistics.title" })} */}
          احصائيات الانضباط
        </h2>
        <div className="border border-[#C2C1C1] rounded-2xl w-[300px] ">
          <button className="text-[#C2C1C1] w-[33%] rounded-2xl border-none outline-0 py-2 bg-transparent">
            سنة
          </button>
          <button className="text-[#C2C1C1] w-[33%] rounded-2xl border-none outline-0 py-2 bg-transparent">
            سنة
          </button>

          <button className="text-[#fff] bg-[#07A869]  w-[33%] rounded-2xl border-none outline-0 py-2 bg-transparent">
            سنة
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-4 mb-[30px]">
        {overviewCards.map((card) => (
          <div
            key={card.id}
            className="group flex-grow rounded-lg shadow-md flex items-center justify-start gap-3 p-6 w-[190px] min-w-[170px] hover:cursor-pointer
                 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
            style={{
              borderBottom: `3px solid ${card.color}`,
              borderColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = card.color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "transparent";
            }}
          >
            <div className="relative w-[50px] h-[50px] flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full z-0 group-hover:animate-spin-slower"
                style={{
                  background: `conic-gradient(${card.color} 0% ${card.percentage}%, #f1f1f1 ${card.percentage}% 100%)`,
                }}
              ></div>

              <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center z-10">
                <div className="text-[20px]" style={{ color: card.color }}>
                  {card.icon}
                </div>
              </div>
            </div>

            <div>
              <h3
                className="text-[16px] font-[600] tracking-wider mb-[6px]"
                style={{ color: card.color }}
              >
                {intl.formatMessage({ id: card.label })}
              </h3>
              <p className="text-[23px] font-[600] text-[#3d435b] dark:text-[#fff]">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <DatePicker
          className="w-[288px] h-[40px]"
          picker="year"
          value={dayjs().year(selectedYear)}
          onChange={(date) => {
            if (date) {
              setSelectedYear(date.year());
            }
          }}
        />
      </div>

      <div className="flex flex-col justify-start items-center min-[1116px]:flex-row min-[1116px]:justify-between min-[1116px]:items-start gap-3 mb-[20px]">
        <Card
          className="w-full text-[#03b89e] flex-grow min-[1116px]:w-[40%]"
          title={
            <h4 className="text-[#03b89e] hover:text-[#1384ad] transition-colors duration-[0.5s] text-[22px] font-semibold">
              {intl.formatMessage({ id: "statistics.totalPrice" })}
            </h4>
          }
        >
          <div className="overflow-x-auto mt-[-25px] h-[372px]  custom-scroll">
            <div className="mb-5 flex rtl:justify-end ltr:justify-start mx-[10px]">
              {/* <DatePicker
                picker="year"
                value={dayjs().year(selectedYear)}
                onChange={(date) => {
                  if (date) {
                    setSelectedYear(date.year());
                  }
                }}
              /> */}
            </div>
            <Badge.Ribbon
              style={{ direction: "ltr" }}
              text={
                <h4>
                  {intl.formatMessage({ id: "totalPrice" })} : {total_price}
                </h4>
              }
              color="#03b89e"
            >
              <div className="min-w-[400px] ">
                <ResponsiveContainer
                  width="100%"
                  height={300}
                  style={{ direction: "ltr" }}
                >
                  <LineChart data={orderData}>
                    <defs>
                      <linearGradient
                        id="colorOrder"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#03b89e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#03b89e"
                          stopOpacity={0.2}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" tick={{ fill: "#888" }} />
                    <YAxis tick={{ fill: "#888" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        border: "none",
                        padding: "20px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        direction: intl.locale === "ar" ? "rtl" : "ltr",
                      }}
                      formatter={(value: number) => [
                        value,
                        intl.formatMessage({ id: "statistics.price" }),
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#03b89e"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        stroke: "#fff",
                        strokeWidth: 2,
                        fill: "#03b89e",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Badge.Ribbon>
          </div>
        </Card>

        <Card
          className="w-[100%] h-[300px] min-[1116px]:h-[481px] relative flex-grow min-[1116px]:w-[40%] group"
          title={
            <h4 className="text-[#03b89e] hover:text-[#1384ad] transition-colors duration-[0.5s] text-[22px] font-semibold">
              {intl.formatMessage({
                id: "totalProductsSold",
              })}
            </h4>
          }
        >
          <div className="overflow-x-auto custom-scroll">
            <div className="min-w-[400px] h-[240px] min-[1116px]:h-[347px] flex items-center justify-center relative group">
              <div
                className="w-[230px] h-[220px]"
                style={{ clipPath: "inset(0 0 50% 0)" }}
              >
                <Progress
                  type="circle"
                  percent={50}
                  strokeColor={{
                    "16%": "#03b89e",
                    "100%": "#1384ad",
                  }}
                  trailColor="transparent"
                  strokeWidth={12}
                  width={230}
                  format={() => ""}
                  strokeLinecap="round"
                  style={{
                    transform: "rotate(-90deg)",
                  }}
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-center items-center text-[#03b89e] text-[20px] font-[600] tracking-wider">
                <div className="relative w-[230px] h-[230px] flex items-center justify-center">
                  <div
                    className="absolute arrow"
                    style={{
                      top: "60px",
                      left: "50%",
                      transform: "translateX(-50%) rotate(0deg)",
                      transformOrigin: "bottom center",
                      animation:
                        "swingArrow 1.5s linear infinite alternate-reverse",
                    }}
                  >
                    <BsArrowUpShort size={33} color="#03b89e" />
                  </div>
                </div>

                <div className="absolute flex justify-center items-center inset-0 font-bold text-[22px] text-[#03b89e]">
                  {total_products_sold}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col justify-start items-center min-[1116px]:flex-row min-[1116px]:justify-between min-[1116px]:items-start gap-3 mb-[20px]">
        <Card
          className="w-[100%] h-[420px] min-[1116px]:w-[40%] min-[1116px]:h-[465px]"
          title={
            <h4 className="text-[#03b89e] hover:text-[#1384ad] transition-colors duration-[0.5s] text-[22px] sm:text-[20px] font-semibold">
              {intl.formatMessage({ id: "statistics.OrderStatus" })}
            </h4>
          }
        >
          <div className="overflow-x-auto custom-scroll h-[330px]">
            <div className="overflow-x-auto custom-scroll h-[330px]">
              <div className="min-w-[300px]">
                {ordersStatus.map((stat, idx) => {
                  const color =
                    gradientColors[idx % gradientColors.length].from;
                  return (
                    <div key={idx} style={{ marginBottom: 20 }}>
                      <span
                        className="block mb-1 font-medium"
                        style={{ color }}
                      >
                        <FormattedMessage id={stat.name} />
                      </span>
                      <Progress
                        percent={(stat.value / maxOrders) * 100}
                        strokeColor={{
                          "0%": color,
                          "100%":
                            gradientColors[idx % gradientColors.length].to,
                        }}
                        trailColor="#f3f4f6"
                        format={(percent) => (
                          <span style={{ color }}>{Math.round(percent)}%</span>
                        )}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card
          className="w-full min-[1116px]:w-[60%] h-[465px]"
          title={
            <h4 className="text-[#03b89e] hover:text-[#1384ad] transition-colors duration-[0.5s] text-[22px] font-semibold">
              {intl.formatMessage({ id: "statistics.orders" })}
            </h4>
          }
        >
          <div className="overflow-x-auto custom-scroll h-[330px]">
            <div className="min-w-[410px] h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
                style={{ direction: "ltr" }}
              >
                <BarChart data={newOrdersData} barCategoryGap="25%" barGap={7}>
                  <defs>
                    <linearGradient
                      id="pharmacyPickupGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient
                      id="homeDeliveryGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                    <linearGradient
                      id="cashOrdersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient
                      id="creditOrdersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient
                      id="madaOrdersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#5EEAD4" />
                      <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                    <linearGradient
                      id="prescriptionOrdersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#F87171" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Legend
                    formatter={(value) => {
                      return value === "pharmacyPickup"
                        ? intl.formatMessage({
                            id: "statistics.pharmacyPickup",
                          })
                        : value === "homeDelivery"
                        ? intl.formatMessage({ id: "statistics.homeDelivery" })
                        : value === "cashOrders"
                        ? intl.formatMessage({ id: "statistics.cashOrders" })
                        : value === "creditOrders"
                        ? intl.formatMessage({ id: "statistics.creditOrders" })
                        : value === "madaOrders"
                        ? intl.formatMessage({ id: "statistics.madaOrders" })
                        : intl.formatMessage({
                            id: "statistics.prescriptionOrders",
                          });
                    }}
                  />

                  <Bar
                    dataKey="pharmacyPickup"
                    fill="url(#pharmacyPickupGradient)"
                    stroke="#10B981"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="homeDelivery"
                    fill="url(#homeDeliveryGradient)"
                    stroke="#3B82F6"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="cashOrders"
                    fill="url(#cashOrdersGradient)"
                    stroke="#F59E0B"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="creditOrders"
                    fill="url(#creditOrdersGradient)"
                    stroke="#EC4899"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="madaOrders"
                    fill="url(#madaOrdersGradient)"
                    stroke="#2DD4BF"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="prescriptionOrders"
                    fill="url(#prescriptionOrdersGradient)"
                    stroke="#EF4444"
                    strokeWidth={1}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Statistics;
