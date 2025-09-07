import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "utlis/library/helpers/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormattedMessage, useIntl } from "react-intl";
import { FaPlus } from "react-icons/fa";
import { StarOutlined, StarFilled, SearchOutlined } from "@ant-design/icons";
import { BsBoxSeam } from "react-icons/bs";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Tooltip,
  message,
  Input,
  TableColumnsType,
  Form,
  Modal,
  Image,
  Upload,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import toast from "react-hot-toast";
import {
  fetchProductsFailure,
  fetchProductsRequest,
  fetchProductsSuccess,
} from "store/products/actions";
import RollerLoading from "components/loading/roller";
import ConfirmationModal from "./modal";
import { FiUpload } from "react-icons/fi";
import { FiDownload } from "react-icons/fi";
import FileSaver from "file-saver";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "./swipper.css";
import { IoMdImages } from "react-icons/io";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type image = {
  id: number;
  url: string;
  images: string;
};
export interface DataType {
  name_en: string;
  name_ar: string;
  // images: image[];
  images: string[];
  created_at: string;
  id: number;
  ascon_code: string;
  barcode: string;
  is_featured: boolean;
}

function Products() {
  /////states
  const dispatch = useDispatch();
  const [query, setQuery] = useState({} as any);
  const { products, loading, error } = useSelector(
    (state: { Products: any }) => state.Products
  );

  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [nameArabic, setNameArabic] = useState("");
  const [nameEnglish, setNameEnglish] = useState("");
  const [addImageOpen, setAddImageOpen] = useState(false);
  const [productId, setProductId] = useState(undefined);

  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<DataType | null>(null);
  const [form] = Form.useForm();
  const intel = useIntl();
  const [importExportLoading, setImportExportLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false); ////////
  const [search, setSearch] = useState(undefined);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewImagesModalVisible, setViewImagesModalVisible] = useState(false);
  const [viewImages, setViewImages] = useState<string[]>([]);
  const swiperRef = useRef(null);
  const { locale } = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (viewImagesModalVisible) {
      setTimeout(() => {
        swiperRef.current?.swiper?.update();
      }, 100);
    }
  }, [viewImagesModalVisible, locale]);

  ///// useEffects
  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, query, search, locale]);

  //// Fetch products from API
  const searchQuery = () => {
    let searchVal = "";
    // if (Object.keys(query).length > 0) {
    //   for (let x in query) {
    //     search = `${search}` + `&${x}=${query[x]}`;
    //   }
    // }
    if (search) {
      searchVal = `filter[search]=${search}`;
    }
    return searchVal;
  };
  const fetchProducts = async () => {
    const params: { [key: string]: string | number | {} } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    params.query = query;
    const searchParams = searchQuery();
    dispatch(fetchProductsRequest());
    try {
      const { data } = await axios.get(
        `admin/products?skip=${params?.skip}&take=${params?.take}&${searchParams}`
      );
      setPagination((current) => ({
        ...current,
        totalCount: data?.count,
      }));
      dispatch(fetchProductsSuccess(data.data));
      return data.data;
    } catch (err: any) {
      dispatch(fetchProductsFailure(err.message));
      throw err;
    }
  };

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: [
      "fetchData",
      pagination?.currentPage,
      pagination?.pageSize,
      query,
      search,
    ],
    queryFn: fetchProducts,
    // refetchInterval: 5000,
  });

  // add image
  const handleImageUpload = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedProductId || !values.image || values.image.length === 0)
        return;

      const file = values.image[0].originFileObj;

      const formData = new FormData();
      formData.append("_method", "patch");
      formData.append("images[]", file);

      setIsUploading(true);

      const response = await axios.post(
        `admin/products/${selectedProductId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const successMessage = response?.data?.message;
      message.success(successMessage);

      refetch();
      setIsUploadModalOpen(false);
      form.resetFields();
      setSelectedFiles([]);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        message.error(errorMessage);
      }
    } finally {
      setIsUploading(false);
    }
  };

  //// Toggle featured status
  // const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
  //   try {
  //     const response = await axios.patch(`admin/products/${id}/features`, {
  //       is_featured: currentStatus ? 0 : 1,
  //     });

  //     if (response?.data?.data) {
  //       dispatch(fetchProductsSuccess(response.data.data));
  //       message.success(
  //         currentStatus ? "Unfeatured successfully" : "Featured successfully"
  //       );
  //     }
  //     fetchProducts();
  //   } catch (error) {
  //     message.error("Failed to update status");
  //   }
  // };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const response = await axios.patch(`admin/products/${id}/features`, {
        is_featured: currentStatus ? 0 : 1,
      });

      // console.log("Full response:", response.data);

      if (response?.data?.message) {
        dispatch(fetchProductsSuccess(response.data.message));
        message.success(response.data.message);
        console.log(response.data.message);
      }
      // fetchProducts();
      refetch();
    } catch (error: any) {
      const backendMessage = error.message;
      message.error(backendMessage);
    }
  };

  // Handle modal confirm action
  const handleModalConfirm = () => {
    if (currentProduct) {
      handleToggleFeatured(currentProduct.id, currentProduct.is_featured);
    }
    setShowModal(false);
    setCurrentProduct(null);
  };

  //// add image logic
  const addImageMutation = useMutation({
    mutationFn: (values) =>
      axios["post"](`admin/products/${productId}/images`, values),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;
      const { message } = res?.data;
      console.log(res?.data?.data);
      setAddImageOpen(false);
      form.resetFields();
      fetchProducts();
      form.resetFields();
      toast.success(message, {
        position: "top-center",
        duration: 3000,
      });
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;
      console.log(err, err.message);
      // setIsAddContainerModalOpen(false);
      toast.error(err.message, {
        position: "top-center",
        duration: 3000,
      });
    },
  });

  //// dynamicform data
  const onFinish = (values: any) => {
    values["_method"] = "patch";
    console.log(values);
    addImageMutation.mutate(values);
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  ////export button
  const exportBtnHandler = async () => {
    // const searchParams = searchQuery()?.slice(1);
    setImportExportLoading(true);
    try {
      const response = await axios.get(`admin/products/export`, {
        responseType: "blob",
      });

      FileSaver.saveAs(response?.data, `Products`);
    } catch (err) {
      message.error(err?.message);
    } finally {
      setImportExportLoading(false);
    }
  };

  useEffect(() => {
    if (fileList.length > 0) {
      handleUpload();
    }
  }, [fileList]);
  //// import button
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file as FileType);
    });
    setUploading(true);

    try {
      const response = await axios.post("admin/products/import", formData);
      setFileList([]);
      message.success(response?.data?.message);
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setUploading(false);
    }
  };
  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  //// Column search component
  const columnSearch = (placeHolder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={placeHolder}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined className="mr-[-2px]" />}
          className="bg-[#03b89e] text-[#fff] w-full"
          onClick={() => {
            setPagination((current) => ({
              ...current,
              currentPage: 0,
            }));
            // if (state) {
            //   setQuery({ ...query, [columnName]: state });
            // } else {
            //   const obj = { ...query };
            //   delete obj[columnName];
            //   setQuery(obj);
            // }
            setSearch(state);
          }}
        >
          <FormattedMessage id="search" />
        </Button>
      </div>
    );
  };

  // upload Images
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const moduleName = location.pathname.split("/")[3];

  const handleUploadImages = async () => {
    try {
      const values = await form.validateFields();

      const files = values.images
        ?.map((f: any) => f.originFileObj)
        .filter(Boolean);
      if (!files || files.length === 0) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append("model_name", moduleName);

      files.forEach((file: File, index: number) => {
        const extension = file.name.split(".").pop();
        const newFileName = `image_${index + 1}.${extension}`;
        const renamedFile = new File([file], newFileName, { type: file.type });
        formData.append("images[]", renamedFile);
      });

      const response = await axios.post("admin/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(response.data.message);
      setUploadedImages(response.data.images || []);
      setIsModalOpen(false);
      setSelectedFiles([]);
      form.resetFields();
      refetch();
    } catch (error: any) {
      if (error.errorFields) {
        return;
      }
      const errMessage = error.message;
      message.error(errMessage);
    } finally {
      setIsUploading(false);
    }
  };

  //// Columns definition
  const columns: TableColumnsType<DataType> = [
    {
      title: <FormattedMessage id="nameAr" />,
      dataIndex: "name_ar",
      key: "name_ar",
      width: "20%",
      filterDropdown: columnSearch(
        // "nameAr",
        intel.formatMessage({ id: "nameAr" }),
        nameArabic,
        setNameArabic,
        "name_ar"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: nameArabic ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="nameEn" />,
      dataIndex: "name_en",
      key: "name_en",
      width: "20%",
      filterDropdown: columnSearch(
        // "nameEn",
        intel.formatMessage({ id: "nameEn" }),
        nameEnglish,
        setNameEnglish,
        "name_en"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: nameEnglish ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="price" />
        </div>
      ),
      dataIndex: "price",
      key: "price",
      width: "10%",
      align: "center",
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="ascon-code" />
        </div>
      ),
      dataIndex: "ascon_code",
      key: "ascon_code",
      width: "11%",
      align: "center",
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="barcode" />
        </div>
      ),
      dataIndex: "barcode",
      key: "barcode",
      width: "11%",
      align: "center",
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="image" />
        </div>
      ),
      dataIndex: "images",
      key: "images",
      width: "12%",
      render: (images: string[]) => {
        if (!images || images.length === 0) {
          return (
            <p className="text-gray-300">
              <FormattedMessage id="no-img" />
            </p>
          );
        }

        if (images.length === 1) {
          return (
            <div className="flex justify-center items-center">
              <Image
                src={images[0]}
                className="!w-20 !h-16 object-contain"
                alt="single"
                preview={{
                  toolbarRender: () => null,
                  mask: (
                    <span className="flex items-center p-2 text-[14px]">
                      <IoEyeOutline className="text-[16px] mx-1" />
                      <FormattedMessage id="perview" />
                    </span>
                  ),
                }}
              />
            </div>
          );
        }

        return (
          <div className="flex justify-center items-center">
            <Tooltip
              title={<FormattedMessage id="showImage" />}
              color="#03b89e"
            >
              <Button
                className="text-[#03b89e] cursor-pointer text-xl"
                onClick={() => {
                  setViewImages(images);
                  setViewImagesModalVisible(true);
                }}
              >
                <IoMdImages className="text-[#03b89e] cursor-pointer text-2xl" />
              </Button>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="is-featured" />
        </div>
      ),
      dataIndex: "is_featured",
      key: "is_featured",
      width: "10%",
      render: (text: number, record: DataType) => (
        <div className="flex justify-center items-center">
          <span
            key={`star-${record.id}`}
            style={{
              fontSize: "20px",
              color: text === 1 ? "#FFD700" : "#D3D3D3",
              cursor: "pointer",
            }}
            onClick={() => {
              setCurrentProduct(record);
              setShowModal(true);
            }}
          >
            {text === 1 ? (
              <StarFilled style={{ color: "#FFD700" }} />
            ) : (
              <StarOutlined style={{ color: "#D3D3D3" }} />
            )}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="text-center">
          <FormattedMessage id="actions" />
        </div>
      ),
      key: "actions",
      width: "12%",
      fixed: "right",
      render: (_, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Tooltip title={<FormattedMessage id="add-image" />} color="#209163">
            <FaPlus
              className="text-primary cursor-pointer mx-3 text-xl"
              onClick={() => {
                // setProductId(row.id);
                // setAddImageOpen(true);
                setSelectedProductId(row.id);
                setIsUploadModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title={<FormattedMessage id="product-branch-availability" />}
            color="#209163"
          >
            <BsBoxSeam
              className="text-primary cursor-pointer mx-3 !w-[25px] text-xl"
              onClick={() => {
                navigate("product-branchs", { state: { branchId: row?.id } });
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {pathname.split("/")[pathname.split("/").length - 1] === "departure" ? (
        <div className="container mx-auto">
          {loading ? (
            <RollerLoading />
          ) : (
            <>
              <div className="flex items-center py-4">
                <Button
                  loading={importExportLoading}
                  className="!shadow-none !px-[10px] !py-[8px] !rounded-[8px] !outline-none !bg-white !border-primary me-2 !text-primary hover:!bg-primary hover:!text-white  flex justify-center items-center"
                  onClick={exportBtnHandler}
                >
                  <FiDownload className=" text-[20px]" />
                  {<FormattedMessage id="export" />}
                </Button>
                {/* <Button className="!outline-none !bg-primary !border-primary hover:!bg-white ms-2 !text-white hover:!text-primary  flex justify-center items-center">
                  <FiUpload className="me-1 text-[20px]" />
                  {<FormattedMessage id="import" />}
                </Button> */}
                <Upload {...props}>
                  <Button
                    loading={uploading}
                    className="!shadow-none !px-[10px] !py-[8px] !rounded-[8px] !outline-none !bg-primary !border-primary hover:!bg-white ms-2 !text-white hover:!text-primary  flex justify-center items-center"
                  >
                    <FiUpload className=" text-[20px]" />
                    <FormattedMessage id="import" />
                  </Button>
                </Upload>
                <Button
                  className="!shadow-none !px-[10px] !py-[8px] !rounded-[8px] !outline-none !bg-primary !border-primary hover:!bg-white ms-2 !text-white hover:!text-primary  flex justify-center items-center"
                  onClick={() => {
                    setSelectedFiles([]);
                    setIsModalOpen(true);
                  }}
                >
                  <FormattedMessage id="uploadImages" />
                </Button>
              </div>
              <Table<DataType>
                columns={columns}
                // dataSource={products}
                dataSource={data ?? []}
                rowKey="id"
                // bordered
                scroll={{ x: 1400, y: 380 }}
                pagination={{
                  total: pagination.totalCount,
                  current: pagination.currentPage + 1,
                  pageSize: pagination.pageSize,
                  onChange(page, pageSize) {
                    setPagination((current) => ({
                      ...current,
                      pageSize,
                      currentPage: page - 1,
                    }));
                  },
                }}
              />
            </>
          )}
        </div>
      ) : (
        <Outlet />
      )}
      <ConfirmationModal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleModalConfirm}
        isFeatured={currentProduct?.is_featured || false}
      />
      {/**** add image modal****/}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-image" />
          </p>
        }
        open={addImageOpen}
        onCancel={() => {
          setAddImageOpen(false);
          form.resetFields(); // Reset the form fields here
        }}
        footer={null}
      >
        <Form
          form={form}
          name="dynamic_form_item"
          {...formItemLayoutWithOutLabel}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.List
            name="images"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(
                      new Error(intel.formatMessage({ id: "at-least-one-url" }))
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={
                      index === 0 ? intel.formatMessage({ id: "urls" }) : ""
                    }
                    required={false}
                    key={field.key}
                    style={{ marginTop: "30px" }}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          message: <FormattedMessage id="image-required" />,
                        },
                        {
                          pattern:
                            /^(https?:\/\/)?([^\s:@]+(:[^\s:@]*)?@)?([^\s:@]+)?(\.[^\s:@]+)+(:\d+)?(\/[^\s]*)?$/,
                          message: <FormattedMessage id="invalid-url" />,
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={intel.formatMessage({
                          id: "enter-image-url",
                        })}
                        style={{ width: "80%", margin: "0px 5px 0px" }}
                      />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "80%", margin: "0px 5px 0px" }}
                    icon={<PlusOutlined />}
                  >
                    <FormattedMessage id="add-url" />
                  </Button>

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          {/* <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item> */}
          <Form.Item className="modals-btns update-user-modal-btns me-4 flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-4">
            <Button
              // type="primary"

              size="large"
              className="modals-cancel-btn min-w-[60px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={() => {
                setAddImageOpen(false);
                form.resetFields();
              }}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              // type="primary"

              size="large"
              className="modals-confirm-btn min-w-[60px] text-white ms-1 bg-primary hover:bg-primary inline-block"
              htmlType="submit"
              loading={addImageMutation?.isPending}
            >
              <FormattedMessage id="add" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* upload images */}
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedFiles([]);
        }}
        onOk={handleUploadImages}
        confirmLoading={isUploading}
        title={intel.formatMessage({ id: "uploadImages" })}
        okText={intel.formatMessage({ id: "upload" })}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              {
                required: true,
                message: intel.formatMessage({ id: "image-required" }),
              },
            ]}
          >
            <Upload
              className="custom-upload-border"
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              onChange={(info) =>
                setSelectedFiles(info.fileList.map((f) => f.originFileObj))
              }
              accept="image/*"
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>
                  <FormattedMessage id="selectImg" />
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* add image one only */}
      <Modal
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          form.resetFields();
          setSelectedFiles([]);
        }}
        onOk={handleImageUpload}
        confirmLoading={isUploading}
        title={intel.formatMessage({ id: "add-image" })}
        okText={intel.formatMessage({ id: "add" })}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[
              {
                required: true,
                message: intel.formatMessage({ id: "image-required" }),
              },
            ]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              onChange={(info) =>
                setSelectedFiles(info.fileList.map((f) => f.originFileObj))
              }
              accept="image/*"
              showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              className={selectedFiles.length > 0 ? "image-selected" : ""}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>
                  <FormattedMessage id="selectImg" />
                </div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={viewImagesModalVisible}
        footer={null}
        onCancel={() => setViewImagesModalVisible(false)}
        width={600}
        destroyOnClose={false}
        forceRender={true}
        className="sliderModal"
      >
        <Swiper
          dir={locale === "ar" ? "ltr" : "ltr"}
          observer={true}
          observeParents={true}
          ref={swiperRef}
          effect={"cards"}
          grabCursor={true}
          // modules={[EffectCards]}
          className="mySwiper"
          spaceBetween={20}
          slidesPerView={1}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[EffectCards, Navigation, Pagination]}
          // style={{ width: "100%", height: 400 }}
        >
          {viewImages.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                // alt={`slide-${idx}`}
                alt={intel.formatMessage(
                  { id: "slideAlt" },
                  { index: idx + 1 }
                )}
                style={{ maxWidth: "100%", borderRadius: 4 }}
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </>
  );
}

export default Products;
