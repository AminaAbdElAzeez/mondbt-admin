import { Menu } from "antd";
// import getMenuItems from "./options";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import getMenuItems from "./menu-items"; 


const MyMenu = ({ collapsed }) => {
  const location = useLocation();
const pathname = location.pathname.split("/").filter(Boolean);
const selectedKey = pathname[pathname.length - 1] || "home";


const role = Number(localStorage.getItem("role")) || 0;
const name = localStorage.getItem("name") || "Guest";

console.log("Role:", role);
console.log("Name:", name);
console.log("Current role:", role , name);



  const transformMenuItems = (items) =>
    items.map(
      ({ key, to, label, icon, onClick, hidden, children, ...others }) => {
        if (hidden) return null;
        return {
          key,
          icon: (
            <div className="icon-wraper -ms-4 h-full px-3 leading-normal align-baseline inline-flex !text-[#fff]">
              {icon}
            </div>
          ),
          label: to ? (
            <Link to={to} className="ms-2 !text-[#fff] !text-base">
              {label}
            </Link>
          ) : (
            label
          ),
          onClick,
          children: children ? transformMenuItems(children) : undefined,
          ...others,
        };
      }
    );

const menuItems = transformMenuItems(getMenuItems(role || 0));

  return (
    <motion.div
      key={collapsed}
      initial={{ y: 30, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 0.3,
        duration: 0.3,
      }}
    >
      <style>{`.sider-antd-sub-menu.ant-menu-submenu-inline ul.ant-menu-inline{border-radius:25px;}`}</style>
      <Menu
        className="sidebarItem h-full bg-transparent !border-none"
        mode="inline"
        selectedKeys={[...pathname]}
        defaultSelectedKeys={[""]}
        items={menuItems}
      />

    </motion.div>
  );
};

export default MyMenu;
