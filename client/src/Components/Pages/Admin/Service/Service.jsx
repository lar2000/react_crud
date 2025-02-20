import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, SelectPicker } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { useServiceType, useSetProduct } from "../../../../config/selectOption";
// import { formatDuration } from "../../../../util"; 

const Service = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const serviceType = useServiceType();
  const setProducts = useSetProduct();

  const [serviceData, setserviceData] = useState({
    service_id: null,
    service_name: "",
    servicetype_id_fk: "",
    service_duration: "",
    set_id_fk: "",
    price: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/service`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch service data", err);
    }
  };
  const resetForm = () => {
    setserviceData({
      service_id: null,
        service_name: "",
        servicetype_id_fk: "",
        service_duration: "",
        set_id_fk: "",
        price: "",
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
    setserviceData({
      _id: data.service_id,
      service_name: data.service_name,
      servicetype_id_fk: data.servicetype_id_fk,
      service_duration: data.service_duration,
      set_id_fk: data.set_id_fk,
      price: data.price,
    });
  };

  const handleChange = (name, value) => {
    setserviceData({
      ...serviceData,
      [name]: value,
    });
  };
  const handleSelectChange = (event, field) => {
    setserviceData({
      ...serviceData,
      [field]: event,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(serviceData)
        await axios.post(`${api}/service/create`, serviceData);
        alert(`service ${serviceData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit service data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${api}/service/${id}`);
      alert("service member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete service", err);
    }
  };
  
  const filteredData = getData.filter((service) => {
    const matchesSearch =
      service.service_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
        <li className="breadcrumb-item active">service</li>
      </ol>
      <h1 className="page-header"><small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">service Panel</h4>
        </div>
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
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
                <th className="text-nowrap">ຊື່ບໍລິການ</th>
                <th className="text-nowrap">ປະເພດ</th>
                <th className="text-nowrap">ໄລຍະເວລາ</th>
                <th className="text-nowrap">ລາຄາ</th>
                <th className="text-nowrap">ເຊັດສິນຄ້າ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((service, index) => (
                <tr key={service.service_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{service.service_code}</td>
                  <td>{service.service_name}</td>
                  <td>{service.servicetype_name}</td>
                  {/* <td>{formatDuration(service.service_duration)}</td> */}
                  <td>{service.price}</td>
                  <td>{service.set_name}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                      <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(service)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(service.service_id)}>
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
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນບໍລິການ" : "ແກ້ໄຂ ຂໍ້ມູນບໍລິການ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">ຊື່ບໍລິການ</label>
              <Input className="form-label" name="name" value={serviceData.service_name} 
              onChange={(value) => handleChange("service_name", value)}
              placeholder="ຊື່..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ປະເພດບໍລິການ</label>
              <SelectPicker className="form-label" data={serviceType} value={serviceData.servicetype_id_fk}
                onChange={(value) => handleSelectChange(value, "servicetype_id_fk")}
                placeholder="ເລືອກປະເພດ" required block/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ເວລາ</label>
              <Input className="form-label" name="service_duration" value={serviceData.service_duration} 
              onChange={(value) => handleChange("service_duration", value)}
              placeholder="ເວລາ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຄາ</label>
              <Input className="form-label" name="price" value={serviceData.price} 
              onChange={(value) => handleChange("price", value.replace(/[^0-9]/g, ""))}
              placeholder="ລາຄາ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ເຊັດສິນຄ້າ</label>
              <SelectPicker className="form-label" data={setProducts} value={serviceData.set_id_fk}
                onChange={(value) => handleSelectChange(value, "set_id_fk")}
                placeholder="ເລືອກເຊັດສິນຄ້າ..." required/>
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

export default Service;
