import { useEffect, useState } from "react";
import axios from "axios";
import {Text, Modal, Button, Input, CheckPicker, Placeholder, Loader  } from "rsuite";
import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { useProduct } from "../../../../config/selectOption";
import { AuthenActions } from "../../../../util";

const Set_Product = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

  const [productData, setProductData] = useState({
    set_id: null,
    pro_id_fk: [],
    set_code: "",
    set_name: "",
    detail: "",
  });

  const products = useProduct();
  const actions = AuthenActions();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/set_product`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch set_product data", err);
    }
    finally{
      setLoading(false)
    }
  };
  const resetForm = () => {
    setProductData({
      set_id: null,
        pro_id_fk: [],
        set_code: "",
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
    setModalType("edit");
    handleOpen();
    setProductData({
      _id: data.set_id,
      pro_id_fk: data.pro_id_fk.map(id => Number(id)), // An array
      set_code: data.set_code,
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
    setLoadingSave(true)
    try {
        await axios.post(`${api}/set_product/create`, productData);
        Alert.successData(`${productData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
        handleClose();
        fetchgetData();
    } catch (err) {
      console.error("Failed to submit set_product data", err);
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ!');
    }
    finally {
      setLoadingSave(false)
    }
  };
  const handleDeleteClick = async (id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
      if (isConfirmed) {
        try {
          await axios.delete(`${api}/set_product/${id}`);
          Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
          fetchgetData();
        } catch (err) {
          console.error("Failed to delete set_product", err);
          Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
          }
      }
  };
  
  const filteredData = getData.filter((set_product) => {
    const matchesSearch =
      set_product.set_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set_product.set_name.toLowerCase().includes(searchTerm.toLowerCase());

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
                <th className="text-nowrap">ຊື່ເຊັດສິນຄ້າ</th>
                <th className="text-nowrap">ລາຍລະອຽດສິນຄ້າ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                  <Placeholder.Grid rows={4} columns={6} active />
                  <Loader size='lg'  content="ກຳລັງໂຫລດ..." vertical />
                  </td>
                </tr>
              ): paginatedData.length > 0 ? paginatedData.map((set_product, index) => (
                <tr key={set_product.set_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{set_product.set_code}</td>
                  <td>{set_product.set_name}</td>
                  <td>{set_product.pro_names}
                    <Text color="blue">{set_product.detail}</Text>
                  </td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                            onClick={actions.canUpdate ? () => handleEditClick(set_product) : (e) => e.preventDefault()}>
                              <i className="fas fa-pen-to-square fa-fw"></i>
                             ແກ້ໄຂ</a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                            onClick={actions.canDelete ? () => handleDeleteClick(set_product.set_id) : (e) => e.preventDefault()}>
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
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນ ===============</td>
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
            <CheckPicker  placement="auto" className="form-label" data={products} value={productData.pro_id_fk}
                onChange={(value) => handleChange("pro_id_fk", value)}  
                placeholder="ເລືອກສິນຄ້າ" required block/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຍລະອຽດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={productData.detail} onChange={(value) => handleChange("detail", value)}
             placeholder="Textarea"/>
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

export default Set_Product;
