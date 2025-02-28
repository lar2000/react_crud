import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import axios from "axios";
import proImage from '../../../../assets/imges.jpg';
import { Modal, Button, SelectPicker, Input } from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { useProduct_Type, useUnit} from "../../../../config/selectOption";

const Product = () => {
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
    pro_id: null,
    pro_code: "",
    pro_name: "",
    size: "",
    amount: "",
    unit_fk: "",
    protype_id_fk: "",
    image: null,
    price: "",
  });

  const prodtypes = useProduct_Type();
  const unit = useUnit();

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
      pro_id: null,
      pro_name: "",
      size: "",
      amount: "",
      unit_fk: null,
      protype_id_fk: "",
      image: null,
      price: "",
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
    setModalType("edit");
    handleOpen();
    setProductData({
      _id: data.pro_id,
      pro_code: data.pro_code,
      pro_name: data.pro_name,
      size: data.size,
      amount: data.amount,
      unit_fk: data.unit_fk,
      protype_id_fk: data.protype_id_fk,
      image: null,
      price: data.price,
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
  
  const handleSelectChange = (event, field) => {
    setProductData({
      ...productData,
      [field]: event,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const formData = new FormData();

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
    } catch (err) {
      console.error("Failed to submit product data", err);
    }
  };
  const handleDeleteClick = async (pro_id) => {
    try {
      await axios.delete(`${api}/product/${pro_id}`);
      alert("product member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };
  
  const filteredData = getData.filter(
    (product) =>
      product.pro_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <a href="javarscript:;" className="btn btn-sm btn-success ms-2"
                  onClick={handleAddClick}>
                  <i className="fas fa-user-plus"></i>
                </a>
              </div>
            </div>
          </div>

          <table id="data-table-default" className="table table-striped table-bordered align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th width="1%" data-orderable="false">#</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ສິນຄ້າ</th>
                <th className="text-nowrap">ຂະໜາດ</th>
                <th className="text-nowrap">ຈຳນວນ</th>
                <th className="text-nowrap">ລາຄາຊື້</th>
                <th className="text-nowrap">ລາຄາລວມ</th>
                <th className="text-nowrap">ປະເພດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((product, index) => (
                <tr key={product.pro_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td width="1%" className="with-img">
                    {product.image && (
                      <img src={`${img}${product.image}`}
                        className="rounded h-30px my-n1 mx-n1" alt="image"/>
                    )}
                  </td>
                  <td>{product.pro_code}</td>
                  <td>{product.pro_name}</td>
                  <td> {product.size}</td>
                  <td style={{ color: product.amount < 10 ? "red" : "inherit" }}>
                      {product.amount} {product.name}
                  </td>
                  <td> {product.price}/{product.name}</td>
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
                             ແກ້ໄຂ</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(product.id)}>
                            <i className="fas fa-trash"></i>
                             ລຶບ
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
              <Input className="form-label" name="pro_name" value={productData.pro_name} 
              onChange={(value) => handleChange("pro_name", value)}
              placeholder="ຊື່ສິນຄ້າ..." required />
            </div>
            <div className="row col-md-6">
                <label className="form-label">ຂະໜາດ</label>
              <Input className="form-label" name="size" value={productData.size} onChange={(value) => handleChange("size", value)}
             placeholder="ຂະໜາດ..." required/>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">ຈຳນວນ</label>
              <Input className="form-label" name="amount" value={productData.amount}
                onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ໜ່ວຍ</label>
              <SelectPicker className="form-label" data={unit} value={productData.unit_fk}
                onChange={(value) => handleSelectChange(value, "unit_fk")}
                placeholder="..." required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາຊື້</label>
              <Input className="form-label" name="price" value={productData.price}
                onChange={(value) => handleChange("price", value.replace(/[^0-9]/g, ""))}
                placeholder="ລາຄາຊື້..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ປະເພດ</label>
              <SelectPicker className="form-label" data={prodtypes} value={productData.protype_id_fk}
                onChange={(value) => handleSelectChange(value, "protype_id_fk")}
                placeholder="ເລືອກປະເພດ" required block/>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  appearance="primary">
            {modalType === "add" ? "ບັນທຶກ" : "ອັບເດດ"}
          </Button>
          <Button onClick={resetForm} appearance="primary" color="red">
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Product;
