import { BsBarChart } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { LuAlarmClock } from 'react-icons/lu';
import { MdHome, MdLocalOffer } from 'react-icons/md';
import { RiFileEditLine, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri';
import { FormattedMessage } from 'react-intl';

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

const getMenuItems = (role: number): MenuItem[] => {
  const commonItems: MenuItem[] = [
    { key: 'home', to: 'home', label: 'الصفحة الرئيسية', icon: <MdHome className="!text-xl" /> },
  ];

  const adminItems: MenuItem[] = [
    {
      key: 'attendance',
      to: 'attendance',
      label: 'الحضور',
      icon: <RiUserFollowLine className="!text-xl" />,
    },
    {
      key: 'absent',
      to: 'absent',
      label: 'الغياب',
      icon: <RiUserUnfollowLine className="!text-xl" />,
    },
    { key: 'late', to: 'late', label: 'التأخير', icon: <LuAlarmClock className="!text-xl" /> },
    {
      key: 'excuse',
      to: 'excuse',
      label: 'الاستئذان',
      icon: <RiFileEditLine className="!text-xl" />,
    },
    // { key: 'discipline_statistics', to: 'discipline_statistics', label: <FormattedMessage id="discipline_statistics" />, icon: <BsBarChart className="!text-xl" /> },
  ];

  const ministerItems: MenuItem[] = [
  {
    key: 'attendance',
    to: 'attendance',
    label: 'الحضور',
    icon: <RiUserFollowLine className="!text-xl" />,
  },
  {
    key: 'absent',
    to: 'absent',
    label: 'الغياب',
    icon: <RiUserUnfollowLine className="!text-xl" />,
  },
  { key: 'late', to: 'late', label: 'التأخير', icon: <LuAlarmClock className="!text-xl" /> },
  {
    key: 'excuse',
    to: 'excuse',
    label: 'الاستئذان',
    icon: <RiFileEditLine className="!text-xl" />,
  },
    
  ];

  const managerItems: MenuItem[] = [
  
  
];


  const parentItems: MenuItem[] = [
    // { key: 'home', to: 'home', label: <FormattedMessage id="home1" />, icon: <MdHome className="!text-xl" /> },
    // { key: 'student', to: 'student/:id', label: <FormattedMessage id="student" />, icon: <FaUsers className="!text-xl" /> },
    // { key: 'pay-fines', to: 'pay-fines', label: <FormattedMessage id="pay-fines" />, icon: <MdLocalOffer className="!text-xl" /> },
    {
      key: 'new-excuse',
      to: 'new-excuse',
      label: 'الاستئذان',
      icon: <RiFileEditLine className="!text-xl" />,
    },
  ];

  switch (role) {
    case 1:
      return [...commonItems, ...adminItems];
    case 2:
      return [...commonItems, ...ministerItems];
    case 3:
      return [...commonItems, ...managerItems];
    case 4:
      return [...commonItems, ...parentItems];
    default:
      return commonItems;
  }
};

export default getMenuItems;
