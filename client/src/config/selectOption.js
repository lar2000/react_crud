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
  useFetchData("protype").map(({ protype_name, id }) => ({
    label: protype_name,
    value: id,
  }));

export const useProduct = () =>
  useFetchData("product").map(({ pro_name, id }) => ({
    label: pro_name,
    value: id,
  }));

  export const useCategories = () =>
    useFetchData("categories").map(({ name, id }) => ({
      label: name,
      value: id,
    }));
