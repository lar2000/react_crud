const SideCheck = () => {
    return (
        <div className="pos-sidebar">
            <div className="pos-sidebar-header">
			    <div className="back-btn">
					<button type="button" data-dismiss-className="pos-sidebar-mobile-toggled" data-target="#pos" className="btn">
						<i className="fa fa-chevron-left"></i>
					</button>
				</div>
					<div className="icon"><i className="fa fa-spa"></i></div>
					<div className="title">Table 01</div>
					<div className="order">Booking: <b>B-5002</b></div>
			</div>
            <div className="pos-sidebar-body">
               <div className="pos-table" data-id="pos-table-info">
                   <div className="row pos-table-row">
                       <div className="col-8">
							<div className="pos-product-thumb">
                            <div className=""></div>
								<div className="info">
									<div className="title">Grill Pork Chop</div>
									<div className="desc">size: large</div>
									<div className="desc">size: large</div>
								</div>
							</div>
						</div>
							<div className="col-1 total-qty">x1</div>
							<div className="col-3 total-price">$12.99</div>
                    </div>
                </div>
            </div>
        </div>
		
    )
}

export default SideCheck