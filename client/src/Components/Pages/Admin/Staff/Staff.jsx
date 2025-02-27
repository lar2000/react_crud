import { useEffect, useState } from "react";
import axios from "axios";
import userImage from '../../../../assets/user.png';
import { Notification, Alert } from "../../../../SweetAlert2";
import { 
  Modal, 
  Text, 
  Button, 
  SelectPicker, 
  Input, 
  InputGroup, 
  Radio, 
  RadioGroup, 
  Badge,
  Checkbox, 
  CheckboxGroup ,
  Placeholder,
  Loader
} 
from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { maskEmail, maskPhone, AuthenActions } from "../../../../util";
import { useProvince, useDistrict, useAthenAtions } from "../../../../config/selectOption"; // Assuming hooks are in this location

const Staff = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/profiles/`;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [checked, setChecked] = useState([]);
  const [imageUrl, setImageUrl] = useState(userImage);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

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
  const actions = AuthenActions();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${api}/staff`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch staff data", err);
    }

    finally{
      setLoading(false)
    }

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
    setOpen(false);
    setImageUrl(userImage); // Reset image URL
    setSelectedFile(null); // Reset selected file
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }

  const handleShow = () => {
    setVisible(!visible);
  };

  const handleCheck = (value) => {
    setStaffData(prevState => ({
      ...prevState,
      authen_fk: value,
    }));
    setChecked(value);
  };

  const handleCheckAll = (_, value) => {
    const allValues = value ? authen_actions.map(item => item.value) : [];
    setStaffData(prevState => ({
      ...prevState,
      authen_fk: allValues,
    }));
    setChecked(allValues);
  };

  const handleAddClick = () => {
    handleOpen();
    setModalType("add");
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    handleOpen();
    setStaffData({
      _id: data.staff_id,
      staff_name: data.staff_name,
      staff_surname: data.staff_surname,
      email: data.email,
      tell: data.tell,
      profile: null,
      village: data.village,
      district_fk: data.district_fk,
      province: data.province_id_fk,
      staff_status: data.staff_status,
      authen_fk: data.authen_fk.map(id => Number(id)), 
    });
    setImageUrl(data.profile ? `${img}${data.profile}` : userImage);
  };
  const handleChangePass = (item) => {
    setModalType("editpass");
    handleOpen();
    setStaffData({
      passId: item.staff_id,
      email: item.email,
      password: "",
    });
  };
  

  const handleChange = (name, value) => {
    setStaffData({
      ...staffData,
      [name]: value,
    });
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


  const handleDeleteClick = async (id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
    if (isConfirmed) {
      try {
        await axios.patch(`${api}/staff/${id}`);
        Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
        fetchgetData();
      } catch (err) {
        console.error("Failed to delete staff", err);
        Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
      }
    }
  };
  
  const filteredData = getData.filter(
    (staff) => {
      const matchesSearch =
      staff.staff_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staff_surname.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
      selectedStatus === "" || staff.staff_status === parseInt(selectedStatus);
      
      return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * length;
  const paginatedData = filteredData.slice(startIndex, startIndex + length);

  return (
    <div id="content" className="app-content">
      <div className="panel panel-inverse">
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
              <div className="ms-2 mb-2">
                <select className="form-select form-select-sm" value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">ພະນັກງານທັງໝົດ</option>
                  <option value="0">ພະນັກງານທົ່ວໄປ</option>
                  <option value="1">ແອັດມິນ</option>
                </select>
              </div>
            </div>
            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
                <a href="javascript:;" className={`btn btn-sm btn-success ms-2 ${!actions.canCreate ? 'disabled' : ''}`} 
                  onClick={actions.canCreate ? () => handleAddClick() : (e) => e.preventDefault()}>
                  <i className="fas fa-user-plus"></i>
                </a>
              </div>
            </div>
          </div>

          <table id="data-table-default"
            className={`table ${!loading && 'table-striped'} table-bordered align-middle text-nowrap`}>
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th width="1%" data-orderable="false">#</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ຂໍ້ມູນຕິດຕໍ່</th>
                <th className="text-nowrap">ທີຢູ່</th>
                <th className="text-nowrap">ສະຖານະ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                  <Placeholder.Grid rows={5} columns={6} active />
                  <Loader size='lg'  content="ກຳລັງໂຫລດ..." vertical />
                  </td>
                </tr>
              ): paginatedData.length > 0 ? paginatedData.map((staff, index) => (
                <tr key={staff.id}>
                  <td width="1%" className="fw-bold">{startIndex + index + 1}</td>
                  <td width="1%" className="with-img">
                    {staff.profile && (
                      <img className="rounded h-30px my-n1 mx-n1" alt="profile"
                        src={`${img}${staff.profile}`}/>)}
                  </td>
                  <td>{staff.staff_code}</td>
                  <td>{staff.staff_name} {staff.staff_surname}</td>
                  <td>{maskEmail(staff.email)}
                  <Text muted>{maskPhone(staff.tell)}</Text>
                  </td>
                  <td> {staff.village}, {staff.district_name}, {staff.province_name}
                  </td>
                  <td>
                  <Badge color={staff.staff_status === 1 ? "green" : ""} 
                    content={staff.staff_status === 1 ? "admin" : ""}/>
                </td>

                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"
                          data-bs-toggle="dropdown"><i className="fas fa-ellipsis"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                        {staff.staff_status !== 0 && (
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? 'disabled' : ''}`}
                          onClick={actions.canUpdate ? () => handleChangePass(staff) : (e) => e.preventDefault()}>
                            <i className="fas fa-lock fa-fw"></i> ປ່ຽນລະຫັດຜ່ານ
                          </a>
                        )}
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? 'disabled' : ''}`}
                             onClick={actions.canUpdate ? () => handleEditClick(staff) : (e) => e.preventDefault()}>
                              <i className="fas fa-pen-to-square fa-fw"></i>
                             ແກ້ໄຂ</a>
                             <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? 'disabled' : ''}`}
                                onClick={actions.canDelete ? () => handleDeleteClick(staff.staff_id) : (e) => e.preventDefault()}>
                                <i className="fas fa-trash fa-fw"></i> ລຶບ
                              </a>
                              {/*------------- Not Showing ---------*/}
                              {/* {actions.canDelete && (<a href="javascript:;" className="dropdown-item"
                                  onClick={() => handleDeleteClick(staff.staff_id)}>
                                  <i className="fas fa-trash fa-fw"></i> ລຶບ
                                </a>
                              )} */}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )):(
                <tr className="text-center">
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນພະນັກງານ ===============</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            total={filteredData.length}
            length={length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      <Modal size={modalType==='editpass' ? 'xs' : 'sm'} open={open} onClose={handleClose}>
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
            Cancel
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;