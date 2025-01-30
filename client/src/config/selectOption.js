import { useEffect, useState } from "react";
import { Config } from "./connection";

const useFetchData = (endpoint, dependencies = []) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${Config.ApiURL}/${endpoint}`)
      .then((res) => res.json())
      .then(setData)
      .catch((error) => console.error(`Error fetching ${endpoint}:`, error));
  }, dependencies);

  return data;
};

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
      useFetchData("service_type").map(({ servicetype_name, servicetype_id }) => ({
        label: servicetype_name,
        value: servicetype_id,
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

      export const useTime = () =>
        useFetchData("time").map(({ time, id }) => ({
          label: time,
          value: id,
        }));
    