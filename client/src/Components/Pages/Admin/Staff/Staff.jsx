import { useEffect, useState } from "react";
import axios from "axios";
import userImage from '../../../../assets/user.png';
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
  CheckboxGroup 
} 
from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { maskEmail, maskPhone } from "../../../../util";
import { useProvince, useDistrict } from "../../../../config/selectOption"; // Assuming hooks are in this location

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
  const [imageUrl, setImageUrl] = useState(userImage);
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
    reads: 1,
    creates: 0,
    updates: 0,
    deletes: 0,
  });

  const provinces = useProvince(); // Fetch province data
  const districts = useDistrict(staffData.province); // Fetch districts based on selected province
  const data = ['reads', 'creates', 'updates', 'deletes'];
  const staff_status = [
    {label: 'Normal', value: 0},
    {label: 'Admin', value: 1}, 
  ]

  useEffect(() => {
    fetchgetData();
    const selectedPermissions = data.filter(permission => staffData[permission] === 1);
    setValue(selectedPermissions);
  }, [staffData]);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/staff`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch staff data", err);
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
      reads: null,
      creates: null,
      updates: null,
      deletes: null,
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

  const [value, setValue] = useState([]);

  const handleCheck = (newValue) => {
    setValue(newValue);
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      setValue(data); // Select all permissions
    } else {
      setValue([]); // Deselect all permissions
    }
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
    });
    setImageUrl(data.profile ? `${img}${data.profile}` : userImage);
  };
  const handleChangePass = (item) => {
    setModalType("editpass");
    handleOpen()
    setStaffData({
      reads: item.reads,
      creates: item.creates,
      updates: item.updates,
      deletes: item.deletes,
      email: item.email,
      password: item.password,
  });
  }

  const handleChange = (name, value) => {
    setVisible(!visible);
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
   
    const formData = new FormData();
    // Append staff data to FormData
    for (const key in staffData) {
      formData.append(key, staffData[key]);
    }
    try {
        await axios.post(`${api}/staff/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(`Staff ${staffData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit staff data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    try {
      await axios.patch(`${api}/staff/${id}`);
      alert("Staff member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete staff", err);
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
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <a href="javascript:;">Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="javascript:;">Page Options</a>
        </li>
        <li className="breadcrumb-item active">Staff</li>
      </ol>
      <h1 className="page-header"><small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">Staff Panel</h4>
        </div>

        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
              <div className="ms-2 mb-2">
                <select className="form-select form-select-sm" value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="0">normal</option>
                  <option value="1">admin</option>
                  <option value="2">superadmin</option>
                </select>
              </div>
            </div>
            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
                <a href="javarscript:;" className="btn btn-sm btn-success ms-2" onClick={handleAddClick}>
                  <i className="fas fa-user-plus"></i>
                </a>
              </div>
            </div>
          </div>

          <table id="data-table-default"
            className="table table-striped table-bordered align-middle text-nowrap">
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
              {paginatedData.map((staff, index) => (
                <tr key={staff.id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
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
                  <Badge 
                    color={staff.staff_status === 0 ? "green" : staff.staff_status === 1 ? "orange" : "blue"} 
                    content={staff.staff_status === 0 ? "" : staff.staff_status === 1 ? "A" : "S"} 
                  />
                </td>

                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"
                          data-bs-toggle="dropdown"><i className="fas fa-ellipsis"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                        {staff.staff_status !== 0 && (
                          <a href="javascript:;" className="dropdown-item" onClick={() => handleChangePass(staff)}>
                            <i className="fas fa-lock fa-fw"></i> ChangePassword
                          </a>
                        )}
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(staff)}><i className="fas fa-pen-to-square fa-fw"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(staff.staff_id)}>
                            <i className="fas fa-trash fa-fw"></i>
                             Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
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

      <Modal size={"sm"} open={open} onClose={handleClose}>
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
              <Input className="form-label" name="email" value={staffData.email}/>
            </div>
            <div className="col-md-12">
              <label className="form-label">Password</label>
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
              <label className="form-label">Confirm Password</label>
              <InputGroup>
                <Input type='password' required />
              </InputGroup>
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
              <Input className="form-label" name="name" value={staffData.staff_name} onChange={(value) => handleChange("staff_name", value)}
              placeholder="ຊື່..." required />
            </div>
            <div className="col-md-6">
              <label className="form-label">ນາມສະກຸນ</label>
              <Input className="form-label" name="surname" value={staffData.staff_surname} onChange={(value) => handleChange("staff_surname", value)}
             placeholder="ນາມສະກຸນ..." required/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ອີເມວ໌</label>
              <Input className="form-label" name="email" value={staffData.email} onChange={(value) => handleChange("email", value)}
                placeholder="ອີເມວ໌..."/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ເບີໂທ</label>
              <Input className="form-label" name="tell" value={staffData.tell} onChange={(value) => handleChange("tell", value.replace(/[^0-9]/g, ""))}
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
              <Input className="form-label" value={staffData.village} onChange={(value) => handleChange("village", value)}
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
                      placeholder="ອີເມວ໌..." readOnly/>
                  </div>
              <div className="col-md-12">
                  <label className="form-label">Password</label>
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
                    <label className="form-label">Confirmpassword</label>
                    <InputGroup>
                      <Input type='password' />
                    </InputGroup>
                </div>
                </div>
                <div className="col-md-4 mt-2">
                <Checkbox 
                  indeterminate={value.length > 0 && value.length < data.length} 
                  checked={value.length === data.length} 
                  onChange={checked => handleCheckAll(checked)}
                >
                  All
                </Checkbox>
                
                <CheckboxGroup 
                  name="checkboxList" 
                  value={value} 
                  onChange={handleCheck} 
                  style={{ marginLeft: 36 }}
                >
                  {data.map(item => (
                    <Checkbox key={item} value={item}>
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
                </div>
                </>
            )}
            </div>)}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  appearance="primary">
            {modalType === "add" ? "Add" : "Update"}
          </Button>
          <Button onClick={resetForm} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;