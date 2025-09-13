import ScrollerRenderView from 'components/scroller-render-view';
import MyMenu from '../menu';
import { motion } from 'framer-motion';
import { theme } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function SubSide({
  width,
  collapsed,
  variantsSubSide,
}: {
  width: ISIdeWidth;
  collapsed: boolean;
  variantsSubSide: any;
}) {
  const { token } = theme.useToken();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   const checkDark = () => {
  //     const isDark = document.documentElement.classList.contains("dark");
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
  //     attributeFilter: ["class"],
  //   });

  //   // Clean up
  //   return () => observer.disconnect();
  // }, []);

  const logoSrc = isDarkMode ? '/logo.svg' : '/logo.svg';

  return (
      <motion.div
        variants={variantsSubSide}
        style={{
          backgroundColor: token.colorBgContainer,
          width: width.sub,
        }}
        className={` ltr:pl-16 rtl:pr-16  box-border inset-y-0  border-r-2 border-indigo-100 shadow-md  ltr:rounded-tr-3xl ltr:rounded-br-3xl rtl:rounded-tl-3xl rtl:rounded-bl-3xl  !bg-[#07A869] !rounded-md`}
      >
        <div className="flex items-center justify-center flex-shrink-0 pt-4 bg-[#07A869]">
          <Link to={'/'} target="_blank">
            <img
              className="w-22 h-auto mt-2 mb-3"
              src="/logo.svg"
              width={100}
              height={39}
              alt="Mondbt Admin"
            />
          </Link>
        </div>
        <hr className="!border-b-[0.1px] !border-b-[#f8f8f8]" />
        <ScrollerRenderView
          className={`!h-[calc(100dvh_-_153px_-_13px)]  sm:!h-[calc(100dvh_-_153px)] bg-[#07A869]`}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
        >
          <div className="px-4 mt-4">
            <MyMenu collapsed={collapsed} />
          </div>
        </ScrollerRenderView>
      </motion.div>
  );
}

export default SubSide;
