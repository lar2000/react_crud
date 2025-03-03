import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, Placeholder, Loader } from "rsuite";
import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { AuthenActions } from "../../../../util";

const ServiceType = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

  const [serviceTypeData, setserviceTypeData] = useState({
    servicetype_id: null,
    servicetype_name: "",
    detail: "",
  });

  const actions = AuthenActions();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/service_type`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch service_type data", err);
    }
    finally{
      setLoading(false)
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
    setLoadingSave(true)
    try {
        await axios.post(`${api}/service_type/create`, serviceTypeData);
        Alert.successData(`${serviceTypeData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit service_type data", err);
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ!');
    }
    finally {
      setLoadingSave(false)
    }
  };
  const handleDeleteClick = async (servicetype_id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
    if (isConfirmed) {
    try {
      await axios.delete(`${api}/service_type/${servicetype_id}`);
      Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete service_type", err);
      Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
    }
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
      <div className="panel panel-inverse">
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
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
          <div style={{ overflowX: 'auto', overflowY:'auto' }}>
          <table id="data-table-default" 
          className={`table ${!loading && 'table-striped'} table-bordered align-middle text-nowrap`}>
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
            {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                  <Placeholder.Grid rows={5} columns={6} active />
                  <Loader size='lg'  content="ກຳລັງໂຫລດ..." vertical />
                  </td>
                </tr>
              ): paginatedData.length > 0 ? paginatedData.map((service_type, index) => (
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
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                            onClick={actions.canUpdate ? () => handleEditClick(service_type) : (e) => e.preventDefault()}>
                              <i className="fas fa-pen-to-square fa-fw"></i>
                             ແກ້ໄຂ</a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                            onClick={actions.canDelete ? () => handleDeleteClick(service_type.servicetype_id) : (e) => e.preventDefault()}>
                            <i className="fas fa-trash fa-fw"></i>
                             ລຶບ
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )): (
                <tr className="text-center">
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນປະເພດບໍລິການ ===============</td>
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
        <Button type="submit" disabled={loadingSave} appearance="primary">
          {loadingSave ? (<Loader content="ກຳລັງບັນທຶກ..."/>):
          <>{modalType === "add" ? "ບັນທຶກ" : "ອັບບເດດ"}</>
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

export default ServiceType;
