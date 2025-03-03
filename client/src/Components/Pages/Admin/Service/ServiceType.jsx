import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";

const ServiceType = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [serviceTypeData, setserviceTypeData] = useState({
    servicetype_id: null,
    servicetype_name: "",
    detail: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/service_type`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch service_type data", err);
    }
  };
  const resetForm = () => {
    setserviceTypeData({
      servicetype_id: null,
      servicetype_name: "",
      detail: "",
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
    setserviceTypeData({
      servicetype_id: data.servicetype_id,
      servicetype_name: data.servicetype_name,
      detail: data.detail,
    });
  };

  const handleChange = (name, value) => {
    setserviceTypeData({
      ...serviceTypeData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(serviceTypeData)
        await axios.post(`${api}/service_type/create`, serviceTypeData);
        alert(`service_type ${serviceTypeData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit service_type data", err);
    }
  };
  const handleDeleteClick = async (servicetype_id) => {
    try {
      await axios.delete(`${api}/service_type/${servicetype_id}`);
      alert("service_type member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete service_type", err);
    }
  };
  
  const filteredData = getData.filter((service_type) => {
    const matchesSearch =
      service_type.servicetype_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service_type.servicetype_name.toLowerCase().includes(searchTerm.toLowerCase());

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
        <li className="breadcrumb-item active">service_type</li>
      </ol>
      <h1 className="page-header">
        Manage service_type <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">service_type Panel</h4>
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
                <th className="text-nowrap">ຊື່ປະເພດບໍລິການ</th>
                <th className="text-nowrap">ລາຍລະອຽດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((service_type, index) => (
                <tr key={service_type.servicetype_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{service_type.servicetype_code}</td>
                  <td>{service_type.servicetype_name}</td>
                  <td>{service_type.detail}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(service_type)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(service_type.servicetype_id)}>
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
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນປະເພດບໍລິການ" : "ແກ້ໄຂ ຂໍ້ມູນປະເພດບໍລິການ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">ຊື່ປະເພດບໍລິການ</label>
              <Input className="form-label" name="name" value={serviceTypeData.servicetype_name} onChange={(value) => handleChange("servicetype_name", value)}
              placeholder="ຊື່ປະເພດບໍລິການ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຍລະອຽດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={serviceTypeData.detail} onChange={(value) => handleChange("detail", value)}
                placeholder="ລາຍລະອຽດ..."/>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  appearance="primary">
            {modalType === "add" ? "ບັນທຶກ" : "Update"}
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

export default ServiceType;
