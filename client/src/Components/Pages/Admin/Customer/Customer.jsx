import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";

const Customer = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [customerData, setCustomerData] = useState({
    cust_id: null,
    cust_name: "",
    cust_surname: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/customer`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch customer data", err);
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
    try {
        console.log(customerData)
        await axios.post(`${api}/customer/create`, customerData);
        alert(`Customer ${customerData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit customer data", err);
    }
  };
  const handleDeleteClick = async (cust_id) => {
    try {
      await axios.patch(`${api}/customer/${cust_id}`);
      alert("Customer member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete customer", err);
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
      <ol className="breadcrumb float-xl-end">
        <li className="breadcrumb-item">
          <a href="javascript:;">Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="javascript:;">Page Options</a>
        </li>
        <li className="breadcrumb-item active">Customer</li>
      </ol>
      <h1 className="page-header">
        Manage Customer <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">Customer Panel</h4>
        </div>
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
              <div className="ms-2 mb-2">
                <select className="form-select form-select-sm" value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="0">Booking</option>
                  <option value="1">In progress</option>
                  <option value="2">Done</option>
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

          <table id="data-table-default" className="table table-striped table-bordered align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ອີດມວ໌</th>
                <th className="text-nowrap">ສະຖານະ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((customer, index) => (
                <tr key={customer.cust_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{customer.cust_code}</td>
                  <td>{customer.cust_name} {customer.cust_surname}</td>
                  <td>{customer.email}</td>
                  <td>
                    {customer.status === 2 ? (
                        <span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>Done</span>) 
                        : customer.status === 1 ? (
                        <span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>In progress</span>) 
                        : (
                        <span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>Booking
                        </span>
                    )}
                    </td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(customer)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(customer.cust_id)}>
                            <i className="fas fa-trash"></i>
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

export default Customer;
