import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, CheckPicker } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { useProduct } from "../../../../config/selectOption";

const Set_Product = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [productData, setProductData] = useState({
    id: null,
    pro_id_fk: [],
    set_id: "",
    set_name: "",
    detail: "",
  });

  const products = useProduct();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/set_product`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch set_product data", err);
    }
  };
  const resetForm = () => {
    setProductData({
        id: null,
        pro_id_fk: [],
        set_id: "",
        set_name: "",
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
    console.log(data.pro_id_fk)
    setModalType("edit");
    handleOpen();
    setProductData({
      _id: data.id,
      pro_id_fk: data.pro_id_fk, // An array
      set_id: data.set_id,
      set_name: data.set_name,
      detail: data.detail,
    });
  };

  const handleChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(productData)
        await axios.post(`${api}/set_product/create`, productData);
        alert(`set_product ${productData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
    } catch (err) {
      console.error("Failed to submit set_product data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${api}/set_product/${id}`);
      alert("set_product member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete set_product", err);
    }
  };
  
  const filteredData = getData.filter((set_product) => {
    const matchesSearch =
      set_product.set_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set_product.set_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "" || set_product.status === parseInt(selectedStatus);

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
        <li className="breadcrumb-item active">set_product</li>
      </ol>
      <h1 className="page-header">
        Manage set_product<small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">set_product Panel </h4>
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
                <th className="text-nowrap">ຊື່ເຊັດສິນຄ້າ</th>
                <th className="text-nowrap">ລາຍລະອຽດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((set_product, index) => (
                <tr key={set_product.id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{set_product.set_id}</td>
                  <td>{set_product.set_name}</td>
                  <td>{set_product.pro_names} <h6>ຄຸນປະໂຫຍດ: </h6>
                    {set_product.detail}
                  </td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(set_product)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(set_product.id)}>
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
              <label className="form-label">ຊື່ເຊັັດສິນຄ້າ</label>
              <Input className="form-label" name="set_name" value={productData.set_name} 
              onChange={(value) => handleChange("set_name", value)}
              placeholder="ຊື່..." required />
            </div>
            <div className="col-md-12">
            <label className="form-label">ເລຶອກສິນຄ້າ</label>
            <CheckPicker className="form-label" data={products} value={productData.pro_id_fk}
                onChange={(value) => handleChange("pro_id_fk", value)}  
                placeholder="ເລືອກສິນຄ້າ" required block/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຍລະອຽດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={productData.detail} onChange={(value) => handleChange("detail", value)}
             placeholder="Textarea" required/>
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

export default Set_Product;
