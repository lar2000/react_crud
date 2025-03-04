import { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import {Text, DatePicker, Dropdown} from "rsuite";
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import { useServiceType} from "../../../../config/selectOption";

const CheckIn = () => {
  const api = Config.ApiURL;
  const [getBookData, setBookingData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [getCheckInData, setCheckInData] = useState({
	book_fk: null,
	date_checkin: "",
	date_checkout: "",
  status: null,
  });
 const servicesType = useServiceType();

  const handleClick = (book_id) => {
    if (isSelected !== book_id) {  // Only update selection if the clicked table is different
      setIsSelected(book_id);
      const booking = getBookData.find((b) => b.book_id === book_id);
      setSelectedBooking(booking || null);
  }
};
const handleAddClick = () => {
  // handleOpen();
  // setModalType("add");
};

  useEffect(() => {
    fetchBookingData();
    fetchCheckInData();
  }, []);
  // Fetch booking data
  const fetchBookingData = async () => {
    try {
      const res = await axios.get(`${api}/booking`);
      setBookingData(res.data);
    } catch (err) {
      console.error("Failed to fetch booking data", err);
    }
  };
  const fetchCheckInData = async () => {
    try {
      const res = await axios.get(`${api}/checkin`);
      setCheckInData(res.data);
    } catch (err) {
      console.error("Failed to fetch CheckInData data", err);
    }
  };

  const getDaysAgo = (date) => {
    if (!date) return "N/A";
    const days = Math.floor((new Date() - new Date(date)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days === 365) return "One year ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };
  
  const filteredData = getBookData.filter((booking) => {
    const matchesSearch = booking.book_code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const startIndex = (currentPage - 1) * length;
  const paginatedData = filteredData.slice(startIndex, startIndex + length);

  const getCheckInIndex = (book_fk) => {
    const count = getCheckInData.filter((checkIn) => checkIn.book_fk === book_fk).length;
    return count > 0 ? count : "0";
  };

  const getLatestTime = (book_fk, timeType) => { 
    const checkIn = getCheckInData.filter((checkIn) => checkIn.book_fk === book_fk);
    
    if (checkIn.length > 0) {
      const latestEntry = checkIn.sort((a, b) => new Date(b[timeType]) - new Date(a[timeType]))[0];
      const latestTime = new Date(latestEntry[timeType]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return latestTime;
    } else {
      return "00:00";
    }
  };

  const getCheckInTimeLatest = (book_fk) => {
    return getLatestTime(book_fk, 'date_checkin');
  };

  const getCheckOutTimeLatest = (book_fk) => {
    return getLatestTime(book_fk, 'date_checkout');
  };
  
  return (
    <div id="content" className="app-content p-0">
    <div className="pos pos-with-sidebar" id="pos">
      <div className="pos-content">
      <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto ms-4">
              <Length setLength={setLength}/>
              <div className="actions mb-2 ms-2">
                <select className="form-select form-select-sm" value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">ທັງໝົດ</option>
                  <option value="0">ນວດ</option>
                  <option value="1">ຄວາມງາມ</option>
                  <option value="2">ບຳບັດ</option>
                  <option value="ໂ">ສະປາເລັບ</option>
                </select>
              </div>
              <div className="d-md-flex align-items-center ms-4">
							<div className="pos-booking-title flex-1">
								<div className="mb-2 mb-md-0 d-flex">
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-gray-500 fs-9px me-1"></i> ລໍຖ້າ
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> ກຳລັງດຳເນີນການ
									</div>
								</div>
							</div>
						 </div>
            </div>
            <div className="d-md-flex justify-content-between align-items-end dt-layout-end col-md-auto me-3">
                <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
                <a href="javarscript:;" className="btn btn-sm btn-success ms-2"
                  onClick={handleAddClick}> <i className="fas fa-plus"></i>
                </a>
              </div>
            </div>
          </div>
        <div className="pos-content-container h-100">
          <div className="pos-table-row">
          {paginatedData.map((booking, index) => (
						  <div key={booking.book_id} 
              className={`pos-table in-use ${isSelected === booking.book_id ? "selected" : ""}`}
						  onClick={() => handleClick(booking.book_id)}>
							<a href="javascript:;" className="pos-table-container" data-toggle="select-table">
                <div className={`pos-table-status ${getCheckInIndex(booking.book_id) < 1 ? "" 
                  : getCheckInIndex(booking.book_id) === booking.duration ? "success" : "warning"}`}>
                </div>
									<div className="pos-table-name">
										<div className="name">Table {index + 1}</div>
										<div className="no">{booking.book_code}</div>
										{/* <div className="no">{checkin.date_checkin}</div> */}
										<div className="order"><span>{booking.group_size} ຄົນ</span></div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-list-check"></i></span>
												<span className="text">{getCheckInIndex(booking.book_id)} / {booking.duration}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-clock"></i></span>
												<span className="text">09:30</span>
											</div>
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-clock"></i></span>
												<span className="text">11:20</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-clipboard-check"></i></span>
												<span className="text">11:20</span>
											</div>
										</div>
									</div>
								</a>
							</div>
              ))}
							</div>
        </div>
      </div>
      {/* <!-- END pos-content -->
      
      <!-- BEGIN pos-sidebar --> */}
       <div className="pos-sidebar">
                {selectedBooking ? (
                  <>
                    <div className="pos-sidebar-header p-top-5">
                      <div className="icon"><i className="fa fa-spa"></i></div>
                      <div className="title">{selectedBooking.book_code}</div>
                        <Dropdown noCaret title={<i className="fas fa-ellipsis"></i>}
                         placement="bottomEnd">
                          <Dropdown.Item>ເພີ່ມ</Dropdown.Item>
                          <Dropdown.Item>ແກ້ໄຂ</Dropdown.Item>
                        </Dropdown>
                    </div>
                    <div className="pos-sidebar-body">
                  <div className="pos-table" data-id="pos-table-info">
                  {getCheckInData.filter((checkIn) => checkIn.book_fk === selectedBooking.book_id).length > 0 ? (
                    getCheckInData
                      .filter((checkIn) => checkIn.book_fk === selectedBooking.book_id)
                      .map((checkIn, index) => (
                        <div key={index} className="row pos-table-row">
                          <div className="col-8">
                            <div className="pos-product-thumb">
                              <div className="info">
                                <Text weight="bold" size="lg">{checkIn.pk_name || "ບໍມີຂໍ້ມູນ"}</Text>
                                <Text weight="regular" size="lg">{checkIn.cust_name} {checkIn.cust_surname || "ບໍມີຂໍ້ມູນ"}</Text>
                                <Text weight="regular" size="Small">ວັນທີ: 
                                  {format(new Date(checkIn.date_checkin), "  dd-MM-yyyy")} ~ {format(new Date(checkIn.date_checkout), "dd-MM-yyyy") || "N/A"}
                                </Text>
                                <Text weight="regular" size="Small">ເວລາ: 
                                  {format(new Date(checkIn.date_checkin), "  HH:mm")} ~ {format(new Date(checkIn.date_checkout), "HH:mm") || "N/A"}
                                </Text>
                              </div>
                            </div>
                          </div>
                          <div className="col-4 total-qty">
                            <Text color="blue" weight="semibold" size='Small'>({getDaysAgo(checkIn.date_checkin)})</Text>
                          </div>
                        </div>
                      ))) : (
                    <div className="text-center text-muted py-3">
                      <i className="fa fa-exclamation-circle"></i> No Check-Ins Found
                    </div>
                  )}
                  </div>
                </div>
                    <div className="pos-sidebar-footer">
                      <div className="d-flex align-items-center mb-2">
                        <div>ວັນ~ເວລາ</div>
                        <div className="flex-1 text-end h6 mb-0">
                          <DatePicker placement="autoVerticalEnd" style={{ width: "78%"}} 
                          format="MM/dd/yyyy hh:mm aa" showMeridiem /></div>
                      </div>
                        <hr className="opacity-1 my-10px"></hr>
                        <div className="d-flex align-items-center mb-2">
                          <div>ຈຳນວນ</div>
                          <div className="flex-1 text-end h4 mb-0">
                          {getCheckInIndex(selectedBooking.book_id)} / {selectedBooking.duration}
                            </div>
                        </div>
                        <div className="d-flex align-items-center mt-3">
                          <a href="javascript:;" className="btn btn-default rounded-3 text-center me-10px">
                             Check In
                          </a>
                      <a href="javascript:;" className="btn btn-default rounded-3 text-center me-10px">
                        Check Out
                      </a>
                      <a href="javascript:;" className="btn btn-theme rounded-3 text-center flex-1">
                        Done
                      </a>
                    </div>
                  </div>
                  </>
                ) : (
                  <div className="pos-sidebar-header">
                    <div className="title">Select a Table</div>
                  </div>
                )}
              </div>
           </div>
        </div>
  );
};

export default CheckIn;
