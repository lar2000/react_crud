
import { useEffect, useState } from "react";
import { Config } from "./connection";

export function useProvince() {
    const [provinces, setProvinces] = useState([]);
    
    useEffect(() => {
      const fetchProvinces = async () => {
        try {
          const response = await fetch(`${Config.ApiURL}/province`);
          const jsonData = await response.json();
          setProvinces(jsonData);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      };
      fetchProvinces();
    }, []);
    
    const data = provinces.map(item => ({ label: item.province_name, value: item.province_id }));
    return data;
  }

  export function useDistrict(provinceId) {
    const [districts, setDistricts] = useState([]);
    
    useEffect(() => {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`${Config.ApiURL}/district/pv/${provinceId}`);
          const jsonData = await response.json();
          setDistricts(jsonData);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      };
      fetchDistricts();
    }, [provinceId]);
    
    const data = districts.map(item => ({ label: item.district_name, value: item.district_id }));
    return data;
  }

  export function useProduct_Type() {
    const [protypes, setProtypes] = useState([]);
    
    useEffect(() => {
      const fetchProtypes = async () => {
        try {
          const response = await fetch(`${Config.ApiURL}/protype`);
          const jsonData = await response.json();
          setProtypes(jsonData);
        } catch (error) {
          console.error('Error fetching product_type:', error);
        }
      };
      fetchProtypes();
    }, []);
    
    const data = protypes.map(item => ({ label: item.protype_name, value: item.id }));
    return data;
  }