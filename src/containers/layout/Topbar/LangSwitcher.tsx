import React from 'react';
import { Button, theme } from 'antd';
import { Dropdown } from 'antd';
// import languages from 'store/languageSwitcher/config';
import { useDispatch, useSelector } from 'react-redux';
// import LanguageSwitcherActions from 'store/languageSwitcher/actions';
import { GrLanguage } from 'react-icons/gr';

// const { changeLanguage } = LanguageSwitcherActions;

const LangSwitcher: React.FC = () => {
  const { token } = theme.useToken();

  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) => LanguageSwitcher.language
  );

  return (
    <div className=" bg-[#07A869] rounded-full w-[45px] h-[45px] flex justify-center items-center">
      <Button
        // onClick={() => {
        //   const langToSet = languages.options.find(
        //     ({ languageId }) => languageId !== selectedLanguage.languageId
        //   );
        //   if (langToSet) {
        //     dispatch(changeLanguage(langToSet.languageId));
        //     console.log('langswitcher', langToSet);
        //   }
        // }}
        type="text"
        className="focus-visible:!outline-none  flex items-center box-content !bg-transparent dark:text-[#fff] text-[#fff] hover:!text-[#fff]"
      >
        {/* {selectedLanguage.icon} */}
        <GrLanguage
          style={
            {
              // color:token.colorTextBase
            }
          }
          className=" text-2xl"
        />
      </Button>
    </div>
  );
};

export default LangSwitcher;
