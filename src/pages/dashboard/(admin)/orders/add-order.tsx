import React, { useEffect, useState } from "react";
import { Select, Button, Radio, Collapse, message } from "antd";
import { FaPlus } from "react-icons/fa";
import { useForm } from "antd/lib/form/Form";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { AddUserModal } from "./modals";
import type { RadioChangeEvent } from "antd";

import axios from "utlis/library/helpers/axios";
import Map from "components/Map";
import { fetchLatLngSuccess } from "store/map/actions";
import { UploadOutlined } from "@ant-design/icons";
import { Image, Upload, Input, Modal, Form } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";

import { IoCloseOutline, IoCloseSharp, IoLocationSharp } from "react-icons/io5";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export interface city {
  id: number;
  name: string;
}
export interface address {
  city_id: string;
  address: string;
  governorate?: string;
  lat: string;
  lng: string;
}

function AddOrder() {
  const selectedLanguage = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );
  const [userAddresses, setUserAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [branches, ش] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsView, setProductsView] = useState([]);
  const [productsSent, setProductsSent] = useState([]);
  const [subcategoryLoading, setSubcategoryLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [userId, setUserId] = useState(undefined);
  const [addressId, setAddressId] = useState(undefined);
  const [subCategoryId, setSubCategoryId] = useState(undefined);
  const [productId, setProductId] = useState(undefined);
  const [pickupMethod, setPickupMethod] = useState(1);
  const [pageSections, setPageSections] = useState("products");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalExcVat, setTotalExcVat] = useState(0);
  const [branchId, setBranchId] = useState(undefined);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [vat, setVat] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [cashDeliveryFees, setCashDeliveryFees] = useState(0);
  /////
  const intl = useIntl();
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const dispatch = useDispatch();
  const [cities, setCities] = useState<city[]>([]);
  const [governorates, setGovernorates] = useState<city[]>([]);
  const [cityLoading, setCityLoading] = useState(true);
  const [governorateLoading, setGovernorateLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const { TextArea } = Input;
  const { lat, lng } = useSelector(
    (state: { MapReducer: any }) => state.MapReducer
  );
  const [addressForm, setAddressForm] = useState({
    city_id: "",
    address: "",
    governorate: "",
    lat: "",
    lng: "",
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const [addAddressBtnClicked, setAddAddressBtnClicked] = useState(false);
  /////
  const [form] = useForm();
  const availabilityObj: { [key: string]: JSX.Element } = {
    "1": <p className="text-primary">{<FormattedMessage id="available" />}</p>,
    "2": (
      <p className="text-[#EFC04D]">
        {<FormattedMessage id="partially-avalaible" />}
      </p>
    ),
    "3": (
      <p className="text-[#ff4d4f]">
        {<FormattedMessage id="not-available" />}
      </p>
    ),
  };
  // const branches = [
  //   {
  //     branch_id: 5,
  //     branch_name: "صيدلية اوت لت بلس رقم   ( الشرفة 3)",
  //     availability: 1,
  //     product_availability: [
  //       {
  //         product_id: 532,
  //         product_name: "Serave Baby Wash & Shampoo 473ml PO*",
  //         product_image: "https://up.outletplus.sa/products/30105739.PNG",
  //         product_price: "86.95",
  //         brand_name: "CERAVE",
  //         requires_prescription: 0,
  //         required_quantity: 1,
  //         available_quantity: 6,
  //         offer_details: null,
  //         is_available: 1,
  //       },
  //     ],
  //   },
  // ];

  ////// prescription section
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [prescriptions, setPrescriptions] = useState<any>([]);

  // Handle preview in Ant Design modal
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // Handle file changes (Upload)
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // Ensure only valid files with `originFileObj` are stored
    // const validFiles = newFileList.filter((file) => file.originFileObj);
    setFileList(newFileList);
    console.log("prescription uploaded:", newFileList);
    setPrescriptions(newFileList);
  };

  // Handle file removal
  const handleRemove = (file: UploadFile) => {
    setFileList((prevFileList) => {
      const updatedFileList = prevFileList.filter(
        (item) => item.uid !== file.uid
      );
      setPrescriptions(updatedFileList);

      return updatedFileList;
    });
  };

  // Track fileList updates
  useEffect(() => {
    console.log("Updated fileList:", fileList);
  }, [fileList]); // Logs after state updates

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <UploadOutlined className="text-[24px]" />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  //////
  const onRecieveOrderWayChange = (e: RadioChangeEvent) => {
    setPickupMethod(e.target.value);
    console.log("radio checked", e.target.value);
  };

  const getLangFromHtml = () => document.documentElement.lang || "ar";
  const lang = getLangFromHtml();
  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  /// fetch user addresses
  const fetcUserAddresses = async (id: number) => {
    try {
      setAddressesLoading(true);
      const response = await axios.get(`admin/addresses/users/${id}`);
      const data = await response?.data?.data;
      console.log("user addresses", data);
      setUserAddresses(data);
      setAddressesLoading(false);
    } catch (err: any) {
      setAddressesLoading(false);
    }
  };
  /// fetch users data
  const fetchData = async () => {
    const { data } = await axios.get(`admin/users`);

    return data?.data;
  };
  const {
    data: users,
    isLoading: usersLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fetchData"],
    queryFn: fetchData,
    // refetchInterval: 5000,
  });

  /// fetch categories
  const fetchCategories = async () => {
    const { data } = await axios.get(`admin/categories`);
    return data?.data;
  };

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: categoriesRefetch,
  } = useQuery({
    queryKey: ["fetchCategoriesData", selectedLanguage],
    queryFn: fetchCategories,
    // refetchInterval: 5000,
  });

  /// fetch sub categories
  const fetchSubCategories = async (id: number) => {
    try {
      setSubcategoryLoading(true);
      const response = await axios.get(
        `admin/sub-categories?filter[category_id]=${id}`
      );
      const data = await response?.data?.data;

      setSubcategories(data);
      setSubcategoryLoading(false);
    } catch (err: any) {
      setSubcategoryLoading(false);
    }
  };

  /// fetch settings to get vat ,shipping and cash delivery values
  const fetchVatShippingCash = async () => {
    try {
      setSubcategoryLoading(true);
      const response = await axios.get(`admin/settings`);
      const data = await response?.data?.data;
      setVat(data?.vat);
      setCashDeliveryFees(data?.cash_delivery_fee);
      setTotalShipping(data?.shipping_price);
      //console.log("settings data", data);
    } catch (err: any) {}
  };

  /// fetch products
  const fetchProducts = async (id: number) => {
    try {
      const response = await axios.get(
        `admin/products?filter[sub_category_id]=${id}`
      );
      const data = await response?.data?.data;
      setProducts(data);
      setProductLoading(false);
    } catch (err: any) {
      setProductLoading(false);
    }
  };
  const onUsersChange = (value: number, option: any) => {
    setUserAddresses([]);
    setAddressId(undefined);
    setAddressesLoading(true);
    setUserId(value);
    fetcUserAddresses(value);
    console.log("user", option);
  };
  const onAddressChange = (value: number) => {
    setAddressId(value);
  };
  const onCategoryChange = (value: number) => {
    setSubcategories([]);
    setSubCategoryId(undefined);
    setProductId(undefined);
    setSubcategoryLoading(true);
    setProductLoading(true);
    setProducts([]);
    fetchSubCategories(value);
  };
  const onSubCategoryChange = (value: number) => {
    setProducts([]);
    setSubCategoryId(value);
    setProductId(undefined);
    setProductLoading(true);
    fetchProducts(value);
  };
  useEffect(() => {
    //console.log("productsView", productsView);
    let total = 0;
    let totalExcVat = 0;
    if (productsView.length === 0) {
      setTotalPrice(0);
      setTotalExcVat(0);
      return;
    }
    for (let i = 0; i < productsView.length; i++) {
      total += productsView[i].price * productsView[i].quantity;
      totalExcVat += productsView[i].price_before * productsView[i].quantity;
      //console.log("total", total);
      setTotalPrice(total);
      setTotalExcVat(totalExcVat);
    }
  }, [productsView]);

  /// fetch Branches
  const fetchBranches = async () => {
    const products = productsView.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    const dataBody = {
      address_id: addressId,
      products: products,
    };

    try {
      const response = await axios.post("/admin/check-inventory", dataBody, {
        headers: {
          "X-Device": "admin",
        },
      });
      const data = await response?.data?.data;
      ش([...data]);
      // console.log("Response Data:", response.data);
    } catch (err: any) {
      //  console.error("Error Response:", err.response?.data);
    }
  };

  useEffect(() => {
    if (addressId && productsView.length > 0) {
      fetchBranches();
    }
  }, [addressId, productsView]);

  //   useEffect(()=>{
  // console.log("productsView changed:", productsView);
  //   },[productsView])

  const onProductsChange = (value: number) => {
    //console.log("Selected User:", selectedUser);
    setProductId(value);
    const selectedUser = products?.find((user) => user?.id === value);
    const checked = productsView?.some((product) => product.id !== value);
    if (productsView?.length > 0) {
      if (checked) {
        selectedUser.quantity = 1;
        setProductsView([...productsView, selectedUser]);

        //  setProductsSent([...productsSent, { id: value, quantity: 1 }]);
      } else {
        setProductsView([...productsView]);
        // setProductsSent([...productsSent])
      }
    } else {
      selectedUser.quantity = 1;
      setProductsView([...productsView, selectedUser]);

      //setProductsSent([...productsSent, { id: value, quantity: 1 }]);
    }
  };

  /// confirm order
  const checkoutMutation = useMutation({
    mutationFn: (values: FormData) =>
      axios.post("admin/orders", values, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Device": "admin",
        },
        // headers: {
        //   "Accept-Language": `${locale === "en" ? "en-US" : "ar-SA"}`,
        // },
      }),
  });

  const checkoutFunc = () => {
    const products = productsView.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));
    if (!branchId) {
      message.warning(<FormattedMessage id="please-select-branch" />);
      return;
    }

    // setConfirmOrder(true);

    const formData = new FormData();

    if (prescriptions.length > 0) {
      console.log("prescriptions", prescriptions);
      prescriptions.forEach((file: any, index: any) => {
        const fileToAppend = file.originFileObj ? file.originFileObj : file;
        console.log("fileToAppend", fileToAppend);
        formData.append(`prescriptions[]`, fileToAppend);
      });
    }
    formData.append("user_id", userId);
    formData.append("branch_id", branchId);
    formData.append("address_id", addressId);
    //formData.append("products[0]", JSON.stringify(products));
    products.forEach((product, index) => {
      formData.append(`products[${index}][id]`, String(product.id)); // Convert ID to string
      formData.append(`products[${index}][quantity]`, String(product.quantity));
    });

    formData.append("delivery_method", pickupMethod.toString());
    // if (promoCodeId) {
    //   formData.append("coupon", promoCodeId);
    // }

    checkoutMutation.mutate(formData, {
      onSuccess: (res) => {
        // console.log("checkout", res.data);
        const data = res?.data?.data;

        message.success(res.data.message);
        navigate("/admin/orders");
      },
    });
  };

  //// add user logic
  const addUsersMutation = useMutation({
    mutationFn: (values: any) => axios["post"](`admin/users`, values),
    onSuccess: (res) => {
      setAddUserOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addUserFunc = (values: any) => {
    addUsersMutation.mutate(values);
  };

  ////add address logic
  // const fetchCitiesData = async () => {
  //   try {
  //     setCityLoading(true);
  //     const response = await axios.get(`/cities`);
  //     const data = response?.data?.data;

  //     setCities([...data]);
  //     setCityLoading(false);
  //   } catch (err: any) {
  //     message.error(err?.message);
  //   }
  // };

  const fetchCitiesData = async (governorateId) => {
    try {
      setCityLoading(true);
      const response = await axios.get(
        `/cities?filter[governorate_id]=${governorateId}`,
        {
          headers: {
            "x-Language": intl.locale === "ar" ? "ar-SA" : "en",
          },
        }
      );
      const data = response?.data?.data;
      setCities(data);
    } catch (err) {
      message.error(err?.message);
    } finally {
      setCityLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernorateData();
  }, [intl.locale]);

  // const fetchGovernorateData = async () => {
  //   try {
  //     setGovernorateLoading(true);
  //     const response = await axios.get("/governorates");
  //     const data = response?.data?.data;

  //     setGovernorates([...data]);
  //     setGovernorateLoading(false);
  //   } catch (err: any) {
  //     //console.error(err?.data?.message);
  //     message.error(err?.message);
  //   }
  // };

  const fetchGovernorateData = async () => {
    try {
      setGovernorateLoading(true);
      const response = await axios.get("/governorates");
      const data = response?.data?.data;
      setGovernorates(data);
      setGovernorateLoading(false);
    } catch (err) {
      message.error(err?.message);
      setGovernorateLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernorateData();
    fetchVatShippingCash();
  }, []);

  useEffect(() => {
    if (selectedGovernorate) {
      fetchCitiesData(selectedGovernorate);
    } else {
      setCities([]);
    }
  }, [selectedGovernorate, intl.locale]);

  useEffect(() => {
    form.setFieldsValue({
      governorate: addressForm.governorate,
      city_id: addressForm.city_id,
      address: addressForm.address,
    });
  }, [addressForm, form]);

  const onGovernorateChange = (value) => {
    setSelectedGovernorate(value);
    setSelectedCity(null);
    form.setFieldsValue({ city_id: undefined });
    // fetchCitiesData(value);
  };

  const onCityChange = (value) => {
    setSelectedCity(value);
    setAddressForm((prev) => ({ ...prev, city_id: value }));
  };

  useEffect(() => {
    form.setFieldsValue({
      governorate_id: selectedGovernorate,
      city_id: selectedCity,
      address: addressForm.address,
    });
  }, [selectedGovernorate, selectedCity, addressForm.address, form]);

  // const onSearch = (value: string) => {
  //   console.log("search:", value);
  // };
  //// add address func
  const addAddressMutation = useMutation({
    mutationFn: (values: any) =>
      axios["post"]("admin/addresses", values, {
        // headers: {
        //   "Accept-Language": `${locale === "en" ? "en-US" : "ar-SA"}`,
        // },
      }),
    onSuccess: (res) => {
      console.log(res.data);

      message.success(res.data.message);
      dispatch(fetchLatLngSuccess({ lat: "", lng: "" }));
      setAddAddressOpen(false);
      fetcUserAddresses(userId);
      //router.push("/address");
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;

      message.error(message, {
        position: "top-center",
        duration: 3000,
      });
    },
  });
  const addAddressFunc = (item: address) => {
    if (!lat || !lng) return;

    // delete item.governorate;
    const addressObj = { ...item, lat, lng, user_id: userId };
    addAddressMutation.mutate(addressObj);
  };

  return (
    <>
      {pageSections === "products" && (
        <div className="py-10">
          <div className="flex gap-10 justify-between">
            <div>
              <div className="flex gap-10 flex-wrap">
                <div className="flex items-center py-2 ">
                  <Button
                    type="primary"
                    className="shadow-none me-2"
                    icon={<FaPlus />}
                    shape="circle"
                    // loading={loading}
                    onClick={() => {
                      setAddUserOpen(true);
                    }}
                  />
                  <Select
                    // value={addressForm.governorate} // Ensure correct value is used
                    showSearch
                    disabled={usersLoading}
                    placeholder={
                      <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                        <FormattedMessage id="select-user" />
                      </span>
                    }
                    optionFilterProp="label"
                    onChange={onUsersChange}
                    onSearch={onSearch}
                    className="my-2 min-w-[200px] dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                    options={users?.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                  />
                </div>
                <div className="flex items-center py-2">
                  <Button
                    type="primary"
                    className="shadow-none me-2"
                    icon={<FaPlus />}
                    shape="circle"
                    // loading={loading}
                    onClick={() => {
                      if (userId) {
                        setAddAddressOpen(true);
                      } else {
                        message.warning(
                          intl.formatMessage({
                            id: "please-select-user",
                          })
                        );
                      }
                    }}
                  />
                  <Select
                    // value={addressForm.governorate} // Ensure correct value is used
                    value={addressId}
                    showSearch
                    disabled={addressesLoading}
                    placeholder={
                      <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                        <FormattedMessage id="select-address" />
                      </span>
                    }
                    optionFilterProp="label"
                    onChange={onAddressChange}
                    onSearch={onSearch}
                    className="my-2 min-w-[200px] dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                    options={userAddresses?.map((add) => ({
                      value: add.id,
                      label: add.address,
                    }))}
                  />
                </div>
              </div>
              <div className="flex gap-10 py-5 flex-wrap">
                <Select
                  // value={addressForm.governorate} // Ensure correct value is used
                  showSearch
                  disabled={categoriesLoading}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="select-category" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={onCategoryChange}
                  onSearch={onSearch}
                  className="my-2 min-w-[200px] dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  options={categories?.map((category) => ({
                    value: category.id,
                    label:
                      selectedLanguage?.locale === "en"
                        ? category.name_en
                        : category.name_ar,
                  }))}
                />
                <Select
                  // value={addressForm.governorate} // Ensure correct value is used
                  value={subCategoryId}
                  showSearch
                  disabled={subcategoryLoading}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="select-subcategory" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={onSubCategoryChange}
                  onSearch={onSearch}
                  className="my-2 min-w-[200px] dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  options={subcategories?.map((subcategory) => ({
                    value: subcategory.id,
                    label:
                      selectedLanguage?.locale === "en"
                        ? subcategory.name_en
                        : subcategory.name_ar,
                  }))}
                />
                <Select
                  // value={addressForm.governorate} // Ensure correct value is used
                  value={productId}
                  showSearch
                  disabled={productLoading}
                  placeholder={
                    <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                      <FormattedMessage id="select-product" />
                    </span>
                  }
                  optionFilterProp="label"
                  onChange={onProductsChange}
                  onSearch={onSearch}
                  className="my-2 min-w-[200px] dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                  options={products?.map((product) => ({
                    value: product.id,
                    label:
                      selectedLanguage?.locale === "en"
                        ? product.name_en
                        : product.name_ar,
                  }))}
                />
              </div>
              <div className="py-5">
                <div className="rounded-[10px] bg-custom-gradient p-4 border-solid border-[1px] border-primary">
                  <p className="pb-2">
                    {<FormattedMessage id="select-your-delivery-method" />}
                  </p>
                  <Radio.Group
                    onChange={onRecieveOrderWayChange}
                    value={pickupMethod}
                  >
                    <Radio value={1}>
                      <FormattedMessage id="pharmacy-pickup" />
                    </Radio>
                    <Radio value={2}>
                      <FormattedMessage id="home-delivery" />
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="py-2 ">
                <div className="rounded-[10px] bg-custom-gradient my-4 p-2 border-solid border-[1px] border-primary">
                  <p className="  text-[16px] md:text-[18px]">
                    <FormattedMessage id="order-items" />
                  </p>
                </div>
                {productsView?.map((item: any, index: any) => (
                  <div
                    key={item?.id}
                    className="cart-product flex justify-between items-center py-4  border-b-[1px]  border-gray-300"
                  >
                    <div className="flex items-center justify-start ">
                      <div className="min-w-[125px] flex items-center justify-start">
                        <IoIosCloseCircleOutline
                          className={`text-[24px] w-[25px] h-[25px] mx-1  
                    
                     
                      text-[#ff0000] cursor-pointer
                    `}
                          onClick={() => {
                            const filtered = productsView.filter(
                              (product) => product.id !== item.id
                            );
                            setProductsView([...filtered]);
                          }}
                        />
                        <div
                          //  onClick={() => dispatch(saveProduct(item))}
                          className="relative p-2 bg-[#F1FBFF]"
                        >
                          <img
                            src={item?.images[0]}
                            className="h-[80px] w-[80px]  mx-auto "
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <div
                          className="relative"
                          //  onClick={() => dispatch(saveProduct(item))}
                        >
                          {/* <p className="text-primary">{item?.name_en}</p> */}
                          <p className="text-primary">
                            {selectedLanguage?.locale === "en"
                              ? item?.name_en
                              : item?.name_ar}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[18px] md:text-[20px] text-primary text-center py-2">
                        {item?.price}

                        <span className="text-[14px] ms-1">
                          {<FormattedMessage id="sar" />}
                        </span>
                      </p>
                      <div className="mx-2 rounded-[72px] flex justify-end w-[80px] sm:w-[200px] ">
                        <Button
                          className={`${
                            // updateQuantityLoading
                            false
                              ? "pointer-events-none !bg-secondary/50"
                              : "pointer-events-auto !bg-secondary"
                          } !border-none !outline-none p-2 min-h-[30px] w-[25%] rounded-s-[72px] !text-white font-semibold text-[20px]`}
                          onClick={() => {
                            if (item.quantity > 1) {
                              setProductsView((prevProducts) =>
                                prevProducts.map((product) =>
                                  product.id === item.id
                                    ? {
                                        ...product,
                                        quantity: product.quantity - 1,
                                      }
                                    : product
                                )
                              );
                            }
                          }}
                        >
                          -
                        </Button>
                        <p className="min-h-[30px] w-[50%] flex justify-center items-center bg-[#EDF4F6] text-secondary text-center">
                          {item?.quantity}
                        </p>
                        <Button
                          className={`${
                            //  updateQuantityLoading
                            false
                              ? "pointer-events-none !bg-secondary/50"
                              : "pointer-events-auto !bg-secondary"
                          } !border-none !outline-none p-2 min-h-[30px] w-[25%] rounded-e-[72px] !text-white font-semibold text-[20px]`}
                          onClick={() => {
                            setProductsView((prevProducts) =>
                              prevProducts.map((product) =>
                                product.id === item.id
                                  ? {
                                      ...product,
                                      quantity: product.quantity + 1,
                                    }
                                  : product
                              )
                            );
                          }}
                          // disabled={updateQuantityLoading}
                        >
                          +
                        </Button>
                        {/* <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={updateQuantityLoading || item.quantity <= 1}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={updateQuantityLoading}>+</button> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:min-w-[30%]">
              <div className="bg-custom-gradient lg:min-w-[30%] h-fit border-[1px] border-solid border-primary rounded-[10px] p-4">
              <div className="f py-1">
                <p className=" text-[18px] md:text-[20px] py-2 text-primary">
                  <FormattedMessage id="shopping-cart-summary" />
                </p>
              </div>
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("subtotal-exc-vat")}
                        </p>
                        <p className="text-gray-600">
                          {itemsTotalPrice}
                          
                          {"sar"}{" "}
                        </p>
                      </div> */}
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("subtotal-incl-vat")}
                        </p>
                        <p className="text-gray-600 ps-3">
                          {itemsTotalPrice +
                            (+itemsTotalPrice * +vatRatio) / 100}{" "}
                          <span className="inline-block mx-1">
                            <Image
                              src={"/images/currancy.png"}
                              alt="currancy icon"
                              width={16}
                              height={16}
                            />
                          </span>
                          
                        </p>
                      </div> */}
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("vat")}
                        </p>
                        <p className="text-gray-600 ps-3">{vatRatio} % </p>
                      </div> */}
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="total-price-without-vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {Number(totalExcVat)?.toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="total-price-with-vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {Number(totalPrice)?.toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {(Number(totalPrice) - Number(totalExcVat)).toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              {Number(totalPrice) > 0 && pickupMethod === 2 && (
                <>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="shipping-price" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {Number(totalShipping)?.toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="shipping-price-vat" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {((Number(totalShipping) / 100) * Number(vat)).toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="cash-delivery-fee" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {Number(cashDeliveryFees)?.toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>

                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="cash-delivery-fee-vat" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {((Number(cashDeliveryFees) / 100) * Number(vat)).toFixed(
                        2
                      )}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* <div className="flex justify-between items-center py-1">
                  <p className="font-semibold max-w-[225px] sm:max-w-full">
                    <FormattedMessage id="discount" />
                  </p>
                  <p className="text-gray-600 ps-3">
                   
                    
                  </p>
                </div> */}
              <div className="flex gap-2 justify-between items-center py-4 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full text-primary">
                  <FormattedMessage id="total-price" />
                </p>
                <div className="flex justify-center items-center">

                <p className="font-semibold ps-3">
                  {Number(totalPrice) > 0
                    ? (
                        Number(totalPrice) +
                        (pickupMethod === 2
                          ? Number(totalShipping) +
                            (Number(totalShipping) / 100) * Number(vat) +
                            Number(cashDeliveryFees) +
                            (Number(cashDeliveryFees) / 100) * Number(vat)
                          : 0)
                      ).toFixed(2)
                    : "0.00"}
                </p>
                <Image
                  src={"/currancy.png"}
                  alt="currancy icon"
                  width={16}
                  height={16}
                  preview={false}
                />
                </div>
              </div>
            </div>
            </div>
          </div>

          <div className="mt-[50px] flex justify-center items-center">
            <Button
              className={`py-3 px-6 text-[18px] md:text-[20px] min-h-[40px] bg-primary text-white rounded-[10px] hover:${
                productsView.length === 0 || !addressId ? "" : "bg-white"
              } hover:${
                productsView.length === 0 || !addressId ? "" : "text-primary"
              } border-[1px] border-primary `}
              disabled={productsView.length === 0 || !addressId}
              onClick={() => {
                const prescription = productsView.some(
                  (product) => product.requires_prescription === 1
                );
                if (prescription) {
                  setPageSections("prescription");
                } else {
                  setPageSections("confirm");
                }
              }}
            >
              <FormattedMessage id="continue" />
              {selectedLanguage.locale === "ar" ? (
                <FaArrowLeft />
              ) : (
                <FaArrowRight />
              )}
            </Button>
          </div>
        </div>
      )}
      {pageSections === "prescription" && (
        <>
          <p
            className="cursor-pointer py-4 hover:text-gray-500 flex items-center"
            onClick={() => setPageSections("products")}
          >
            {selectedLanguage.locale === "en" ? (
              <MdArrowBackIos />
            ) : (
              <MdArrowForwardIos />
            )}
            <FormattedMessage id="back" />
          </p>
          <div className="my-8">
            <p className="py-2 text-[20px] font-semibold">
              <FormattedMessage id="upload-prescription" />
            </p>
            <p className="text-[#8C8C8C] text-[12px] md:text-[16px]">
              <FormattedMessage id="complete-order-upload-prescription" />
            </p>
          </div>
          <div className="flex gap-5 items-center justify-between flex-wrap">
            <div>
              {productsView?.map(
                (item: any, index: any) =>
                  item?.requires_prescription === 1 && (
                    <div
                      key={item?.id}
                      className="cart-product flex justify-between items-center py-4 gap-5 border-b-[1px]  border-gray-300"
                    >
                      <div className="flex items-center justify-start ">
                        <div className="min-w-[125px] flex items-center justify-start">
                          <div
                            //  onClick={() => dispatch(saveProduct(item))}
                            className="relative p-2 bg-[#F1FBFF]"
                          >
                            <img
                              src={item?.images[0]}
                              className="h-[80px] w-[80px]  mx-auto "
                            />
                          </div>
                        </div>
                        <div className="px-2">
                          <div
                            className="relative"
                            //  onClick={() => dispatch(saveProduct(item))}
                          >
                            {/* <p className="text-primary">{item?.name_en}</p> */}
                            <p className="text-primary">
                              {selectedLanguage?.locale === "en"
                                ? item?.name_en
                                : item?.name_ar}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[18px] md:text-[20px] text-primary text-center py-2">
                          {item?.price}

                          <span className="text-[14px] ms-1">
                            {<FormattedMessage id="sar" />}
                          </span>
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
            <div className="flex flex-col flex-grow justify-center items-center mt-[50px]">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove} // Handle delete action
              >
                {fileList.length >= 4 ? null : uploadButton}
              </Upload>

              {/* Ant Design Image Preview Modal */}
              {previewImage && (
                <Image
                  wrapperStyle={{ display: "none" }}
                  key={previewImage}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </div>
          <div className="mt-[100px] mx-auto flex justify-center items-center">
            <Button
              className={`py-3 px-6 text-[18px] md:text-[20px] min-h-[40px] bg-primary text-white rounded-[10px] hover:${
                prescriptions.length === 0 ? "" : "bg-white "
              } hover:${
                prescriptions.length === 0 ? "" : "text-primary"
              } border-[1px] border-primary`}
              disabled={prescriptions.length === 0}
              onClick={() => {
                setPageSections("confirm");
              }}
            >
              <FormattedMessage id="continue" />
              {selectedLanguage.locale === "ar" ? (
                <FaArrowLeft />
              ) : (
                <FaArrowRight />
              )}
            </Button>
          </div>
        </>
      )}
      {pageSections === "confirm" && (
        <div className="w-full ">
          <p
            className="cursor-pointer py-4 hover:text-gray-500 flex items-center"
            onClick={() => {
              const prescription = productsView.some(
                (product) => product.requires_prescription === 1
              );
              if (prescription) {
                setPageSections("prescription");
              } else {
                setPageSections("products");
              }
            }}
          >
            {selectedLanguage.locale === "en" ? (
              <MdArrowBackIos />
            ) : (
              <MdArrowForwardIos />
            )}
            <FormattedMessage id="back" />
          </p>
          <div className="flex justify-between w-full gap-5 flex-wrap mt-[50px]">
            <div>
              {branches?.length > 0 && (
                <p className=" font-semibold pb-2">
                  <FormattedMessage id="branches" />
                </p>
              )}
              {branches?.length > 0 ? (
                branches?.map((item: any, index: any) => (
                  <>
                    <div
                      key={index}
                      className={`py-[20px] mb-[20px] border-solid border-[1px] mt-[20px] border-[#03B89E] rounded-lg bg-custom-gradient`}
                    >
                      <div className="flex justify-between items-center ">
                        <div className="flex items-center px-[20px]">
                          <Radio
                            type="primary"
                            checked={branchId === item?.branch_id}
                            onChange={() => setBranchId(item?.branch_id)}
                            // dispatch(
                            //   fetchBranchIdSuccess(item?.branch_id)
                            // )

                            // className={`mr-3  mb-[10px] ${
                            //   addressId ? "text-[#03B89E]" : "text-[#E5E5E5]"
                            // }`}
                          />

                          <p className="text-[16] font-[400] text-[#424242]  ">
                            {item?.branch_name}
                          </p>
                        </div>
                        <p className="pe-4">
                          {availabilityObj[`${item?.availability}`]}
                        </p>
                      </div>

                      {+item?.availability !== 1 && (
                        <div className="p-4">
                          <Collapse
                            items={[
                              {
                                key: "1",
                                label: (
                                  <p className="font-bold text-primary text-center md:text-[20px]">
                                    <FormattedMessage id="check-product-availability" />
                                  </p>
                                ),
                                children: (
                                  <div className="max-h-[400px] p-4 overflow-y-auto">
                                    {item?.product_availability.map(
                                      (item: any) => (
                                        <div
                                          className="flex justify-between items-center"
                                          key={item?.product_id}
                                        >
                                          <div
                                            // key={item?.product_id}
                                            className="flex items-center justify-start my-2"
                                          >
                                            <div className="px-4 py-2 bg-[#F1FBFF]">
                                              <img
                                                src={item?.product_image}
                                                className="h-[60px] w-[40px]  mx-auto "
                                              />
                                            </div>
                                            <div className="px-2">
                                              <p>
                                                {
                                                  availabilityObj[
                                                    `${item?.is_available}`
                                                  ]
                                                }
                                              </p>
                                              <p>{item?.product_name}</p>
                                              <p>
                                                {item?.product_price}{" "}
                                                <span className="inline-block mx-1">
                                                  {/* <Image
                                              src={"/images/currancy.png"}
                                              alt="currancy icon"
                                              width={18}
                                              height={18}
                                            /> */}
                                                  <FormattedMessage id="sar" />
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                          <p>
                                            <FormattedMessage id="quantity" />
                                            <span className="text-primary ms-1">
                                              {item?.required_quantity}/
                                              {item?.available_quantity}
                                            </span>
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ),
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </>
                ))
              ) : (
                <p className="py-[20px]">
                  {<FormattedMessage id="no-pharmacies-found" />}
                </p>
              )}
            </div>
            <div className="bg-custom-gradient lg:min-w-[30%] h-fit border-[1px] border-solid border-primary rounded-[10px] p-4">
              <div className="f py-1">
                <p className=" text-[18px] md:text-[20px] py-2 text-primary">
                  <FormattedMessage id="shopping-cart-summary" />
                </p>
              </div>
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("subtotal-exc-vat")}
                        </p>
                        <p className="text-gray-600">
                          {itemsTotalPrice}
                          
                          {"sar"}{" "}
                        </p>
                      </div> */}
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("subtotal-incl-vat")}
                        </p>
                        <p className="text-gray-600 ps-3">
                          {itemsTotalPrice +
                            (+itemsTotalPrice * +vatRatio) / 100}{" "}
                          <span className="inline-block mx-1">
                            <Image
                              src={"/images/currancy.png"}
                              alt="currancy icon"
                              width={16}
                              height={16}
                            />
                          </span>
                          
                        </p>
                      </div> */}
              {/* <div className="flex justify-between items-center py-1">
                        <p className="font-semibold max-w-[225px] sm:max-w-full">
                          {t("vat")}
                        </p>
                        <p className="text-gray-600 ps-3">{vatRatio} % </p>
                      </div> */}
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="total-price-without-vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {Number(totalExcVat)?.toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="total-price-with-vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {Number(totalPrice)?.toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-between items-center py-2 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full">
                  <FormattedMessage id="vat" />
                </p>
                <div className="flex justify-center items-center">
                <p className="font-semibold ps-3">
                  {(Number(totalPrice) - Number(totalExcVat)).toFixed(2)}
                </p>
                  <Image
                    src={"/currancy.png"}
                    alt="currancy icon"
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              {Number(totalPrice) > 0 && pickupMethod === 2 && (
                <>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="shipping-price" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {Number(totalShipping)?.toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="shipping-price-vat" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {((Number(totalShipping) / 100) * Number(vat)).toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="cash-delivery-fee" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {Number(cashDeliveryFees)?.toFixed(2)}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>

                  </div>
                  <div className="flex gap-2 justify-between items-center py-2 ">
                    <p className="font-semibold max-w-[225px] sm:max-w-full">
                      <FormattedMessage id="cash-delivery-fee-vat" />
                    </p>
                    <div className="flex justify-center items-center">
                    <p className="font-semibold ps-3">
                      {((Number(cashDeliveryFees) / 100) * Number(vat)).toFixed(
                        2
                      )}
                    </p>
                      <Image
                        src={"/currancy.png"}
                        alt="currancy icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    </div>
                  </div>
                </>
              )}
              {/* <div className="flex justify-between items-center py-1">
                  <p className="font-semibold max-w-[225px] sm:max-w-full">
                    <FormattedMessage id="discount" />
                  </p>
                  <p className="text-gray-600 ps-3">
                   
                    
                  </p>
                </div> */}
              <div className="flex gap-2 justify-between items-center py-4 ">
                <p className="font-semibold max-w-[225px] sm:max-w-full text-primary">
                  <FormattedMessage id="total-price" />
                </p>
                <div className="flex justify-center items-center">

                <p className="font-semibold ps-3">
                  {Number(totalPrice) > 0
                    ? (
                        Number(totalPrice) +
                        (pickupMethod === 2
                          ? Number(totalShipping) +
                            (Number(totalShipping) / 100) * Number(vat) +
                            Number(cashDeliveryFees) +
                            (Number(cashDeliveryFees) / 100) * Number(vat)
                          : 0)
                      ).toFixed(2)
                    : "0.00"}
                </p>
                <Image
                  src={"/currancy.png"}
                  alt="currancy icon"
                  width={16}
                  height={16}
                  preview={false}
                />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[50px] flex justify-center items-center">
            <Button
              className={`py-3 px-6 text-[18px] md:text-[20px] min-h-[40px] bg-primary text-white rounded-[10px] hover:${
                branchId ? "" : "bg-white"
              } hover:${
                branchId ? "" : "text-primary"
              } border-[1px] border-primary`}
              disabled={!branchId}
              loading={checkoutMutation.isPending}
              onClick={() => {
                //setPageSections("confirm");
                checkoutFunc();
              }}
            >
              <FormattedMessage id="confirm-order" />
            </Button>
          </div>
        </div>
      )}

      <AddUserModal
        open={addUserOpen}
        cancel={() => {
          setAddUserOpen(false);
          form.resetFields();
        }}
        ok={addUserFunc}
        form={form}
        loading={addUsersMutation.isPending}
      />
      {/****add address modal**** */}
      {addAddressOpen && (
        <div className="fixed top-0 left-0 z-[9999] bg-black/70 flex justify-center items-center w-full h-full">
          <div className="relative my-[50px] bg-white dark:bg-[#1f1f1f] mx-auto p-8 w-[90%] sm:w-[70%] md:w-[50%] rounded-md border-[1px] border-solid border-primary ">
            <IoCloseOutline
              className="absolute top-[10px] text-[30px]  right-[20px] md:right-[10px] cursor-pointer"
              onClick={() => setAddAddressOpen(false)}
            />
            <div
            // className="h-[80px] w-[80px] mx-auto rounded-[50%] bg-custom-gradient flex justify-center items-center"
            >
              <div
              // className="relative w-[40px] h-[60px]"
              >
                {/* <Image
                src="/images/location-logo.svg"
                fill
                style={{ objectFit: "contain" }}
                alt="location"
              /> */}
                <img />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className=" text-[18px] pb-2 mb-3 md:text-[20px] font-semibold">
                <FormattedMessage id="add-new-address" />
              </p>
              <Form
                form={form}
                className="w-full"
                onFinish={(values) => addAddressFunc(values)}
                initialValues={addressForm}
              >
                <div className="add-address flex flex-col w-full ">
                  <Form.Item
                    name="governorate_id"
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage id="governorates-required" />
                        ),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      disabled={governorateLoading}
                      placeholder={
                        <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                          <FormattedMessage id="select-governorate" />
                        </span>
                      }
                      optionFilterProp="label"
                      onChange={(value) => {
                        setSelectedGovernorate(value);
                        setSelectedCity(null);
                        form.setFieldsValue({
                          governorate_id: value,
                          city_id: undefined,
                        });
                      }}
                      className="my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                      options={governorates?.map((gov) => ({
                        value: gov.id,
                        label: gov.name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="city_id"
                    rules={[
                      {
                        required: true,
                        message: <FormattedMessage id="city-required" />,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      disabled={!selectedGovernorate || cityLoading}
                      placeholder={
                        <span className=" dark:text-[#e7e5e5] dark:!border-[#fff]">
                          <FormattedMessage id="select-city" />
                        </span>
                      }
                      optionFilterProp="label"
                      onChange={(value) => {
                        setSelectedCity(value);
                        form.setFieldsValue({ city_id: value });
                      }}
                      className="my-2 dark:[&_.ant-select-arrow]:!text-[#e7e5e5]"
                      options={cities?.map((city) => ({
                        value: city.id,
                        label: city.name,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: <FormattedMessage id="address-required" />,
                      },
                    ]}
                  >
                    <TextArea
                      onChange={() => fetchLatLngSuccess({ lat: "", lng: "" })}
                      className="my-2 placeholder:text-[#999] dark:placeholder:text-[#e7e5e5]"
                      rows={4}
                      placeholder={intl.formatMessage({
                        id: "write-your-address-details",
                      })}
                    />
                  </Form.Item>
                  <div
                    className="flex items-center pt-2 mb-2 text-primary underline w-fit cursor-pointer"
                    onClick={() => setShowMap(true)}
                  >
                    {/* <Link
                  className="flex items-center"
                  href="/address/new-address/location"
                > */}
                    <IoLocationSharp className="text-primary text-[20px]" />

                    <FormattedMessage id="pick-your-location" />
                    {/* </Link> */}
                  </div>
                  {selectedAddress && (
                    <p className="text-sm text-gray-700 px-2 mb-3">
                      {selectedAddress}
                    </p>
                  )}

                  {addAddressBtnClicked && !lat && !lng && (
                    <p className="text-[14px] text-[#ff4d4f] p-0">
                      <FormattedMessage id="location-required" />
                    </p>
                  )}
                </div>

                <Button
                  loading={addAddressMutation.isPending}
                  htmlType="submit"
                  onClick={() => {
                    setAddAddressBtnClicked(true);
                    window.scrollTo(0, 0);
                  }}
                  className="!text-white my-[20px] !bg-primary !border-none !outline-none flex justify-center items-center text-[16px] lg:text-[20px] font-semibold mx-auto  min-h-[50px] w-[100%] md:w-[70%] !rounded-[12px]"
                >
                  <FormattedMessage id="save-address" />
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}

      {showMap && (
        <div className="fixed top-0 left-0 z-[9999] bg-black/70 flex justify-center items-center w-full h-full">
          <IoMdCloseCircle
            className="absolute top-[50px] text-[30px] md:text-[50px] right-[20px] md:right-[50px] text-primary cursor-pointer"
            onClick={() => setShowMap(false)}
          />
          <div className="w-[90%] z-[999]">
            <Map
              onConfirm={(address) => {
                setSelectedAddress(address);
                setShowMap(false);
              }}
            />
            {/* <LoadScript
              googleMapsApiKey={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
              }
              onLoad={() => setMapLoaded(true)}
            >
              <div className="w-full flex justify-center items-center">
                {mapLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                ) : (
                  <p>Loading Map...</p>
                )}
              </div>
            </LoadScript> */}
          </div>
        </div>
      )}
    </>
  );
}

export default AddOrder;
