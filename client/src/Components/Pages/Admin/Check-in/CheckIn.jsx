import { useEffect, useState } from "react";
import axios from "axios";
import { differenceInDays, format } from 'date-fns';
import { Modal, Button, Input } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";
import SideCheck from './SideCheck'

const CheckIn = () => {
  const api = Config.ApiURL;
  const [getData, setBookingData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [isSelected, setIsSelected] = useState(false);

  const [CheckInData, setCheckInData] = useState({
	book_fk: null,
	date_checkin: "",
	date_checkout: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }
  const handleCheck = () => {
    handleOpen();
    setModalType("add");
  };

  const handleClick = (book_id) => {
    if (isSelected !== book_id) {  // Only update selection if the clicked table is different
      setIsSelected(book_id);
    }
    handleOpen();
  };
  

  const resetForm = () => {
    setCheckInData({
		book_fk: null,
		date_checkin: "",
		date_checkout: "",
    });
    setOpen(false);
  };

  useEffect(() => {
    fetchBookingData();
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
  
  const filteredData = getData.filter((CheckIn) => {
    const matchesSearch = CheckIn.book_code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  //const startIndex = (currentPage - 1) * length;
  //const paginatedData = filteredData.slice(startIndex, startIndex + length);

  return (
    
    <div id="content" className="app-content">
      <div className="panel panel-inverse">
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength}/>
            </div>
            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
                <a href="javarscript:;" className="btn btn-sm btn-success ms-2">
                  <i className="fas fa-user-plus"></i>
                </a>
              </div>
            </div>
          </div>
			<div className="pos pos-with-header pos-with-sidebar" id="pos">
				<div className="pos-content">
					<div className="pos-content-container">
						<div className="d-md-flex align-items-center mb-4">
							<div className="pos-booking-title flex-1">
								<div className="fs-24px mb-1">Check Table (13/20)</div>
								<div className="mb-2 mb-md-0 d-flex">
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-gray-500 fs-9px me-1"></i> Reserved
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-warning fs-9px me-1"></i> Table In-use
									</div>
									<div className="d-flex align-items-center me-3">
										<i className="fa fa-circle fa-fw text-theme fs-9px me-1"></i> Table Available
									</div>
								</div>
							</div>
						 </div>
						 <div className="pos-table-row">
              {getData.map((booking, index) => (
						  <div key={booking.book_id} 
              className={`pos-table in-use ${isSelected === booking.book_id ? "selected" : ""}`}
						  onClick={() => handleClick(booking.book_id)}>
							<a href="#" className="pos-table-container" data-toggle="select-table">
								<div className="pos-table-status"></div>
									<div className="pos-table-name">
										<div className="name">Table {index + 1}</div>
										<div className="no">{booking.book_code}</div>
										<div className="order"><span>{booking.group_size} ຄົນ</span></div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-list-check"></i></span>
												<span className="text">7 / {booking.duration}</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-calendar-check"></i></span>
												<span className="text">09:30</span>
											</div>
										</div>
									</div>
                  <div className="pos-table-info-col d-flex justify-content-center">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"></span>
												<span className="text">{format(new Date(booking.date), "dd-MM-yyyy")}</span>
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
              <SideCheck />
						</div>
					</div>
				</div>
			</div>
      <div className="d-flex justify-content-center mt-3">
        <Pagination total={filteredData.length} length={length}
          currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      <Modal size={"xs"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນປະເພດບໍລິການ" : "ແກ້ໄຂ ຂໍ້ມູນປະເພດບໍລິການ"}
          </Modal.Title>
        </Modal.Header>
        <form>
        <Modal.Body>
          
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit"  appearance="primary">
            {modalType === "add" ? "ບັນທຶກ" : "Update"}
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default CheckIn;
