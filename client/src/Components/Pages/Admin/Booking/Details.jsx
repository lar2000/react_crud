/* eslint-disable react/prop-types */
import { Modal, Button } from "rsuite";
import { format } from "date-fns";

// eslint-disable-next-line react/prop-types
const Detail = ({ data, show, onClose }) => {
  if (!data) {
    return <p className="text-center text-gray-500 mt-4">No data available</p>;
  }

  return (
    <Modal open={show} onClose={onClose} size="sm" className="rounded-lg shadow-lg">
      <Modal.Header className="border-b border-gray-200 py-4">
        <Modal.Title className="text-center">Booking Details</Modal.Title>
        <div className="d-flex justify-content-center mt-2"><i className="fa-solid fa-spa"></i></div>
      </Modal.Header>
      <Modal.Body className="bg-gray-50 py-4 px-6">
      <div className="nav-wizards-container">
        <nav className="nav nav-wizards-2 mb-3">
            <div className="nav-item col">
                <h6 className="text-center">ວັນທີຈອງ</h6>
            <div className="nav-link completed" href="javascript:;">
                <div className="nav-text">{format(new Date(data.date), "dd-MM-yyyy")}</div>
            </div>
            </div>
            <div className="nav-item col">
            <h6 className="text-center">ວັນທີສິ້ນສຸດ</h6>
            <div className="nav-link disabled" href="javascript:;"> 
                <div className="nav-text">{format(new Date(data.dateEnd), "dd-MM-yyyy")}</div>
            </div>
            </div>
        </nav>
        </div>
        <div className="container mb-4">
        {[
            { label: "ລະຫັດຈອງ :", value: data.book_code },
            { label: "ຈອງເປັນ :", value: `${data.group_type}(${data.group_size}ຄົນ)` },
            { label: "ລະຫັດລູກຄ້າ :", value: data.cust_code },
            { label: "ຊື່ ແລະ ນາມສະກຸນ :", value: `${data.cust_name} ${data.cust_surname}` },
            { label: "ເບີໂທ :", value: data.tell },
            { label: "ອີເມວ໌ :", value: data.email },
            { label: "ບໍລິການທີຈອງ :", value: data.service_name },
            { label: "ລາຄາທັງໝົດ :", value: data.total_price },
            { label: "ໝາຍເຫດ :", value: data.note },
        ].map((item, index) => (
            <div key={index} className="d-flex justify-content-between border-bottom py-2">
            <span className="fw-bold">{item.label}</span>
            <span>{item.value}</span>
            </div>
        ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 py-3 px-6">
        <Button
          onClick={onClose}
          appearance="subtle"
          className="bg-blue-500 text-white hover:bg-blue-600 transition-all"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Detail;
