/* eslint-disable react/prop-types */
import {useRef } from "react";
import { Modal, Button} from "rsuite";
import { format} from "date-fns";
import { printContent } from "../../../../PrintDoc";

const Detail = ({ data, open, onClose }) => {
  const printRef = useRef(null); // Ref for printable content

  const handlePrint = () => {
    const printContentHTML = printRef.current.innerHTML;
    printContent(printContentHTML)
  };

  if (!data) {
    return <p className="text-center text-gray-500 mt-4">No data available</p>;
  }

  return (
    <Modal open={open} onClose={onClose} size="sm" className="rounded-lg shadow-lg">
      <Modal.Header className="border-b border-gray-200 py-4">
        <Modal.Title className="text-center">ໃບບິນຈອງ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-gray-50 py-4 px-6">
        <div className="container mb-4" ref={printRef}>
          <div className="d-flex justify-content-center">
            <i className="fa-solid fa-spa"></i>
          </div>
          <div className="nav-wizards-container mt-4">
            <nav className="nav nav-wizards-2 mb-3">
              <div className="nav-item col"><h6 className="text-center">ວັນທີນັດໝາຍ</h6>
                <div className="nav-link">
                  <div className="nav-text">{format(new Date(data.date), "dd-MM-yyyy HH:mm")}</div>
                </div>
              </div>
            </nav>
          </div>
          {[
            { label: "ລະຫັດຈອງ :", value: data.book_code },
            { label: "ຈອງເປັນ :", value: `${data.group_type}(${data.group_size}ຄົນ)` },
            { label: "ຊື່ ແລະ ນາມສະກຸນ :", value: `(${data.cust_code}) ${data.cust_name} ${data.cust_surname}`},
            { label: "ເບີໂທ :", value: data.tell },
            { label: "ອີເມວ໌ :", value: data.email },
            { label: "ບໍລິການທີຈອງ :",  value: (
              <>
                {data.pk_names ? ( data.pk_names.split(',').map((name, index) => (
                  <span key={index}>🔹{name}<br /></span>))) : ""}
                {data.service_names ? (data.service_names.split(',').map((name, index) => (
                  <span key={index}>🔸{name}<br /></span>))) : ""}
              </>
          ) },
            { label: "ລາຄາທັງໝົດ :", value: data.calculation },
            { label: data.pay_status === 0 ? 'ຊຳລະ :' : 
              data.pay_status === 1 ? 'ມັດຈຳ :' :
              data.pay_status === 2 ? 'ຈ່າຍແລ້ວ :'
              : '', 
              value: data.get_money },
            { label: "ໝາຍເຫດ :", value: data.note },
          ].map((item, index) => (
            <div key={index} className="d-flex justify-content-between border-bottom py-2">
              <span className="fw-bold">{item.label}</span><span>{item.value}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100 py-3 px-6">
        <Button onClick={handlePrint} appearance="primary"
          className="bg-green-500 text-white hover:bg-green-600 transition-all">
          Print
        </Button>
        <Button onClick={onClose} appearance="subtle"
          className="bg-blue-500 text-white hover:bg-blue-600 transition-all">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Detail;
