import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";

const RoomType = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [roomtypeData, setroomtypeData] = useState({
    roomtype_name: "",
    room_price: "",
    room_amount: "",
    detail: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/roomtype`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch room_type data", err);
    }
  };
  const resetForm = () => {
    setroomtypeData({
      roomtype_id: null,
      roomtype_name: "",
      room_price: "",
      room_amount: "",
      detail : "",
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
    setroomtypeData({
      roomtype_id: data.roomtype_id,
      roomtype_name: data.roomtype_name,
      room_price: data.room_price,
      room_amount: data.room_amount,
      detail: data.detail,
    });
  };

  const handleChange = (name, value) => {
    setroomtypeData({
      ...roomtypeData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(roomtypeData)
        await axios.post(`${api}/roomtype/create`, roomtypeData);
        alert(`room_type ${roomtypeData.roomtype_id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit room_type data", err);
    }
  };
  const handleDeleteClick = async (roomtype_id) => {
    try {
      await axios.delete(`${api}/roomtype/${roomtype_id}`);
      alert("room_type member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete room_type", err);
    }
  };
  
  const filteredData = getData.filter((room_type) => {
    const matchesSearch =
      room_type.roomtype_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room_type.roomtype_name.toLowerCase().includes(searchTerm.toLowerCase());

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
        <li className="breadcrumb-item active">room_type</li>
      </ol>
      <h1 className="page-header"><small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">room_type Panel</h4>
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
                <th className="text-nowrap">ຊື່ປະເພດຫ້ອງ</th>
                <th className="text-nowrap">ລາຄາ</th>
                <th className="text-nowrap">ຈຳນວນ</th>
                <th className="text-nowrap">ລາຍລະອຽດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((room_type, index) => (
                <tr key={room_type.roomtype_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{room_type.roomtype_code}</td>
                  <td>{room_type.roomtype_name}</td>
                  <td>{room_type.room_price}</td>
                  <td>{room_type.room_amount} ຫ້ອງ</td>
                  <td>{room_type.detail}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(room_type)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(room_type.roomtype_id)}>
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
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນປະເພດຫ້ອງ" : "ແກ້ໄຂ ຂໍ້ມູນປະເພດຫ້ອງ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">ຊື່ປະເພດຫ້ອງ</label>
              <Input className="form-label" name="name" value={roomtypeData.roomtype_name}
               onChange={(value) => handleChange("roomtype_name", value)}
              placeholder="ຊື່ປະເພດຫ້ອງ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຄາ</label>
              <Input className="form-label" name="price" value={roomtypeData.room_price}
               onChange={(value) => handleChange("room_price", value.replace(/[^0-9]/g, ""))}
              placeholder="0" required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ຈຳນວນ</label>
              <Input className="form-label" name="amount" value={roomtypeData.room_amount}
               onChange={(value) => handleChange("room_amount", value.replace(/[^0-9]/g, ""))}
              placeholder="0" required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຍລະອຽດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={roomtypeData.detail}
               onChange={(value) => handleChange("detail", value)}
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

export default RoomType;
