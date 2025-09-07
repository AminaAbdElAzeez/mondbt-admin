import { FormattedMessage } from "react-intl";
import { IoSettingsSharp } from "react-icons/io5";
import { FaChartLine, FaCodeBranch } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { MdHome, MdLocationCity } from "react-icons/md";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { GiModernCity } from "react-icons/gi";
import {
  RiFileEditLine,
  RiListUnordered,
  RiUserFollowLine,
  RiUserUnfollowLine,
} from "react-icons/ri";
import { MdOutlineFormatListNumbered, MdReportProblem } from "react-icons/md";
import { FaPrescriptionBottle } from "react-icons/fa";
import { PiFlagBannerFoldBold } from "react-icons/pi";
import { FaQuestionCircle } from "react-icons/fa";
import { RiCoupon4Line } from "react-icons/ri";
import { BiSolidContact } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { MdStarRate } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { GrUserExpert } from "react-icons/gr";
import { LuPenLine } from "react-icons/lu";
import { FaFilePen } from "react-icons/fa6";
import { BsBarChart } from "react-icons/bs";

// Registrations

interface MenuItem {
  key: string;
  to?: string;
  icon?: any;
  label: any;
  onClick?: () => void;
  hidden?: boolean;
  disabled?: boolean;
  children?: MenuItem[];
}
// const getMenuItems: (profile: any) => MenuItem[] = (profile) => {
const getMenuItems: () => MenuItem[] = () => {
  //console.log("profileData",profile?.roles[0])
  //const role = profile?.roles[0].roleName;

  return [
    {
      key: "home",
      to: "home",
      label: <FormattedMessage id="home1" />,
      icon: <MdHome className="!text-xl" />,

      disabled: false,
    },

    // {
    //   key:"master-data",
    //   label: <FormattedMessage id="master-data" />,
    //   icon: <BiCategoryAlt className="!text-xl" />,
    //   disabled: false,
    //   children:[
    //     {
    //       key: "branches",
    //       to: "master-data/branches",
    //       label: <FormattedMessage id="branches" />,
    //       icon: <FaCodeBranch className="!text-xl" />,
    //       disabled: false,
    //       //hidden: false,
    //     },
    //     {
    //       key: "categories",
    //       to: "master-data/categories",
    //       label: <FormattedMessage id="categories" />,
    //       icon: <BiCategoryAlt className="!text-xl" />,
    //       disabled: false,
    //       //hidden: false,
    //     },
    //     {
    //       key: "brands",
    //       to: "master-data/brands",
    //       label: <FormattedMessage id="brands" />,
    //       icon: <MdOutlineBrandingWatermark className="!text-xl" />,

    //       disabled: false,
    //       //hidden: false,
    //     },
    //     {
    //       key: "cities",
    //       to: "master-data/cities",
    //       label: <FormattedMessage id="cities" />,
    //       icon: <MdLocationCity className="!text-xl" />,

    //       disabled: false,
    //       //hidden: false,
    //     },
    //     {
    //       key: "governorate",
    //       to: "master-data/governorate",
    //       label: <FormattedMessage id="governorates" />,
    //       icon: <GiModernCity className="!text-xl" />,

    //       disabled: false,
    //     },
    //     {
    //       key: "products",
    //       to: "master-data/products",
    //       label: <FormattedMessage id="products" />,
    //       icon: <AiFillProduct className="!text-xl" />,

    //       disabled: false,
    //       //hidden: false,
    //     },
    //   ]
    // },

    {
      key: "attendance",
      to: "attendance",
      label: <FormattedMessage id="attendance" />,
      icon: <RiUserFollowLine className="!text-xl" />,
      disabled: false,
    },
    {
      key: "departure",
      to: "departure",
      label: <FormattedMessage id="departure" />,
      icon: <RiUserUnfollowLine className="!text-xl" />,

      disabled: false,
      //hidden: false,
    },
    {
      key: "permission",
      to: "permission",
      label: <FormattedMessage id="permission" />,
      icon: <RiFileEditLine className="!text-xl" />,

      disabled: false,
      //hidden: false,
    },
    {
      key: "discipline_statistics",
      to: "discipline_statistics",
      label: <FormattedMessage id="discipline_statistics" />,
      icon: <BsBarChart className="!text-xl" />,

      disabled: false,
      //hidden: false,
    },
    // {
    //   key: "offers",
    //   to: "offers",
    //   label: <FormattedMessage id="offers" />,
    //   icon: <MdLocalOffer className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },

    // {
    //   key: "coupons",
    //   to: "coupons",
    //   label: <FormattedMessage id="coupons" />,
    //   icon: <RiCoupon4Line className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },
    // {
    //   key: "banners",
    //   to: "banners",
    //   label: <FormattedMessage id="banners" />,
    //   icon: <PiFlagBannerFoldBold className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },

    // {
    //   key: "rates",
    //   to: "rates",
    //   label: <FormattedMessage id="rates" />,
    //   icon: <MdStarRate className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },
    // {
    //   key: "clients-support",
    //   to: "clients-support",
    //   label: <FormattedMessage id="clients-support" />,
    //   icon: <BiSolidContact className="!text-xl" />,
    //   disabled: false,
    // },
    // {
    //   key: "faq",
    //   to: "faq",
    //   label: <FormattedMessage id="faq" />,
    //   icon: <FaQuestionCircle className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },
    // {
    //   key: "problems",
    //   to: "problems",
    //   label: <FormattedMessage id="problems" />,
    //   icon: <MdReportProblem className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },
    // {
    //   key: "settings",
    //   to: "settings",
    //   label: <FormattedMessage id="settings" />,
    //   icon: <IoSettingsSharp className="!text-xl" />,

    //   disabled: false,
    //   //hidden: false,
    // },
  ];
};
export default getMenuItems;
