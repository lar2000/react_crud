import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, SelectPicker, DatePicker, Input } from "rsuite";
import { format } from "date-fns";
import { Config } from "../../../../config/connection";
import { useProduct } from "../../../../config/selectOption";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";

const Importproduct = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null); // for storing the selected date
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [importproductData, setImportProductData] = useState({
    id: null,
    pro_id_fk: "",
    amount: "",
    price: "",
    total: 0,
    date: null,
  });

  const products = useProduct();

  useEffect(() => {
    fetchgetImpData();
  }, []);
  
  useEffect(() => {
  const amount = parseFloat(importproductData.amount) || 0; // Handle non-numeric or empty inputs
  const price = parseFloat(importproductData.price) || 0;   // Handle non-numeric or empty inputs
  setImportProductData((prevState) => ({
    ...prevState,
    total: amount * price, // Update the total
  }));
}, [importproductData.amount, importproductData.price]);


  const fetchgetImpData = async () => {
    try {
      const res = await axios.get(`${api}/imp`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch importproduct data", err);
    }
  };
  const resetForm = () => {
    setImportProductData({
      id: null,
      pro_id_fk: "",
      amount: 0,
      price: 0,
      total: 0,
      date: null,
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
    setImportProductData({
      _id: data.id,
      pro_id_fk: data.pro_id_fk,
      amount: data.amount,
      price: data.price,
      total: data.total,
      date: data.date,
    });
  };

  const handleChange = (name, value) => {
    setSearchDate(value);
    setImportProductData({
      ...importproductData,
      [name]: value,
    });
  };
  const handleDateChange = (value) => {
    setImportProductData((prevData) => ({
      ...prevData,
      date: value,
    }));
  };
  const handleDateSearch = (value) => {
    setSearchDate(value);
  };
  

  const handleSelectChange = (event, field) => {
    setImportProductData({
      ...importproductData,
      [field]: event,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
        await axios.post(`${api}/imp/create`, importproductData);
        alert(`importproduct ${importproductData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetImpData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit importproduct data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    alert(id);
    try {
      await axios.delete(`${api}/imp/${id}`);
      alert("importproduct member soft deleted successfully!");
      fetchgetImpData();
    } catch (err) {
      console.error("Failed to delete importproduct", err);
    }
  };
  
  const filteredData = getData.filter((importproduct) => {
    const searchDateMatch =
      searchDate && importproduct.date
        ? format(new Date(importproduct.date), "yyyy-MM-dd") === format(new Date(searchDate), "yyyy-MM-dd")
        : true; // If no searchDate is set, this condition is true
  
    const searchTermMatch =
      importproduct.pro_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      importproduct.pro_name.toLowerCase().includes(searchTerm.toLowerCase());
  
    return searchTermMatch && searchDateMatch; // Combine both filters
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
        <li className="breadcrumb-item active">importproduct</li>
      </ol>
      <h1 className="page-header">
        Manage importproduct <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">importproduct Panel</h4>
        </div>

        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
            </div>

            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <div className="mb-2 ms-2">
              <DatePicker size="sm" format="yyyy-MM-dd" value={searchDate}  style={{ width: 180 }}

                onChange={handleDateSearch} placeholder="Select Date"/>
              </div>
              <div className="actions mb-2">
                <a href="javarscript:;"
                  className="btn btn-sm btn-success ms-2"
                  onClick={handleAddClick}
                >
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
                {/* <th width="1%" data-orderable="false">#</th> */}
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ສິນຄ້າ</th>
                <th className="text-nowrap">ຂະໜາດ(ml)</th>
                <th className="text-nowrap">ຈຳນວນ</th>
                <th className="text-nowrap">ລາຄານຳເຂົ້າ</th>
                <th className="text-nowrap">ລາຄາລວມ</th>
                <th className="text-nowrap">ວັນທີນຳເຂົ້າ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((importproduct, index) => (
                <tr key={importproduct.id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  {/* <td width="1%" className="with-img">
                    {importproduct.image && (
                      <img src={`${img}${importproduct.image}`}
                        className="rounded h-30px my-n1 mx-n1" alt="image"/>
                    )}
                  </td> */}
                  <td>{importproduct.pro_id}</td>
                  <td>{importproduct.pro_name}</td>
                  <td> {importproduct.size}</td>
                  <td>{importproduct.amount}</td>
                  <td> {importproduct.price}</td>
                  <td> {importproduct.total}</td>
                  <td> {format(new Date(importproduct.date), "dd-MM-yyyy")}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a
                          href="javascript:;"
                          className="btn-primary btn-sm dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="fas fa-ellipsis"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(importproduct)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(importproduct.id)}>
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

      <Modal size={"sm"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນສິນຄ້າ" : "ແກ້ໄຂ ຂໍ້ມູນສິນຄ້າ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            {/* <div className="mb-3 d-flex justify-content-center align-items-center">
            <label role='button'>
              <input type="file" id="fileInput" accept="image/*" className='hide' onChange={handleFileChange}/>
                <img src={imageUrl} className="w-150px rounded-3" />
            </label>
            {selectedFile && ( 
              <span role='button' onClick={handleClearImage} 
              className=" d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5">
                <i className="fa-solid fa-xmark"></i></span>
            )}
            </div> */}
            <div className="col-md-6">
              <label className="form-label">ຊື່ສິນຄ້າ-{importproductData.pro_id_fk}</label>
              <SelectPicker className="form-label" data={products} value={importproductData.pro_id_fk}
              onChange={(value) => handleSelectChange(value, 'pro_id_fk')}
              placeholder="ເລືອກຊື່ສິນຄ້າ" required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ຈຳນວນ</label>
              <Input className="form-label" value={importproductData.amount}
                onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາຊື້ມື້ນີ້</label>
              <Input className="form-label" value={importproductData.price}
                onChange={(value) => handleChange("price", value.replace(/[^0-9]/g, ""))}
                placeholder="ລາຄາຊື້..." required/>
            </div>

            <div className="col-md-6">
              <label className="form-label">ລາຄາລວມ</label>
              <Input className="form-label" value={importproductData.total}
                placeholder="ລາຄາລວມ..." readOnly/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ວ.ດ.ປ</label>
              <DatePicker className="form-label" value={importproductData.date}
              onChange={handleDateChange} style={{ width: 300 }}/>
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

export default Importproduct;
