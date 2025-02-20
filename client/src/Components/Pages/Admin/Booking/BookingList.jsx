import { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, Text} from "rsuite";
import { format } from "date-fns";
import { Config} from "../../../../config/connection";
import Detail from "./Details";
import BookingModal from './Modal';
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { maskEmail, maskPhone } from "../../../../util";

const Booking = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookData, setbookData] = useState({
    book_id: null,
    group_type: "",
    cust_id_fk: null,
    pay_fk: null,
    date: null,
    sv_fk: [],
    pk_fk: [],
    group_size: "",
    email: "",
    tell: "",
    note: "",

    pay_id: null,
    calculation: "",
    get_money: "",
    pay_date: null,
    detail: null,
  });

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
      date: null,
      cust_id_fk: null,
      pay_fk: null,
      sv_fk: [],
      pk_fk: [],
      group_size: "",
      email: "",
      tell: "",
      note:"",

      pay_id: null,
      calculation: "",
      get_money: "",
      pay_date: null,
      detail: null,
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

  const handleDateSearch = (value) => {
    setSearchDate(value);
  };

  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    alert(data.book_id)
    handleOpen();
    setbookData({
      book_id: data.book_id,
      date: new Date(data.date),
      cust_id_fk: data.cust_id_fk,
      pay_fk: data.pay_fk,
      sv_fk: data.sv_fk.map(id => Number(id)),
      pk_fk: data.pk_fk.map(id => Number(id)),
      group_size: data.group_size,
      email: data.email,
      tell: data.tell,
      note: data.note,

      pay_id: data.pay_id,
      calculation: data.calculation,
      get_money: data.get_money,
      pay_date: new Date(data.pay_date),
      detail: data.detail,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare booking data
    const bookingData = {
      book_id: bookData.book_id,
      cust_id_fk: bookData.cust_id_fk,
      pay_fk: bookData.pay_fk,
      date: bookData.date,
      sv_fk: bookData.sv_fk,
      pk_fk: bookData.pk_fk,
      group_size: bookData.group_size,
      email: bookData.email,
      tell: bookData.tell,
      note: bookData.note,
    };
  
    // Prepare payment data
    const paymentData = {
      pay_id: bookData.pay_id || null, // If pay_id is null, it will be auto-generated
      pay_date: new Date(bookData.pay_date),
      calculation: bookData.calculation,
      get_money: bookData.get_money,
    };
  
    try {
      // alert(`Payment Data: ${JSON.stringify(paymentData, null, 2)}`);
      const payResponse = await axios.post(`${api}/payment/create`, paymentData);
      alert(`Payment ${paymentData.pay_id  ? "updated" : "added"} successfully!`);
      const createdPay = payResponse.data;
      
      if (createdPay && createdPay.payment) {
        const pay_id = createdPay.payment[0] || paymentData.pay_id;
        bookingData.pay_fk = pay_id;
        const bookResponse = await axios.post(`${api}/booking/create`, bookingData);
        alert(`Payment and Booking ${bookData.book_id  ? "updated" : "added"} successfully!`);
        
        if (bookResponse.data && bookResponse.data.booking) {
          alert(`Payment and Booking ${bookData.book_id  ? "updated" : "added"} successfully!`);
          handleClose();
          fetchgetData()
        } else {
          throw new Error("Failed to create booking.");
        }
      } else {
        throw new Error("Failed to create payment.");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };  
  
  const handleDeleteClick = async (book_id, cust_id_fk) => {
    try {
      await axios.patch(`${api}/booking/${book_id}`, { cust_id_fk }); // Send cust_id_fk
      await axios.patch(`${api}/payment/${book_id}`); // Send cust_id_fk
      alert("Booking member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete booking", err);
    }
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
        <li className="breadcrumb-item"><a href="javascript:;">Home</a>
        </li><li className="breadcrumb-item"><a href="javascript:;">Page Options</a>
        </li><li className="breadcrumb-item active">booking</li>
      </ol>
      <h1 className="page-header"><small>header small text goes here...</small></h1>

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
          <div style={{ overflowX: 'auto', overflowY:'auto' }}>
          <table id="data-table-default" className="table table-striped table-bordered align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ປະເພດຈອງ</th>
                <th className="text-nowrap">ວັນນັດໝາຍ</th>
                <th className="text-nowrap">ຊື່ ແລະ ນາມສະກຸນ</th>
                <th className="text-nowrap">ບໍລິການທີເລຶອກ</th>
                <th className="text-nowrap">status</th>
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
                  <td>{format(new Date(booking.date), "dd-MM-yyyy")}
                    <Text>{format(new Date(booking.date), "HH:mm")}</Text>
                  </td>
                  <td>{booking.cust_name} {booking.cust_surname}
                  <Text muted>{maskEmail(booking.email)}</Text>
                  <Text muted>{maskPhone(booking.tell)}</Text>
                  </td>
                  <td> {booking.pk_names ? (booking.pk_names.split(',').map((name, index) => (
                        <span key={index}>🔹{name}<br /></span>))) : ""}
                  <Text>{booking.service_names ? ( booking.service_names.split(',').map((name, index) => (
                          <span key={index}>🔸{name}<br /></span>))) : ""}
                      </Text>
                    </td>
                  <td> { booking.pay_status === 2 ? (
                        <span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>paied</span>) 
                        : booking.pay_status === 1 ? (
                        <span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>deposit(ມັດຈຳ)</span>) 
                        : (
                        <span className="badge border border-danger text-danger px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>unpaied
                        </span>
                    )}</td>
                  <td>{booking.note}</td>
                  <td><div className="panel-heading">
                      <div className="btn-group my-n1">
                      <a href="javascript:;" className="dropdown-item" onClick={() => handleViewClick(booking)}>
                        <i className="fas fa-eye"></i>
                      </a>
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
          </div>
          <Pagination total={filteredData.length} length={length}
            currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      <Detail data={selectedBooking} open={!!selectedBooking} onClose={() => setSelectedBooking(null)}/>

      <BookingModal open={open} onClose={handleClose} modalType={modalType}
        bookData={bookData} setBookData={setbookData} handleSubmit={handleSubmit} />
    </div>
  );
};

export default Booking;
