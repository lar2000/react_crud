import { Link } from "react-router-dom";
const MenuSide = () => {
    return (
        <>
            <div id="sidebar" className="app-sidebar" data-bs-theme="dark">
                {/* BEGIN scrollbar */}
                <div className="app-sidebar-content" data-scrollbar="true" data-height="100%">
                    {/* BEGIN menu */}
                    <div className="menu">
                        <div className="menu-profile">
                            <a href="javascript:;" className="menu-profile-link" data-toggle="app-sidebar-profile" data-target="#appSidebarProfileMenu">
                                <div className="menu-profile-cover with-shadow"></div>
                                <div className="menu-profile-image">
                                    <img src="../assets/img/user/user-13.jpg" alt="" />
                                </div>
                                <div className="menu-profile-info">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1">
                                            Sean Ngu
                                        </div>
                                        <div className="menu-caret ms-auto"></div>
                                    </div>
                                    <small>Frontend developer</small>
                                </div>
                            </a>
                        </div>
                        <div id="appSidebarProfileMenu" className="collapse">
                            <div className="menu-item pt-5px">
                                <a href="javascript:;" className="menu-link">
                                    <div className="menu-icon"><i className="fa fa-cog"></i></div>
                                    <div className="menu-text">Settings</div>
                                </a>
                            </div>
                            <div className="menu-item">
                                <a href="javascript:;" className="menu-link">
                                    <div className="menu-icon"><i className="fa fa-pencil-alt"></i></div>
                                    <div className="menu-text">Send Feedback</div>
                                </a>
                            </div>
                            <div className="menu-item pb-5px">
                                <a href="javascript:;" className="menu-link">
                                    <div className="menu-icon"><i className="fa fa-question-circle"></i></div>
                                    <div className="menu-text">Helps</div>
                                </a>
                            </div>
                            <div className="menu-divider m-0"></div>
                        </div>
                        <div className="menu-header">ເມນູ</div>
                        <div className="menu-item fs-5">
					<Link to="/" className="menu-link">
					<div className="menu-icon">
					<i className="fas fa-qrcode"></i>
					</div>
					<div className="menu-text">ໜ້າຫຼັກ</div>
					</Link>
					</div>
					<div className="menu-item fs-5">
					 <a href="javascript:;" className="menu-link">
					 <div className="menu-icon">
					 <i className="fas fa-bookmark"></i>
					 </div>
					 <div className="menu-text">ຈອງບໍລິການ</div>
					 </a>
					 </div>
					 <div className="menu-item fs-5">
					 <a href="javascript:;" className="menu-link">
					 <div className="menu-icon">
					 <i className="fas fa-bed"></i>
					 </div>
					 <div className="menu-text">ເຂົ້າໃຊ້ບໍລິການ</div>
					 </a>
					 </div>
					 <div className="menu-item has-sub fs-5">
						<a href="javascript:void(0);" className="menu-link">
							<div className="menu-icon"><i className="fa-solid fa-star"></i></div>
							<div className="menu-text">ບໍລິການ</div>
							<div className="menu-caret"></div>
						</a>
						<div className="menu-submenu fs-14px">
							<div className="menu-item">
								<a href="javascript:;" className="menu-link"><div className="menu-text">ປະເພດບໍລິການ</div></a>
							</div>
							<div className="menu-item">
								<a href="javascript:;" className="menu-link"><div className="menu-text">ລາຍການບໍລິການ</div></a>
							</div>
						</div>
					</div>
					<div className="menu-item has-sub fs-5">
						<a href="javascript:void(0);" className="menu-link">
							<div className="menu-icon"><i className="fa-solid fa-file-lines"></i></div>
							<div className="menu-text">ລາຍງານ</div>
							<div className="menu-caret"></div>
						</a>
						<div className="menu-submenu fs-14px">
							<div className="menu-item">
								<a href="javascript:;" className="menu-link"><div className="menu-text">ລາຍງານການຂາຍ</div></a>
							</div>
							<div className="menu-item">
								<a href="javascript:;" className="menu-link"><div className="menu-text">ລາຍງານນຳເຂົ້າ</div></a>
							</div>
							<div className="menu-item">
								<a href="javascript:;" className="menu-link"><div className="menu-text">ລາຍງານການສັ່ງຊື້</div></a>
							</div>
						</div>
					</div>
					<div className="menu-item has-sub fs-5">
						<a href="javascript:void(0);" className="menu-link">
							<div className="menu-icon"><i className="fa-solid fa-gears"></i></div>
							<div className="menu-text">ການຕັ້ງຄ່າ</div>
							<div className="menu-caret"></div>
						</a>
						<div className="menu-submenu fs-14px">
							<div className="menu-item has-sub fs-14px">
								<a href="javascript:;" className="menu-link">
									<div className="menu-text">ສະຕ໋ອກສິນຄ້າ</div>
									<div className="menu-caret"></div>
								</a>
								<div className="menu-submenu">
									<div className="menu-item">
										<a href="javascript:;" className="menu-link">
										   <div className="menu-text">ນຳເຂົ້າສິນຄ້າ</div></a></div>
									<div className="menu-item">
										<Link to="/product" className="menu-link">
										   <div className="menu-text">ສິນຄ້າ</div></Link></div>
									<div className="menu-item">
										<a href="javascript:;" className="menu-link">
										   <div className="menu-text">ເຊັດສິນຄ້າ</div>
                                        </a>
                                    </div>
								</div>
							</div>
							<div className="menu-item">
								<Link to="/staff" className="menu-link">
                                    <div className="menu-text">ພະນັກງານ</div>
                                    </Link>
							</div>
							<div className="menu-item">
								<Link to="/customer" className="menu-link">
                                    <div className="menu-text">ລູກຄ້າ</div></Link>
							</div>
						</div>
					</div>
                        {/* BEGIN minify-button */}
                        <div className="menu-item d-flex">
                            <a href="javascript:;" className="app-sidebar-minify-btn ms-auto d-flex align-items-center text-decoration-none" data-toggle="app-sidebar-minify"><i className="fa fa-angle-double-left"></i></a>
                        </div>
                        {/* END minify-button */}
                    </div>
                    {/* END menu */}
                </div>
                {/* END scrollbar */}
            </div>
            <div className="app-sidebar-bg" data-bs-theme="dark"></div>
            <div className="app-sidebar-mobile-backdrop"><a href="#" data-dismiss="app-sidebar-mobile" className="stretched-link"></a></div>
        </>
    );
};

export default MenuSide;
