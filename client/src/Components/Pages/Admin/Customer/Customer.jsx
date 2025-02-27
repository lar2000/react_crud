import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Placeholder, Loader } from "rsuite";
import { Alert, Notification } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { maskEmail, AuthenActions } from "../../../../util";

const Customer = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

  const [customerData, setCustomerData] = useState({
    cust_id: null,
    cust_name: "",
    cust_surname: "",
    email: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const actions = AuthenActions();

  const fetchgetData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/customer`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch customer data", err);
    }
    finally{
      setLoading(false)
    }
  };
  const resetForm = () => {
    setCustomerData({
      cust_id: null,
      cust_name: "",
      cust_surname: "",
      email: "",
    });
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }

  const handleAddClick = () => {
    handleOpen();
    setModalType("add");
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    handleOpen();
    setCustomerData({
      _id: data.cust_id,
      cust_name: data.cust_name,
      cust_surname: data.cust_surname,
      email: data.email,
    });
  };

  const handleChange = (name, value) => {
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true)
    try {
        await axios.post(`${api}/customer/create`, customerData);
        Alert.successData(`Customer ${customerData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch {
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ!');
    }
    finally {
      setLoadingSave(false)
    }
  };
  const handleDeleteClick = async (cust_id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
    if (isConfirmed) {
    try {
      await axios.patch(`${api}/customer/${cust_id}`);
      Alert.successData('ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!');
      fetchgetData();
    } catch {
       Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
    }
  }
  };
  
  const filteredData = getData.filter((customer) => {
    const matchesSearch =
      customer.cust_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cust_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.cust_surname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "" || customer.status === parseInt(selectedStatus);

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
                  <option value="">ສະມາຊິກທັງໝົດ</option>
                  <option value="0">ທົ່ວໄປ</option>
                  <option value="1">ຈອງແລ້ວ</option>
                  <option value="2">ກຳລັງດຳເນີນການ</option>
                </select>
              </div>
            </div>

            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
                <a href="javarscript:;" className={`btn btn-sm btn-success ms-2 ${!actions.canCreate ? "disabled" : ""}`}
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
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ອີເມວ໌</th>
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
              ): paginatedData.length > 0 ? paginatedData.map((customer, index) => (
                <tr key={customer.cust_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{customer.cust_code}</td>
                  <td>{customer.cust_name} {customer.cust_surname}</td>
                  <td>{maskEmail(customer.email)}</td>
                  <td>
                    { customer.status === 2 ? (
                        <span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>ກຳລັງດຳເນີນການ</span>) 
                        : customer.status === 1 ? (
                        <span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>ຈອງແລ້ວ</span>) 
                        : (
                        <span className="badge border border-secondary text-secondary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>Normal
                        </span>
                    )}
                    </td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                           onClick={actions.canUpdate ? () => handleEditClick(customer) : (e) => e.preventDefault()}>
                            <i className="fas fa-pen-to-square fa-fw"></i>
                             ແກ້ໄຂ</a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                          onClick={actions.canDelete ? () => handleDeleteClick(customer.cust_id) : (e) => e.preventDefault()}>
                            <i className="fas fa-trash fa-fw"></i>
                             ລຶບ
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr className="text-center">
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນສະມາຊິກ ===============</td>
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

      <Modal size={"xs"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນລູກຄ້າ" : "ແກ້ໄຂ ຂໍ້ມູນລູກຄ້າ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">ຊື່</label>
              <Input className="form-label" name="name" value={customerData.cust_name} 
              onChange={(value) => handleChange("cust_name", value)}
              placeholder="ຊື່..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ນາມສະກຸນ</label>
              <Input className="form-label" name="surname" value={customerData.cust_surname} onChange={(value) => handleChange("cust_surname", value)}
             placeholder="ນາມສະກຸນ..." required/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ອີເມວ໌</label>
              <Input className="form-label" name="email" value={customerData.email} onChange={(value) => handleChange("email", value)}
                placeholder="ອີເມວ໌..."/>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loadingSave} appearance="primary">
          {loadingSave ? (<Loader content="ກຳລັງບັນທຶກ..."/>):
          <>
            {modalType === "add" ? "ບັນທຶກ" : "ອັບບເດດ"}
          </>
          }
          </Button>
          <Button onClick={resetForm} color="red" appearance="primary">
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Customer;
