import { useEffect, useState } from "react";
import { Config } from "./connection";

const useFetchData = (endpoint, dependencies = []) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Config.ApiURL}/${endpoint}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchData(); // Fetch data whenever dependencies change
  }, [dependencies]); // Ensure dependencies trigger re-fetch when changed

  return data;
};

export const useAthenAtions = () =>
  useFetchData("authen_actions").map(({ authenName, authen_id }) => ({
    label: authenName,
    value: authen_id,
  }));

export const useProvince = () =>
  useFetchData("province").map(({ province_name, province_id }) => ({
    label: province_name,
    value: province_id,
  }));

export const useDistrict = (pvid) =>
  useFetchData(`district/pv/${pvid}`, [pvid]).map(({ district_name, district_id }) => ({
      label: district_name,
      value: district_id,
    })
  );

export const useProduct_Type = () =>
  useFetchData("protype").map(({ protype_name, protype_id }) => ({
    label: protype_name,
    value: protype_id,
  }));

export const useProduct = () =>
  useFetchData("product").map(({ pro_name, pro_id }) => ({
    label: pro_name,
    value: pro_id,
  }));

export const useSetProduct = () =>
  useFetchData("set_product").map(({ set_name, set_id }) => ({
    label: set_name,
    value: set_id,
  }));

export const useServiceType = () =>
  useFetchData("service_type").map(({ servicetype_name, servicetype_id }) => ({
    label: servicetype_name,
    value: servicetype_id,
  }));

  export const useService = () =>
    useFetchData("service/ByTypeId").flatMap(({ 
      service_names,
      service_ids, 
      servicetype_id_fk, 
      servicetype_name 
    }) => service_names.map((name, index) => ({
        servicetype_id_fk,
        servicetype_name,
        label: name,
        value: service_ids[index],
    })));
  
    export const usePackage = () =>
      useFetchData("package").map(({ pk_name, pk_id, total_price }) => ({
        label: pk_name,
        value: pk_id,
        total_price
      }));

export const useUnit = () =>
  useFetchData("unit").map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  export const useCustomer = () =>
  useFetchData("customer").map(({ cust_name, cust_surname, cust_id }) => ({
    label: `${cust_name} ${cust_surname}`,
    value: cust_id,
  }));

  export const usePayType = () =>
    useFetchData("payment/paytype").map(({ paytype_name, paytype_id }) => ({
      label: paytype_name,
      value: paytype_id,
    }));
    
  export const useRoomType = () =>
    useFetchData("roomtype").map(({ roomtype_name, roomtype_id }) => ({
      label: roomtype_name,
      value: roomtype_id,
    }));

  
  
