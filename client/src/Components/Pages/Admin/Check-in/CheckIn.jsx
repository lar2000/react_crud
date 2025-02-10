import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input } from "rsuite";
//import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config} from "../../../../config/connection";

const ServiceType = () => {
  const api = Config.ApiURL;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit

  const [serviceTypeData, setserviceTypeData] = useState({
    servicetype_id: null,
    servicetype_name: "",
    detail: "",
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    try {
      const res = await axios.get(`${api}/service_type`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch service_type data", err);
    }
  };
  const resetForm = () => {
    setserviceTypeData({
      servicetype_id: null,
      servicetype_name: "",
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
    setserviceTypeData({
      servicetype_id: data.servicetype_id,
      servicetype_name: data.servicetype_name,
      detail: data.detail,
    });
  };

  const handleChange = (name, value) => {
    setserviceTypeData({
      ...serviceTypeData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(serviceTypeData)
        await axios.post(`${api}/service_type/create`, serviceTypeData);
        alert(`service_type ${serviceTypeData._id ? "updated" : "added"} successfully!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit service_type data", err);
    }
  };
  const handleDeleteClick = async (servicetype_id) => {
    try {
      await axios.delete(`${api}/service_type/${servicetype_id}`);
      alert("service_type member soft deleted successfully!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete service_type", err);
    }
  };
  
  const filteredData = getData.filter((service_type) => {
    const matchesSearch =
      service_type.servicetype_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service_type.servicetype_name.toLowerCase().includes(searchTerm.toLowerCase());

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
        <li className="breadcrumb-item active">service_type</li>
      </ol>
      <h1 className="page-header">
        Manage service_type <small>header small text goes here...</small>
      </h1>

      <div className="panel panel-inverse">
        <div className="panel-heading">
          <h4 className="panel-title">service_type Panel</h4>
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

		
			<div className="pos pos-with-header pos-with-sidebar" id="pos">
		
				<div className="pos-header">
					<div className="logo">
						<a href="index.html">
							<div className="logo-img"><i className="fa fa-bowl-rice fs-2"></i></div>
							<div className="logo-text">Pine &amp; Dine</div>
						</a>
					</div>
					<div className="time" id="time">4:58pm</div>
					<div className="nav">
						<div className="nav-item">
							<a href="pos_counter_checkout.html" className="nav-link">
								<i className="far fa-credit-card nav-icon"></i>
							</a>
						</div>
						<div className="nav-item">
							<a href="pos_kitchen_order.html" className="nav-link">
								<i className="far fa-clock nav-icon"></i>
							</a>
						</div>
						<div className="nav-item">
							<a href="pos_table_booking.html" className="nav-link">
								<i className="far fa-calendar-check nav-icon"></i>
							</a>
						</div>
						<div className="nav-item">
							<a href="pos_menu_stock.html" className="nav-link">
								<i className="fa fa-chart-pie nav-icon"></i>
							</a>
						</div>
					</div>
				</div>

				<div className="pos-content">
					<div className="pos-content-container">
						<div className="d-md-flex align-items-center mb-4">
							<div className="pos-booking-title flex-1">
								<div className="fs-24px mb-1">Available Table (13/20)</div>
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
							<div className="pos-table in-use selected">
								<a href="#" className="pos-table-container" data-toggle="select-table">
									<div className="pos-table-status"></div>
									<div className="pos-table-name">
										<div className="name">Booking</div>
										<div className="no">1</div>
										<div className="order"><span>9 orders</span></div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-user"></i></span>
												<span className="text">4 / 4</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-clock"></i></span>
												<span className="text">35:20</span>
											</div>
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-receipt"></i></span>
												<span className="text">$318.20</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-dollar-sign"></i></span>
												<span className="text">Unpaid</span>
											</div>
										</div>
									</div>
								</a>
							</div>
							<div className="pos-table in-use">
								<a href="#" className="pos-table-container" data-toggle="select-table">
									<div className="pos-table-status"></div>
									<div className="pos-table-name">
										<div className="name">Booking</div>
										<div className="no">2</div>
										<div className="order"><span>12 orders</span></div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-user"></i></span>
												<span className="text">6 / 8</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-clock"></i></span>
												<span className="text">12:69</span>
											</div>
										</div>
									</div>
									<div className="pos-table-info-row">
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="fa fa-receipt"></i></span>
												<span className="text">$682.20</span>
											</div>
										</div>
										<div className="pos-table-info-col">
											<div className="pos-table-info-container">
												<span className="icon opacity-50"><i className="far fa-dollar-sign"></i></span>
												<span className="text">Unpaid</span>
											</div>
										</div>
									</div>
								</a>
							</div>
							
						</div>
					</div>
				</div>
				{/* <div className="pos-sidebar">
					<div className="pos-sidebar-header">
						<div className="back-btn">
							<button type="button" data-dismiss-className="pos-sidebar-mobile-toggled" data-target="#pos" className="btn">
								<i className="fa fa-chevron-left"></i>
							</button>
						</div>
						<div className="icon"><i className="fa fa-plate-wheat"></i></div>
						<div className="title">Table 01</div>
						<div className="order">Order: <b>#0001</b></div>
					</div>
					<div className="pos-sidebar-body">
						<div className="pos-table" data-id="pos-table-info">
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-2.jpg)"></div>
										<div className="info">
											<div className="title">Grill Pork Chop</div>
											<div className="desc">- size: large</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$12.99</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-8.jpg)"></div>
										<div className="info">
											<div className="title">Orange Juice</div>
											<div className="desc">
												- size: large<br/>
												- less ice
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x2</div>
								<div className="col-3 total-price">$10.00</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-13.jpg)"></div>
										<div className="info">
											<div className="title">Vanilla Ice-cream</div>
											<div className="desc">
												- scoop: 1 <br/>
												- flavour: vanilla
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$3.99</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-1.jpg)"></div>
										<div className="info">
											<div className="title">Grill chicken chop</div>
											<div className="desc">
												- size: large<br/>
												- spicy: medium
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$10.99</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-10.jpg)"></div>
										<div className="info">
											<div className="title">Mushroom Soup</div>
											<div className="desc">
												- size: large<br/>
												- more cheese
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$3.99</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-5.jpg)"></div>
										<div className="info">
											<div className="title">Hawaiian Pizza</div>
											<div className="desc">
												- size: large<br/>
												- more onion
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$15.00</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-15.jpg)"></div>
										<div className="info">
											<div className="title">Perfect Yeast Doughnuts</div>
											<div className="desc">
												- size: 1 set<br/>
												- flavour: random
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$2.99</div>
							</div>
							<div className="row pos-table-row">
								<div className="col-8">
									<div className="pos-product-thumb">
										<div className="img" style="background-image: url(../assets/img/pos/product-14.jpg)"></div>
										<div className="info">
											<div className="title">Macarons</div>
											<div className="desc">
												- size: 1 set<br/>
												- flavour: random
											</div>
										</div>
									</div>
								</div>
								<div className="col-1 total-qty">x1</div>
								<div className="col-3 total-price">$4.99</div>
							</div>
						</div>
					</div>
					<div className="pos-sidebar-footer">
						<div className="d-flex align-items-center mb-2">
							<div>Subtotal</div>
							<div className="flex-1 text-end h6 mb-0">$64.94</div>
						</div>
						<div className="d-flex align-items-center">
							<div>Taxes (6%)</div>
							<div className="flex-1 text-end h6 mb-0">$3.90</div>
						</div>
						<hr className="opacity-1 my-10px"/>
						<div className="d-flex align-items-center mb-2">
							<div>Total</div>
							<div className="flex-1 text-end h4 mb-0">$68.84</div>
						</div>
						<div className="d-flex align-items-center mt-3">
							<a href="#" className="btn btn-default w-80px rounded-3 text-center me-10px">
								<i className="fab fa-paypal d-block fs-18px my-1"></i>
								E-Wallet
							</a>
							<a href="#" className="btn btn-default w-80px rounded-3 text-center me-10px">
								<i className="fab fa-cc-visa d-block fs-18px my-1"></i>
								CC
							</a>
							<a href="#" className="btn btn-theme rounded-3 text-center flex-1">
								<i className="fa fa-wallet d-block fs-18px my-1"></i>
								Pay by Cash
							</a>
						</div>
					</div>
				</div> */}
			</div>
          {/* <table id="data-table-default" className="table table-striped table-bordered align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ປະເພດບໍລິການ</th>
                <th className="text-nowrap">ລາຍລະອຽດ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((service_type, index) => (
                <tr key={service_type.servicetype_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{service_type.servicetype_code}</td>
                  <td>{service_type.servicetype_name}</td>
                  <td>{service_type.detail}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a href="javascript:;" className="dropdown-item"
                            onClick={() => handleEditClick(service_type)}><i className="fas fa-pen-to-square"></i>
                             Edit</a>
                          <a href="javascript:;" className="dropdown-item"
                          onClick={() => handleDeleteClick(service_type.servicetype_id)}>
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
          </table> */}

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
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນປະເພດບໍລິການ" : "ແກ້ໄຂ ຂໍ້ມູນປະເພດບໍລິການ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">ຊື່ປະເພດບໍລິການ</label>
              <Input className="form-label" name="name" value={serviceTypeData.servicetype_name} onChange={(value) => handleChange("servicetype_name", value)}
              placeholder="ຊື່ປະເພດບໍລິການ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ລາຍລະອຽດ</label>
              <Input as="textarea" rows={3} name="textarea" className="form-label" value={serviceTypeData.detail} onChange={(value) => handleChange("detail", value)}
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

export default ServiceType;
