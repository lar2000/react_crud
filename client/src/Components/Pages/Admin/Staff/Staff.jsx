import { useEffect, useState } from "react";
import axios from "axios";
import { Notification, Alert } from "../../../../SweetAlert2";
import FormStaff from "./FormStaff";
import { 
  Text, 
  Badge,
  Placeholder,
  Loader
} 
from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { maskEmail, maskPhone, AuthenActions } from "../../../../util";
//import { useProvince, useDistrict, useAthenAtions } from "../../../../config/selectOption"; // Assuming hooks are in this location

const Staff = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/profiles/`;
  const [getData, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  

  // const [staffData, setStaffData] = useState({
  //   staff_id: null,
  //   staff_name: "",
  //   staff_surname: "",
  //   email: "",
  //   tell: "",
  //   profile: null,
  //   village: "",
  //   district_fk: "",
  //   province: "",
  //   staff_status: 0,
  //   password: "",
  //   authen_fk: [],
  // });

  // const provinces = useProvince(); // Fetch province data
  // const districts = useDistrict(staffData.province); // Fetch districts based on selected province
  // const authen_actions = useAthenAtions();
  // const staff_status = [
  //   {label: 'Normal', value: 0},
  //   {label: 'Admin', value: 1}, 
  // ];
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
  // const resetForm = () => {
  //   setStaffData({
  //     staff_id: null,
  //     staff_name: "",
  //     staff_surname: "",
  //     email: "",
  //     tell: "",
  //     profile: null,
  //     village: "",
  //     district_fk: "",
  //     province: "",
  //     staff_status: null,
  //     password: "",
  //     authen_fk: [],
  //   });
  //   setOpen(false);
  //   setImageUrl(userImage); // Reset image URL
  //   setSelectedFile(null); // Reset selected file
  // };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  }

  // const handleCheck = (value) => {
  //   setStaffData(prevState => ({
  //     ...prevState,
  //     authen_fk: value,
  //   }));
  //   setChecked(value);
  // };

  // const handleCheckAll = (_, value) => {
  //   const allValues = value ? authen_actions.map(item => item.value) : [];
  //   setStaffData(prevState => ({
  //     ...prevState,
  //     authen_fk: allValues,
  //   }));
  //   setChecked(allValues);
  // };

  const handleAddClick = () => {
    handleOpen();
    setModalType("add");
  };
const [editData, setEditData]=useState('')
  const handleEditClick = (data) => {
    setEditData(data)
    setModalType("edit");
    handleOpen();
    // setStaffData({
    //   _id: data.staff_id,
    //   staff_name: data.staff_name,
    //   staff_surname: data.staff_surname,
    //   email: data.email,
    //   tell: data.tell,
    //   profile: null,
    //   village: data.village,
    //   district_fk: data.district_fk,
    //   province: data.province_id_fk,
    //   staff_status: data.staff_status,
    //   authen_fk: data.authen_fk.map(id => Number(id)), 
    // });
    // setImageUrl(data.profile ? `${img}${data.profile}` : userImage);
  };
  const [changePass, setChangePass]=useState('')
  const handleChangePass = (item) => {
    setChangePass(item)
    setModalType("editpass");
    handleOpen();
    // setStaffData({
    //   passId: item.staff_id,
    //   email: item.email,
    //   password: "",
    // });
  };
  

//   const handleChange = (name, value) => {
//     setStaffData({
//       ...staffData,
//       [name]: value,
//     });
//   };
//   const handleClearImage = () => {
//     setSelectedFile(null);
//     document.getElementById('fileInput').value = '';
//     setStaffData({
//       ...staffData, profile: null
//     })
//     setImageUrl(userImage)
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageUrl(event.target.result);
//       };
//       setStaffData({
//         ...staffData, profile:file
//       })
//       reader.readAsDataURL(file);
//     } else {
//     setImageUrl(userImage);
//     }
//   };
  
//   const handleSelectChange = (event, field) => {
//     setStaffData({
//       ...staffData,
//       [field]: event,
//     });
//   };

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
          <div style={{ overflowX: 'auto', overflowY:'auto' }}>
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
          </div>
          <Pagination
            total={filteredData.length}
            length={length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      {open && <FormStaff open={open} handleClose={handleClose} modalType={modalType}
      data={editData} fetchgetData={fetchgetData} item={changePass}/>}
    </div>


  );
};

export default Staff;