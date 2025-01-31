import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, SelectPicker, DatePicker, Input, Text, DateRangePicker, Timeline } 
from "rsuite";
import TimeRoundIcon from '@rsuite/icons/TimeRound';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import { format } from "date-fns";
import { Config} from "../../../../config/connection";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { useServiceType, useCustomer  } from "../../../../config/selectOption"; // Assuming hooks are in this location

const Booking = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [reloadKey, setReloadKey] = useState(0); // Trigger re-fetch of customers
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [bookData, setbookData] = useState({
    book_id: null,
    group_type: "",
    cust_id_fk: null,
    date: [null, null],
    service_id_fk: null,
    group_size: "",
    email: "",
    tell: "",
    note: "",
  });

  const serviceType = useServiceType();
  const customers = useCustomer(reloadKey);
  const group_type = ['ກຸ່ມ', 'ບຸກຄົນ'].map(
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
      book_id: null,
      group_type: "",
      date: [null, null],
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

  const handleDateSearch = (value) => {
    setSearchDate(value);
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    handleOpen();
    setbookData({
      book_id: data.book_id,
      group_type: data.group_type,
      date: [new Date(data.date), new Date(data.dateEnd)],
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
   
    try {
        await axios.post(`${api}/booking/create`, bookData);
        alert(`booking ${bookData.book_id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        setReloadKey((prevKey) => prevKey + 1); // Increment key to trigger re-fetch of customers
    } catch (err) {
      console.error("Failed to submit booking data", err);
    }
  };
  const handleDeleteClick = async (book_id, cust_id_fk) => {
    alert(cust_id_fk)
    try {
      await axios.patch(`${api}/booking/${book_id}`, { cust_id_fk }); // Send cust_id_fk
      alert("Booking member soft deleted successfully!");
      fetchgetData();
      setReloadKey((prevKey) => prevKey + 1); // Increment key to trigger re-fetch of customers
    } catch (err) {
      console.error("Failed to delete booking", err);
    }
  };  

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
  
    // Show first 2 letters, mask the rest, and keep "@gmail.com"
    return name.substring(0, 2) + "***@" + domain;
  };
  const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.substring(0, 2) + "*****" + phone.slice(-3);
  };
    
  
  const filteredData = getData.filter((booking) => {
    const searchDateMatch =
      searchDate && booking.date
        ? format(new Date(booking.date), "yyyy-MM-dd") === format(new Date(searchDate), "yyyy-MM-dd")
        : true; // If no searchDate is set, this condition is true
  
    const searchTermMatch =
      booking.book_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cust_surname.toLowerCase().includes(searchTerm.toLowerCase());
  
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
              <div className="mb-2 ms-2">
              <DatePicker size="sm" format="yyyy-MM-dd" value={searchDate}  style={{ width: 180 }}
                onChange={handleDateSearch} placeholder="Select Date"/>
              </div>
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
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ປະເພດຈອງ</th>
                <th className="text-nowrap">ວັນທີຈອງ~ສິ້ນສຸດ</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ຂໍ້ມູນຕິດຕໍ່</th>
                <th className="text-nowrap">ບໍລິການ</th>
                <th className="text-nowrap">ໝາຍເຫດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((booking, index) => (
                <tr key={booking.book_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{booking.book_code}</td>
                  <td>{booking.group_type}
                    <Text color="blue" weight="semibold">({booking.group_size} ຄົນ)</Text>
                  </td>
                  <Timeline className="custom-timeline">
                    <Timeline.Item dot={<TimeRoundIcon style={{ marginBottom: '8px' }}/>}>
                      <p>{format(new Date(booking.date), "dd-MM-yyyy")}</p>
                    </Timeline.Item>
                    <Timeline.Item dot={<CheckRoundIcon style={{ marginBottom: '8px' }}/>}>
                      <p>{format(new Date(booking.dateEnd), "dd-MM-yyyy")}</p>
                    </Timeline.Item>
                  </Timeline>
                  <td>{booking.cust_name} {booking.cust_surname}
                  <Text muted>{booking.cust_code}</Text>
                  </td>
                  <td>{maskEmail(booking.email)}
                    <Text muted>{maskPhone(booking.tell)}</Text>
                  </td>
                  <td>{booking.service_name}
                  {/* <Text color="green" weight="semibold">(ລາຄາລວມ: {booking.total_price} ກີບ)</Text> */}
                  </td>
                  <td>{booking.note}</td>
                  <td><div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="dropdown-item">
                          <i className="fas fa-eye"></i></a>  
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle ms-2"
                          data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end"> 
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(booking)}><i className="fas fa-pen-to-square"></i></a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(booking.book_id, booking.cust_id_fk)}>
                            <i className="fas fa-trash"></i></a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={filteredData.length} length={length}
            currentPage={currentPage} setCurrentPage={setCurrentPage}/>
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
          <div className="col-md-2">
              <label className="form-label">ຈຳນວນຄົນ</label>
              <Input className="form-label" name="amount" value={bookData.group_size} 
              onChange={(value) => handleChange("group_size", value.replace(/[^0-9]/g, ""))}
              placeholder="" required />
            </div>
          <div className="col-md-4">
              <label className="form-label">ປະເພດຈອງ</label>
              <SelectPicker className="form-label" data={group_type} searchable={false}
                value={bookData.group_type}
                onChange={(value) => handleSelectChange(value, "group_type")}
                placeholder="ເລືອກ" required block/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ວັນທີຈອງ~ວັນທີສິ້ນສຸດ</label>
              <DateRangePicker className="form-label" name="date" value={bookData.date} 
              onChange={(date) => handleDateSelect(date)}
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
              onChange={(value) => handleChange("note", value)}
                placeholder="textarea..."/>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  appearance="primary">
            {modalType === "add" ? "Next" : "Update"}
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
