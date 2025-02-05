/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Modal, Button, Progress } from "rsuite";
import { format, differenceInMinutes, isSameDay } from "date-fns";

const Detail = ({ data, show, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const printRef = useRef(null); // Ref for printable content

  useEffect(() => {
    if (data) {
      const startDate = new Date(data.date);
      const endDate = new Date(data.dateEnd);
      const currentTime = new Date();

      let totalMinutes;
      if (isSameDay(startDate, endDate)) {
        totalMinutes = 24 * 60;
      } else {
        totalMinutes = differenceInMinutes(endDate, startDate) + 24 * 60;
      }

      const elapsedMinutes = differenceInMinutes(currentTime, startDate);
      const remainingMinutes = Math.max(totalMinutes - elapsedMinutes, 0);
      const percentage = Math.round((elapsedMinutes / totalMinutes) * 100, 100);
      setProgress(percentage);

      const remainingDays = Math.floor(remainingMinutes / (24 * 60));
      const remainingHours = Math.floor((remainingMinutes % (24 * 60)) / 60);
      const remainingMins = remainingMinutes % 60;

      setRemainingTime(
        `${remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? "s" : ""} ` : ""}`
        + `${String(remainingHours).padStart(2, "0")} h : ${String(remainingMins).padStart(2, "0")} mm`
      );
    }
  }, [data]);

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Booking Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: auto; }
          .d-flex { display: flex; justify-content: space-between; padding: 8px 0; }
          .fw-bold { font-weight: bold; }
          .border-bottom { border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          ${printContent}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!data) {
    return <p className="text-center text-gray-500 mt-4">No data available</p>;
  }

  return (
    <Modal open={show} onClose={onClose} size="sm" className="rounded-lg shadow-lg">
      <Modal.Header className="border-b border-gray-200 py-4">
        <Modal.Title className="text-center">ໃບບິນຈອງ</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-gray-50 py-4 px-6">
        <div className="progress-container mb-4">
          <h6 className="text-center">Remaining Time: {remainingTime}</h6>
          <Progress.Line
            percent={progress}
            showInfo={true}
            format={() => remainingTime}
            strokeColor={progress < 20 ? "#ff9800" : "#4caf50"}
          />
        </div>
        <div className="container mb-4" ref={printRef}>
          <div className="d-flex justify-content-center">
            <i className="fa-solid fa-spa"></i>
          </div>
          <div className="nav-wizards-container mt-4">
            <nav className="nav nav-wizards-2 mb-3">
              <div className="nav-item col">
                <h6 className="text-center">ວັນທີຈອງ</h6>
                <div className="nav-link">
                  <div className="nav-text">{format(new Date(data.date), "dd-MM-yyyy")}</div>
                </div>
              </div>
              <div className="nav-item col">
                <h6 className="text-center">ວັນທີສິ້ນສຸດ</h6>
                <div className="nav-link">
                  <div className="nav-text">{format(new Date(data.dateEnd), "dd-MM-yyyy")}</div>
                </div>
              </div>
            </nav>
          </div>
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
          onClick={handlePrint}
          appearance="primary"
          className="bg-green-500 text-white hover:bg-green-600 transition-all"
        >
          Print
        </Button>
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
