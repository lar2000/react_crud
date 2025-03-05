/* eslint-disable react/prop-types */
import {useEffect,useState} from 'react'
import axios from 'axios';
import { Config } from '../../../../config/connection';
import { Modal ,Button,Input,InputGroup,SelectPicker,
  RadioGroup,Radio,CheckboxGroup, Checkbox, Loader } 
  from 'rsuite'
import userImage from '../../../../assets/user.png';
import { Notification, Alert } from "../../../../SweetAlert2";
import { useProvince, useDistrict, useAthenAtions } from "../../../../config/selectOption";
function FormStaff({open, handleClose, fetchgetData, modalType, data, item}) {
    const api = Config.ApiURL;
    const [confirmPassword, setConfirmPassword] = useState("");
    const [imageUrl, setImageUrl] = useState(userImage);
    const [checked, setChecked] = useState([]);
    const [passwordError, setPasswordError] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loadingSave, setLoadingSave]=useState(false)
    const [visible, setVisible] = useState(false);
    const [staffData, setStaffData] = useState({
        staff_id: null,
        staff_name: "",
        staff_surname: "",
        email: "",
        tell: "",
        profile: null,
        village: "",
        district_fk: "",
        province: "",
        staff_status: 0,
        password: "",
        authen_fk: [],
      });
      const provinces = useProvince(); // Fetch province data
      const districts = useDistrict(staffData.province); // Fetch districts based on selected province
      const authen_actions = useAthenAtions();
      
      const staff_status = [
        {label: 'Normal', value: 0},
        {label: 'Admin', value: 1}, 
      ];

  const handleChange = (name, value) => {
    setStaffData({
      ...staffData,
      [name]: value,
    });
  };

  const handleShow = () => {
    setVisible(!visible);
  };

  const handleCheckAll = (_, value) => {
    const allValues = value ? authen_actions.map(item => item.value) : [];
    setStaffData(prevState => ({
      ...prevState,
      authen_fk: allValues,
    }));
    setChecked(allValues);
  };
  const handleCheck = (value) => {
    setStaffData(prevState => ({
      ...prevState,
      authen_fk: value,
    }));
    setChecked(value);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    document.getElementById('fileInput').value = '';
    setStaffData({
      ...staffData, profile: null
    })
    setImageUrl(userImage)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      setStaffData({
        ...staffData, profile:file
      })
      reader.readAsDataURL(file);
    } else {
    setImageUrl(userImage);
    }
  };
  
  const handleSelectChange = (event, field) => {
    setStaffData({
      ...staffData,
      [field]: event,
    });
  };

  const resetForm = () => {
    setStaffData({
      staff_id: null,
      staff_name: "",
      staff_surname: "",
      email: "",
      tell: "",
      profile: null,
      village: "",
      district_fk: "",
      province: "",
      staff_status: null,
      password: "",
      authen_fk: [],
    });
    setImageUrl(userImage); // Reset image URL
    setSelectedFile(null); // Reset selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true)
    if(staffData.staff_status === 1) {
  
      if (staffData.password !== confirmPassword) {
        setPasswordError(true);
        return;
      }
      setPasswordError(false);
    }
  
    const formData = new FormData();
    
    for (const key in staffData) {
      if (Array.isArray(staffData[key])) {
        staffData[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else if (staffData[key] !== null && staffData[key] !== "") {
        formData.append(key, staffData[key]);
      }
    }

    try {

      if (staffData.passId) {
        await axios.post(`${api}/staff/changepass`, {
          passId: staffData.passId,    // Send staff ID
          email: staffData.email,      // Send staff email
          password: staffData.password // Send the new password
        });
        Alert.successData('ອັບເດດລະຫັດຜ່ານສຳເລັດແລ້ວ!');
      } else {
        await axios.post(`${api}/staff/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Alert.successData(`${staffData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
      }
      handleClose();
      fetchgetData();
      resetForm();

    } catch (err) {
      console.error("Failed to submit staff data", err);
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ');
    }
    finally {
      setLoadingSave(false)
    }
};
useEffect (()=>{
if(data){
    setStaffData({
        ...staffData,
        staff_id: data.staff_id,
        staff_name: data.staff_name,
        staff_surname: data.staff_surname,
        email: data.email,
        tell: data.tell,
        profile: null,
        village: data.village,
        district_fk: data.district_fk,
        province: data.province,
        staff_status: data.staff_status,
        authen_fk: data.authen_fk.map(id => Number(id)), 
    })
}
},[data, item])

  return (
    <Modal open={open} onClose={handleClose}>
    <Modal.Header>
      <Modal.Title className="title text-center">
      {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນພະນັກງານ" 
      : modalType === "editpass" ? "ປ່ຽນລະຫັດຜ່ານ" : "ແກ້ໄຂ ຂໍ້ມູນພະນັກງານ"}
      </Modal.Title>
    </Modal.Header>
    <form onSubmit={handleSubmit}>
    <Modal.Body>
    {modalType === "editpass" ? (
      <>
        <div className="col-md-12">
          <label className="form-label">ອີເມວ໌</label>
          <Input className="form-label" name="email" value={staffData.email}
          onChange={(value) => handleChange("email", value)}/>
        </div>
        <div className="col-md-12">
          <label className="form-label">ລະຫັດຜ່ານ</label>
          <InputGroup inside block>
            <Input type={visible ? 'text' : 'password'} value={staffData.password || ""}
              onChange={(value) => handleChange("password", value)} required />
            <InputGroup.Button onClick={handleShow}>
              {visible ? (<i className="fa-solid fa-eye" />) 
              : (<i className="fa-solid fa-eye-slash" />)}
            </InputGroup.Button>
          </InputGroup>
        </div>
        <div className="col-md-12">
          <label className="form-label">ຢືນຢັນລະຫັດຜ່ານ</label>
          <InputGroup>
          <Input type="password" onChange={(value) => setConfirmPassword(value)} 
          required/>
          </InputGroup>
          {passwordError && (<span className="text-danger">Passwords do not match!</span>)}
        </div>
      </>
    ) : (
      <div className="row mb-3">
        <div className="mb-3 d-flex justify-content-center align-items-center">
        <label role='button'>
          <input type="file" id="fileInput" accept="image/*" className='hide' onChange={handleFileChange}/>
            <img src={imageUrl} className="w-150px rounded-3" />
        </label>
        {selectedFile && ( 
          <span role='button' onClick={handleClearImage} 
          className=" d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5">
            <i className="fa-solid fa-xmark"></i></span>
        )}
        </div>
        <div className="col-md-6">
          <label className="form-label">ຊື່</label>
          <Input className="form-label" name="name" value={staffData.staff_name} 
          onChange={(value) => handleChange("staff_name", value)}
          placeholder="ຊື່..." required />
        </div>
        <div className="col-md-6">
          <label className="form-label">ນາມສະກຸນ</label>
          <Input className="form-label" name="surname" value={staffData.staff_surname}
           onChange={(value) => handleChange("staff_surname", value)}
         placeholder="ນາມສະກຸນ..." required/>
        </div>
        <div className="col-md-12">
          <label className="form-label">ອີເມວ໌</label>
          <Input className="form-label" name="email" value={staffData.email} 
          onChange={(value) => handleChange("email", value)}
            placeholder="ອີເມວ໌..."/>
        </div>
        <div className="col-md-6">
          <label className="form-label">ເບີໂທ</label>
          <Input className="form-label" name="tell" value={staffData.tell} 
          onChange={(value) => handleChange("tell", value.replace(/[^0-9]/g, ""))}
            placeholder="020xxxxxxxx/030xxxxxxx" required/>
        </div>
        <div className="col-md-6">
          <label className="form-label">ແຂວງ</label>
          <SelectPicker className="form-label" data={provinces} value={staffData.province}
            onChange={(value) => handleSelectChange(value, "province")}
            placeholder="ເລືອກແຂວງ" required block/>
        </div>
        <div className="col-md-6">
          <label className="form-label">ເມືອງ</label>
          <SelectPicker className="form-label" data={districts} value={staffData.district_fk}
            onChange={(value) => handleSelectChange(value, "district_fk")}
            placeholder="ເລືອກເມືອງ" required block/>
        </div>
        <div className="col-md-6">
          <label className="form-label">ບ້ານ</label>
          <Input className="form-label" name="village" value={staffData.village} 
          onChange={(value) => handleChange("village", value)}
            placeholder="ບ້ານ..." required/>
        </div>
        <div className="col-md-12 mt-4">
          <RadioGroup inline value={staffData.staff_status} defaultValue={0}
            onChange={(value) => handleChange("staff_status", value)}>
            {staff_status.map((status) => (
              <Radio key={status.value} value={status.value}>
                {status.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
        {(staffData.staff_status === 1) && (
          <>
          <div className="col-md-8">
          <div className="col-md-12">
                <label className="form-label">ອີເມວ໌</label>
                <Input className="form-label" name="email" value={staffData.email}
                 onChange={(value) => handleChange("email", value)}
                  placeholder="ອີເມວ໌..."/>
              </div>
          <div className="col-md-12">
              <label className="form-label">ລະຫັດຜ່ານ</label>
              <InputGroup inside block>
                <Input type={visible ? 'text' : 'password'} value={staffData.password || ""}
                  onChange={(value) => handleChange("password", value)} required />
                <InputGroup.Button onClick={handleShow}>
                  {visible ? (<i className="fa-solid fa-eye" />) 
                  : (<i className="fa-solid fa-eye-slash" />)}
                </InputGroup.Button>
              </InputGroup>
            </div>
            <div className="col-md-12">
                <label className="form-label">ຢືນຢັນລະຫັດຜ່ານ</label>
                <InputGroup>
                <Input type="password" onChange={(value) => setConfirmPassword(value)} 
                  required/>
                </InputGroup>
                {passwordError && (<span className="text-danger">Passwords do not match!</span>)}
            </div>
            </div>
            <div className="col-md-4">
            <Checkbox
              indeterminate={checked.length > 0 && checked.length < authen_actions.length}
              checked={checked.length === authen_actions.length} onChange={handleCheckAll}>
              ເລືອກທັງໝົດ
            </Checkbox>

            <CheckboxGroup data={authen_actions} value={staffData.authen_fk} 
            onChange={(value) => handleCheck(value, "authen_fk")} style={{ marginLeft: 36 }}>
              {authen_actions.map((action) => (
                <Checkbox key={action.value} value={action.value}>
                  {action.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
            </div>
            </>
        )}
        </div>)}
    </Modal.Body>
    <Modal.Footer>
      <Button type="submit" disabled={loadingSave}  appearance="primary">
        {loadingSave ? (<Loader content="ກຳລັງບັນທຶກ..."/>):
        <>
        {modalType === "add" ? "ບັນທຶກ" 
      : modalType === "editpass" ? "ອັບເດດລະຫັດ" : "ອັບເດດຂໍ້ມູນ"}
      </>
        }
      </Button>
      <Button onClick={resetForm} color='red' appearance="primary">
        ຍົກເລີກ
      </Button>
    </Modal.Footer>
    </form>
  </Modal>
  )
}

export default FormStaff
