import { useEffect, useState, useRef } from "react";

import axios from "utlis/library/helpers/axios";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";

import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Input, Table, Button, message } from "antd";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";

import RollerLoading from "components/loading/roller";

import type { GetProp, UploadFile, UploadProps } from "antd";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

import { FormattedMessage, useIntl } from "react-intl";

type produCtBranch = {
  id: number;
  name: string;
  quantity: number;
};

export interface DataType {
  name_en: string;
  name_ar: string;
  // images: image[];
  images: string[];
  branches: produCtBranch[];
  created_at: string;
  id: number;
  price: string;
  ascon_code: string;
  barcode: string;
  is_featured: number;
}

type DataIndex = keyof DataType;
function ProductInBranches() {
  /////states
  const [branchProducts, setBranchProducts] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({} as any);

  const intl = useIntl();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const location = useLocation();

  ////////
  const [nameArabic, setNameArabic] = useState("");

  const [search, setSearch] = useState(undefined);

  ///// useEffects
  useEffect(() => {
    // console.log(idToken)
    // fetchCategories();
    if (location?.state?.branchId) {
      fetchBranchProductsFunc();
    }
    console.log("state", location?.state);
  }, [location]);

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

  const fetchBranchProductsFunc = async () => {
    setIsLoading(true);
    try{

      const { data } = await axios.get(
        `admin/products/${location?.state?.branchId}`
      );
      const productsQuantities = await data?.data?.branches;
      setBranchProducts([...productsQuantities]);
      setIsLoading(false);
    }
    catch (err:any){
message.error(err?.message || "Error fetching branch products");
      setIsLoading(false);
    }
    // const { data } = await axios.get(
    //   `admin/sub-categories?filter[category_id]=${categoryId}&skip=${params?.skip}&take=${params?.take}${searchParams}`
    // );

    //  }

    //return data?.data;
  };

  // const {
  //   data: branchProducts,
  //   isLoading,
  //   error,
  //   refetch,
  // } = useQuery({
  //   queryKey: [
  //     "fetchBranchProducts",

  //   ],
  //   queryFn: fetchBranchProductsFunc,
  //   // refetchInterval: 5000,
  // });

  //// column search component
  const columnSearch = (placeHolder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={intl?.formatMessage({ id: placeHolder })}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
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

  const columns: TableColumnsType<DataType> = [
    {
      title: <FormattedMessage id="branch-name" />,
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text) =>
        text || (
          <p className="text-gray-300">{<FormattedMessage id="noData" />}</p>
        ),
      filterDropdown: columnSearch(
        "branch-name",
        nameArabic,
        setNameArabic,
        "name"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: nameArabic ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="product-quantity" />,
      dataIndex: "quantity",
      key: "quantity",
      width: "30%",
      render: (text) => text,
    },
  ];

  //if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className="container mx-auto">
        {isLoading ? (
          <RollerLoading />
        ) : (
          <>
            <Table<DataType>
              columns={columns}
              dataSource={branchProducts}
              scroll={{ x: 700, y: 350 }}
              // pagination={{
              //   total: pagination.totalCount,
              //   current: pagination.currentPage + 1,
              //   pageSize: pagination.pageSize,
              //   onChange(page, pageSize) {
              //     setPagination((current) => ({
              //       ...current,
              //       pageSize,
              //       currentPage: page - 1,
              //     }));
              //   },
              //   showSizeChanger: true,
              // }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProductInBranches;
