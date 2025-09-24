import { useState, Fragment, useEffect } from 'react';
import { Link, json, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LangSwitcher from 'containers/layout/Topbar/LangSwitcher';
// import ThemesSwitcher from 'containers/layout/Topbar/ThemesSwitcher';
import { Button, Card } from 'antd';
import { useSelector } from 'react-redux';
import SmallLogo from 'components/LogoWraper/small-logo';
import { FormattedMessage } from 'react-intl';

function Index() {
  const data = useLoaderData();
  const [visiable, setVisiable] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  let redirectPath = '/';
  if (role === '1') {
    redirectPath = '/admin/home';
  } else if (role === '2') {
    redirectPath = '/minister/home';
  } else if (role === '3') {
    redirectPath = '/manager/home';
  } else if (role === '4') {
    redirectPath = '/parent/home';
  }

  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const checkDark = () => {
  //     const isDark = document.documentElement.classList.contains('dark');
  //     setIsDarkMode(isDark);
  //   };

  //   // Initial check
  //   checkDark();

  //   // Observer to watch for class changes
  //   const observer = new MutationObserver(() => {
  //     checkDark();
  //   });

  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ['class'],
  //   });

  //   // Clean up
  //   return () => observer.disconnect();
  // }, []);

  // const logoSrc = isDarkMode ? '/bg-logo.svg' : '/bg-logo.svg';

  return (
    <div className="bg-texture-light dark:bg-texture-dark">
      <div className="box-border min-w-screen min-h-screen  flex items-center container mx-auto justify-center px-2 py-5">
        <div className="box-border absolute inset-x-0 top-0 w-full flex items-center justify-between container mx-auto py-5 px-2">
          <div className="flex items-center w-full text-[#3730a3] no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
            <Link to={'/'} className="p-3 rounded-md !bg-[#07A869]">
              <img
                className=" h-auto rounded-md w-[70px] md:w-[95px]"
                src="/bg-logo.svg"
                // width={95}
                // height={73}
                alt="Mondbt Admin"
              />
            </Link>
          </div>
          <ul className="flex gap-3 items-center">
            {/* <li className="isoUser flex">
              <LangSwitcher />
            </li> */}
            {/* <li className="isoUser">
              <ThemesSwitcher />
            </li> */}
          </ul>
        </div>
        <motion.div
          initial={{ y: -150, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="w-full max-w-sm"
        >
          <Card className="box-border bg-transparent  rounded-3xl shadow-lg  text-gray-600 sm:px-4 py-3 border border-[#DDDDDD]">
            <div className="overflow-hidden relative">
              <div className="overflow-hidden relative cursor-grab">
                <div className="flex gap-2 flex-col sm:gap-4 justify-center items-center">
                  <div className="p-3 rounded-md !bg-[#07A869]">
                    <Link to={redirectPath}>
                      <img
                        className="h-auto rounded-md w-[70px] md:w-[95px] cursor-pointer"
                        src="/bg-logo.svg"
                        alt="Mondbt Admin"
                      />
                    </Link>
                  </div>

                  <AnimatePresence>
                    {visiable && (
                      <motion.div
                        className="flex justify-center w-[128px]"
                        // animate={{width:165 }}
                        transition={{ duration: 0.6 }}
                        exit={{ width: 0, scale: 0, opacity: 0 }}
                      >
                        <Button
                          onClick={() => {
                            setVisiable(false);
                            setTimeout(() => {
                              navigate('/login');
                            }, 600);
                          }}
                          className="!bg-[#07A869] text-white rounded-lg !h-auto w-auto whitespace-normal hover:!text-[#07A869] !border-[#07A869] hover:!bg-[#fff] transition-colors duration-500"
                          size="large"
                          //type="primary"
                        >
                          لوحة التحكم
                          {/* <FormattedMessage id="open-administrator" /> */}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // return (
  //   <div className="card p-4 overflow-y-auto overflow-x-hidden h-screen">
  //    <ul>

  //      {y(routes[0] , true)}
  //     </ul>
  //     {/* <OrganizationChart selectionMode="multiple" value={[x(routes[0])]} nodeTemplate={nodeTemplate} /> */}
  //   </div>
  // );
}

export default Index;

export const loader = () => {
  console.log('welcome from loader');
  return json(
    {
      sorry: 'You have been fired.',
      hrEmail: 'hr@bigco.com',
    },
    { status: 401, statusText: 'u are not authorized' }
  );
};
