
import { useService} from "../../../../config/selectOption";
const TypePackage = () => {
    const services = useService();
    return (
        <div className="pos pos-with-menu pos-with-sidebar" id="pos">

        <div className="pos-menu">
            <div className="nav-container">
                <div data-scrollbar="true" data-height="100%" data-skip-mobile="true">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" href="#" data-filter="all">
                                <div className="nav-icon"><i className="fa fa-fw fa-utensils"></i></div>
                                <div className="nav-text">All Dishes</div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="pos-content">
            <div className="pos-content-container h-100">
                <div className="product-row">
                    <div className="product-container" data-type="meat">
                        <a href="#" className="product" data-bs-toggle="modal" data-bs-target="#modalPos">
                            <div className="img" style="background-image: url(../assets/img/pos/product-1.jpg)"></div>
                            <div className="text">
                                <div className="title">Grill Chicken Chop&reg;</div>
                                <div className="desc">chicken, egg, mushroom, salad</div>
                                <div className="price">$10.99</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div className="pos-sidebar">
            <div className="h-100 d-flex flex-column p-0">
                <div className="pos-sidebar-header">
                    <div className="back-btn">
                        <button type="button" data-dismiss-className="pos-sidebar-mobile-toggled" data-target="#pos" className="btn border-0">
                            <i className="fa fa-chevron-left"></i>
                        </button>
                    </div>
                    <div className="icon"><i className="fa fa-plate-wheat"></i></div>
                    <div className="title">Table 01</div>
                    <div className="order">Order: <b>#0056</b></div>
                </div>
                <div className="pos-sidebar-nav">
                    <ul className="nav nav-tabs nav-fill">
                        <li className="nav-item">
                            <a className="nav-link active" href="#" data-bs-toggle="tab" data-bs-target="#newOrderTab">New Order (5)</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" data-bs-toggle="tab" data-bs-target="#orderHistoryTab">Order History (0)</a>
                        </li>
                    </ul>
                </div>
                <div className="pos-sidebar-body tab-content" data-scrollbar="true" data-height="100%">
                    <div className="tab-pane fade h-100 show active" id="newOrderTab">
                        <div className="pos-table">
                            <div className="row pos-table-row">
                                <div className="col-9">
                                    <div className="pos-product-thumb">
                                        <div className="img" style="background-image: url(../assets/img/pos/product-2.jpg)"></div>
                                        <div className="info">
                                            <div className="title">Grill Pork Chop</div>
                                            <div className="single-price">$12.99</div>
                                            <div className="desc">- size: large</div>
                                            <div className="input-group qty">
                                                <div className="input-group-append">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" className="form-control" value="01" />
                                                <div className="input-group-prepend">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 total-price">$12.99</div>
                            </div>
                            <div className="row pos-table-row">
                                <div className="col-9">
                                    <div className="pos-product-thumb">
                                        <div className="img" style="background-image: url(../assets/img/pos/product-8.jpg)"></div>
                                        <div className="info">
                                            <div className="title">Orange Juice</div>
                                            <div className="single-price">$5.00</div>
                                            <div className="desc">
                                                - size: large<br />
                                                - less ice
                                            </div>
                                            <div className="input-group qty">
                                                <div className="input-group-append">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" className="form-control" value="02" />
                                                <div className="input-group-prepend">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 total-price">$10.00</div>
                            </div>
                            <div className="row pos-table-row">
                                <div className="col-9">
                                    <div className="pos-product-thumb">
                                        <div className="img" style="background-image: url(../assets/img/pos/product-10.jpg)"></div>
                                        <div className="info">
                                            <div className="title">Mushroom Soup</div>
                                            <div className="single-price">$3.99</div>
                                            <div className="desc">
                                                - size: large<br />
                                                - more cheese
                                            </div>
                                            <div className="input-group qty">
                                                <div className="input-group-append">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-minus"></i></a>
                                                </div>
                                                <input type="text" className="form-control" value="01" />
                                                <div className="input-group-prepend">
                                                    <a href="#" className="btn btn-default"><i className="fa fa-plus"></i></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3 total-price">$3.99</div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade h-100" id="orderHistoryTab">
                        <div className="h-100 d-flex align-items-center justify-content-center text-center p-20">
                            <div>
                                <div className="mb-3 mt-n5">
                                </div>
                                <h4>No order history found</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pos-sidebar-footer">
                    <div className="d-flex align-items-center mb-2">
                        <div>Subtotal</div>
                        <div className="flex-1 text-end h6 mb-0">$30.98</div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div>Taxes (6%)</div>
                        <div className="flex-1 text-end h6 mb-0">$2.12</div>
                    </div>
                    <hr className="opacity-1 my-10px"/>
                    <div className="d-flex align-items-center mb-2">
                        <div>Total</div>
                        <div className="flex-1 text-end h4 mb-0">$33.10</div>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                        <a href="#" className="btn btn-default rounded-3 text-center me-10px w-70px"><i className="fa fa-bell d-block fs-18px my-1"></i> Service</a>
                        <a href="#" className="btn btn-default rounded-3 text-center me-10px w-70px"><i className="fa fa-receipt d-block fs-18px my-1"></i> Bill</a>
                        <a href="#" className="btn btn-theme rounded-3 text-center flex-1"><i className="fa fa-shopping-cart d-block fs-18px my-1"></i> Submit Order</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
};
export default TypePackage;