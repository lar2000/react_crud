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

// Example usage for specific hooks
export const useProvince = () =>
  useFetchData("province").map(({ province_name, province_id }) => ({
    label: province_name,
    value: province_id,
  }));

export const useDistrict = (provinceId) =>
  useFetchData(`district/pv/${provinceId}`, [provinceId]).map(
    ({ district_name, district_id }) => ({
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
  useFetchData("service").map(({ service_name, service_id }) => ({
    label: service_name,
    value: service_id,
  }));

export const useUnit = () =>
  useFetchData("unit").map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  export const useCustomer = (key) => {
  const allCustomers = useFetchData("customer/status", key); // Pass the key to force reload
  const filteredCustomers = allCustomers.map(({ cust_name, cust_surname, cust_id, status }) => ({
    label: `${cust_name} ${cust_surname} ${status === 1 ? "(Original)" : ""}`, // Show "Original" for selected customer
    value: cust_id,
    status,
  }));

  return filteredCustomers;
};

  
  
