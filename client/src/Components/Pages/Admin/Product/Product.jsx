import { useState, useEffect } from "react";
import axios from "axios";
import proImage from '../../../../assets/imges.jpg';
import { Modal, Button, SelectPicker, Input } from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { useProduct_Type } from "../../../../config/selectOption";

const product = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/images/`;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(proImage);

  const [productData, setProductData] = useState({
    id: null,
    pro_id: "",
    pro_name: "",
    size: "",
    amount: "",
    protype_id_fk: "",
    image: null,
    price: "",
    total: "",
  });

  const protypes = useProduct_Type();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/product`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch product data", err);
    }
  };
  const resetForm = () => {
    setProductData({
      id: null,
      pro_name: "",
      size: "",
      amount: "",
      protype_id_fk: "",
      image: null,
      price: "",
      total: "",
    });
    setOpen(false);
    setImageUrl(proImage); // Reset image URL
    setSelectedFile(null); // Reset selected file
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
    alert(data.protype_id_fk)
    setModalType("edit");
    handleOpen();
    setProductData({
      _id: data.id,
      pro_id: data.pro_id,
      pro_name: data.pro_name,
      size: data.size,
      amount: data.amount,
      protype_id_fk: data.protype_id_fk,
      image: null,
      price: data.price,
      total: data.total,
    });
    setImageUrl(data.image ? `${img}${data.image}` : proImage);
  };

  const handleChange = (name, value) => {
    setProductData({
      ...productData,
      [name]: value,
    });
  };
  const handleClearImage = () => {
    setSelectedFile(null);
    document.getElementById('fileInput').value = '';
    setProductData({
      ...productData, image: null
    })
    setImageUrl(proImage)
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      setProductData({
        ...productData, image:file
      })
      reader.readAsDataURL(file);
    } else {
    setImageUrl(proImage);
    }
  };
  
//   const handleSelectChange = (event, field) => {
//     setProductData({
//       ...productData,
//       [field]: event,
//     });
//   };
const handleSelectChange = (value) => {
    setProductData((prevData) => ({
      ...prevData,
      protype_id_fk: value, // Update the selected product type
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const formData = new FormData();
    // Append product data to FormData
    for (const key in productData) {
      formData.append(key, productData[key]);
    }
    try {
        await axios.post(`${api}/product/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(`product ${productData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit product data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    alert(id);
    try {
      await axios.patch(`${api}/product/${id}`);
      alert("product member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };
  
  const filteredData = getData.filter(
    (product) =>
      product.pro_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <li className="breadcrumb-item active">product</li>
      </ol>
      <h1 className="page-header">
        Manage product <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">product Panel</h4>
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

          <table
            id="data-table-default"
            className="table table-striped table-bordered align-middle text-nowrap"
          >
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th width="1%" data-orderable="false">#</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ສິນຄ້າ</th>
                <th className="text-nowrap">ຂະໜາດ(ml)</th>
                <th className="text-nowrap">ຈຳນວນ</th>
                <th className="text-nowrap">ລາຄາຊື້</th>
                <th className="text-nowrap">ລາຄາລວມ</th>
                <th className="text-nowrap">ປະເພດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((product, index) => (
                <tr key={product.id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td width="1%" className="with-img">
                    {product.image && (
                      <img src={`${img}${product.image}`}
                        className="rounded h-30px my-n1 mx-n1" alt="image"/>
                    )}
                  </td>
                  <td>{product.pro_id}</td>
                  <td>{product.pro_name}</td>
                  <td> {product.size}</td>
                  <td>{product.amount}</td>
                  <td> {product.price}</td>
                  <td> {product.total}</td>
                  <td>{product.protype_name}</td>
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
                            onClick={() => handleEditClick(product)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(product.id)}>
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
              <label className="form-label">ຊື່ສິນຄ້າ</label>
              <Input className="form-label" value={productData.pro_name} onChange={(value) => handleChange("pro_name", value)}
              placeholder="ຊື່ສິນຄ້າ..." required />
            </div>
            <div className="col-md-6">
              <label className="form-label">ຂະໜາດ(ml)</label>
              <Input className="form-label" value={productData.size} onChange={(value) => handleChange("size", value.replace(/[^0-9]/g, ""))}
             placeholder="ຂະໜາດ(ml)..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ຈຳນວນ</label>
              <Input className="form-label" value={productData.amount} onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..."/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາຊື້</label>
              <Input className="form-label" value={productData.amount} onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..."/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາລວມ</label>
              <Input className="form-label" value={productData.amount} onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..."/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ປະເພດ</label>
              <SelectPicker className="form-label" data={protypes} value={productData.protype_id_fk}
                onChange={handleSelectChange}
                placeholder="ເລືອກປະເພດ" required block/>
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

export default product;
