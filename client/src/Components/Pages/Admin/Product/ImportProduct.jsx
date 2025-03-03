import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, SelectPicker, DatePicker, Input, Placeholder, Loader } from "rsuite";
import { format } from "date-fns";
import { Config } from "../../../../config/connection";
import { useProduct } from "../../../../config/selectOption";
import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { AuthenActions } from "../../../../util";

const Importproduct = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null); // for storing the selected date
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

  const [importproductData, setImportProductData] = useState({
    imp_id: null,
    pro_id_fk: "",
    amount: "",
    price: "",
    date: null,
  });

  const products = useProduct();
  const actions = AuthenActions();

  useEffect(() => {
    fetchgetImpData();
  }, []);

  const fetchgetImpData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/imp`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch importproduct data", err);
    }
    finally {
      setLoading(false)
    }
  };
  const resetForm = () => {
    setImportProductData({
      imp_id: null,
      pro_id_fk: "",
      amount: 0,
      price: 0,
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
    alert(data.imp_id)
    setModalType("edit");
    handleOpen();
    setImportProductData({
      imp_id: data.imp_id,
      pro_id_fk: data.pro_id_fk,
      amount: data.amount,
      price: data.price,
      date: new Date(data.date)
    });
  };

  const handleChange = (name, value) => {
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
    setLoadingSave(true)
    try {
        await axios.post(`${api}/imp/create`, importproductData);
        Alert.successData(`${importproductData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
        handleClose();
        fetchgetImpData();
    } catch (err) {
      console.error("Failed to submit importproduct data", err);
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ!');
    }
    finally {
      setLoadingSave(false)
    }
  };
  const handleDeleteClick = async (imp_id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
    if (isConfirmed) {
      try {
        await axios.delete(`${api}/imp/${imp_id}`);
        Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
        fetchgetImpData();
      } catch (err) {
        console.error("Failed to delete importproduct", err);
        Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
      }
    }
  };
  
  const filteredData = getData.filter((importproduct) => {
    const searchDateMatch =
      searchDate && importproduct.date
        ? format(new Date(importproduct.date), "yyyy-MM-dd") === format(new Date(searchDate), "yyyy-MM-dd")
        : true; // If no searchDate is set, this condition is true
  
    const searchTermMatch =
      importproduct.pro_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      importproduct.pro_name.toLowerCase().includes(searchTerm.toLowerCase());
  
    return searchTermMatch && searchDateMatch; // Combine both filters
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
              <div className="mb-2 ms-2">
              <DatePicker size="sm" format="yyyy-MM-dd" value={searchDate}  style={{ width: 180 }}
                onChange={handleDateSearch} placeholder="Select Date"/>
              </div>
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
                {/* <th width="1%" data-orderable="false">#</th> */}
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ສິນຄ້າ</th>
                <th className="text-nowrap">ຂະໜາດ</th>
                <th className="text-nowrap">ຈຳນວນ</th>
                <th className="text-nowrap">ລາຄານຳເຂົ້າ</th>
                <th className="text-nowrap">ລາຄາລວມ</th>
                <th className="text-nowrap">ວັນທີນຳເຂົ້າ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                  <Placeholder.Grid rows={7} columns={6} active />
                  <Loader size='lg'  content="ກຳລັງໂຫລດ..." vertical />
                  </td>
                </tr>
              ): paginatedData.length > 0 ? paginatedData.map((importproduct, index) => (
                <tr key={importproduct.imp_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{importproduct.pro_code}</td>
                  <td>{importproduct.pro_name}</td>
                  <td> {importproduct.size}</td>
                  <td>{importproduct.amount}</td>
                  <td> {importproduct.price}</td>
                  <td> {importproduct.total}</td>
                  <td> {format(new Date(importproduct.date), "dd-MM-yyyy")}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"
                          data-bs-toggle="dropdown"><i className="fas fa-ellipsis"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                            onClick={actions.canUpdate ? () => handleEditClick(importproduct) : (e) => e.preventDefault()}>
                            <i className="fas fa-pen-to-square fa-fw"></i>
                            ແກ້ໄຂ
                          </a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                            onClick={actions.canDelete ? () => handleDeleteClick(importproduct.imp_id) : (e) => e.preventDefault()}>
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
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນນຳເຂົ້າສິນຄ້າ ===============</td>
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

      <Modal size={"sm"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນສິນຄ້າ" : "ແກ້ໄຂ ຂໍ້ມູນສິນຄ້າ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">ຊື່ສິນຄ້າ</label>
              <SelectPicker className="form-label" data={products} value={importproductData.pro_id_fk}
              onChange={(value) => handleSelectChange(value, 'pro_id_fk')}
              placeholder="ເລືອກຊື່ສິນຄ້າ" required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ຈຳນວນ</label>
              <Input className="form-label" name="amount" value={importproductData.amount}
                onChange={(value) => handleChange("amount", value.replace(/[^0-9]/g, ""))}
                placeholder="ຈຳນວນ..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາຊື້ມື້ນີ້</label>
              <Input className="form-label" name="price" value={importproductData.price}
                onChange={(value) => handleChange("price", value.replace(/[^0-9]/g, ""))}
                placeholder="ລາຄາຊື້..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ວ.ດ.ປ</label>
              <DatePicker className="form-label" value={importproductData.date}
              onChange={handleDateChange} style={{ width: 300 }}/>
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

export default Importproduct;
