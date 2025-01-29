import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, SelectPicker, Input, DateRangePicker, TimePicker } 
from "rsuite";
import { Config, Urlimage } from "../../../../config/connection";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { useServiceType, useCustomer  } from "../../../../config/selectOption"; // Assuming hooks are in this location

const Booking = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/profiles/`;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [bookData, setbookData] = useState({
    id: null,
    group_type: "",
    cust_id_fk: null,
    date: [null, null],
    time: null,
    service_id_fk: null,
    group_size: "",
    email: "",
    tell: "",
    note: "",
  });

  const serviceType = useServiceType();
  const customers = useCustomer();
  const groupData = ['ກຸ່ມ', 'ລາຍບຸກຄົນ'].map(
    item => ({ label: item, value: item })
  );

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/booking`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch booking data", err);
    }
  };
  const resetForm = () => {
    setbookData({
      id: null,
      group_type: "",
      date: [null, null],
      time: null,
      cust_id_fk: null,
      service_id_fk: null,
      group_size: "",
      email: "",
      tell: "",
      note:""
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

  const handleDateSelect = (range) => {
    if (range && range.length === 2) {
      setbookData({ ...bookData, date: range });
    }
  };

  const handleTimeChange = (field, time) => {
    setbookData({
      ...bookData,
      [field]: time,
    });
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    handleOpen();
    setbookData({
      _id: data.id,
      group_type: data.group_type,
      date: [new Date(data.date[0]), new Date(data.date[1])],
      time: null,
      cust_id_fk: data.cust_id_fk,
      service_id_fk: data.service_id_fk,
      group_size: data.group_size,
      email: data.email,
      tell: data.tell,
      note: data.note,
    });
  };

  const handleChange = (name, value) => {
    setbookData({
      ...bookData,
      [name]: value,
    });
  };
  const handleSelectChange = (event, field) => {
    setbookData({
      ...bookData,
      [field]: event,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    const formData = new FormData();
    // Append booking data to FormData
    for (const key in bookData) {
      formData.append(key, bookData[key]);
    }
    try {
        await axios.post(`${api}/booking/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(`booking ${bookData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit booking data", err);
    }
  };
  const handleDeleteClick = async (id) => {
    alert(id);
    try {
      await axios.patch(`${api}/booking/${id}`);
      alert("booking member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete booking", err);
    }
  };
  
  const filteredData = getData.filter(
    (booking) =>
      booking.book_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_surname.toLowerCase().includes(searchTerm.toLowerCase())
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
        <li className="breadcrumb-item active">booking</li>
      </ol>
      <h1 className="page-header">
        Manage booking <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">booking Panel</h4>
        </div>

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
                <th className="text-nowrap">ລະຫັດຈອງ</th>
                <th className="text-nowrap">ປະເພດຈອງ</th>
                <th className="text-nowrap">ລະຫັດລູກຄ້າ</th>
                <th className="text-nowrap">date</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ຂໍ້ມູນຕິດຕໍ່</th>
                <th className="text-nowrap">ໝາຍເຫດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((booking, index) => (
                <tr key={booking.id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td width="1%" className="with-img">
                    {booking.profile && (
                      <img
                        src={`${img}${booking.profile}`}
                        className="rounded h-30px my-n1 mx-n1"
                        alt="profile"
                      />
                    )}
                  </td>
                  <td>{booking.book_id}</td>
                  <td>{booking.group_type}</td>
                  <td>{booking.cust_id}</td>
                  <td>{booking.date}</td>
                  <td>{booking.cust_name} {booking.cust_surname}</td>
                  <td>{booking.group_size}</td>
                  <td>{booking.email}</td>
                  <td>{booking.tell}</td>
                  <td>{booking.note}</td>
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
                            onClick={() => handleEditClick(booking)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(booking.id)}>
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

      <Modal size={"md"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນການຈອງ" : "ແກ້ໄຂ ຂໍ້ມູນການຈອງ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
          <div className="col-md-6">
              <label className="form-label">ປະເພດຈອງ</label>
              <SelectPicker className="form-label" data={groupData} searchable={false}
                value={bookData.group_type}
                onChange={(value) => handleSelectChange(value, "group_type")}
                placeholder="ເລືອກ" required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ຈຳນວນຄົນ</label>
              <Input className="form-label" name="amount" value={bookData.group_size} 
              onChange={(value) => handleChange("group_size", value.replace(/[^0-9]/g, ""))}
              placeholder="" required />
            </div>
            <div className="col-md-6">
              <label className="form-label">ວັນທີ</label>
              <DateRangePicker className="form-label" name="date" value={bookData.date} 
              onChange={(date) => handleDateSelect(date)}
              placeholder="" required style={{ width: "100%" }}/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ເວລາ</label>
              <TimePicker className="form-label" value={bookData.time}
              onChange={(time) => handleTimeChange("time", time)}
              placeholder="" required style={{ width: "100%" }}/>
          </div>
            <div className="col-md-6">
              <label className="form-label">ປະເພດບໍລິການ</label>
              <SelectPicker className="form-label" data={serviceType} value={bookData.service_id_fk}
                onChange={(value) => handleSelectChange(value, "service_id_fk")}
                placeholder="ເລືອກປະເພດບໍລິການ" required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ຊື່ ແລະ ນາມສະກຸນ</label>
              <SelectPicker className="form-label" data={customers} value={bookData.cust_id_fk}
                onChange={(value) => handleSelectChange(value, "cust_id_fk")}
                placeholder="ເລືອກຊື່..." required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ອີເມວ໌</label>
              <Input className="form-label" name="email" value={bookData.email} 
              onChange={(value) => handleChange("email", value)}
                placeholder="ອີເມວ໌..."/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ເບີໂທ</label>
              <Input className="form-label" name="tell" value={bookData.tell} 
              onChange={(value) => handleChange("tell", value.replace(/[^0-9]/g, ""))}
                placeholder="020xxxxxxxx/030xxxxxxx" required/>
            </div>
            <div className="col-md-12">
              <label className="form-label">ໝາຍເຫດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={bookData.note} 
              onChange={(value) => handleChange("note", value.replace(/[^0-9]/g, ""))}
                placeholder="textarea..." required/>
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

export default Booking;
