/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Steps, Panel, Input, SelectPicker, DatePicker, DateRangePicker } from 'rsuite';
import { useService, useCustomer } from "../../../../config/selectOption";

const BookingModal = ({ open, onClose, modalType, bookData, setBookData, handleSubmit }) => {
  const services = useService();
  const customers = useCustomer();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (modalType === 'add') {
      setStep(0); // Reset to step 0 when "Add New" is clicked
    }
  }, [modalType, open]); // This ensures that step resets when the modal opens

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onNext = () => onChange(step + 1);
  const onPrevious = () => onChange(step - 1);

  const handleSelectChange = (event, field) => {
    setBookData({
      ...bookData,
      [field]: event,
    });
  };

  return (
    <Modal size={"md"} open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title className="title text-center">
          {modalType === "add" ? "Add Booking" : "Edit Booking"}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div>
            <Steps current={step}>
              <Steps.Item title="Booking Details" />
              <Steps.Item title="Payment Details" />
              <Steps.Item title="Invoice" />
              <Steps.Item title="Completed" />
            </Steps>
            <hr />
            {step === 0 && (
              <Panel>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">ຈຳນວນ</label>
                    <Input className="form-label" name="amount" value={bookData.group_size}
                      onChange={(value) => setBookData({ ...bookData, group_size: value.replace(/[^0-9]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ວັນທີຈອງ~ວັນທີສິ້ນສຸດ</label>
                    <DateRangePicker className="form-label" name="date"
                      value={bookData.date} onChange={(date) => setBookData({ ...bookData, date })}
                      required style={{ width: "100%" }} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ເລຶອກບໍລິການ</label>
                    <SelectPicker className="form-label" data={services}
                      value={bookData.service_id_fk}
                      onChange={(value) => handleSelectChange(value, "service_id_fk")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ຊື່ ແລະ ນາມລະກຸນ</label>
                    <SelectPicker className="form-label" data={customers}
                      value={bookData.cust_id_fk}
                      onChange={(value) => handleSelectChange(value, "cust_id_fk")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <Input className="form-label" name="email"
                      value={bookData.email}
                      onChange={(value) => setBookData({ ...bookData, email: value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <Input className="form-label" name="tell" value={bookData.tell}
                      onChange={(value) => setBookData({ ...bookData, tell: value.replace(/[^0-9]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Notes</label>
                    <Input as="textarea" rows={3} name="textarea"
                      className="form-label" value={bookData.note}
                      onChange={(value) => setBookData({ ...bookData, note: value })} />
                  </div>
                </div>
              </Panel>
            )}
            {step === 1 && (
              <Panel>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Payment Method</label>
                    <SelectPicker className="form-label" data={[{ label: 'Credit Card', value: 'credit_card' }, { label: 'Cash', value: 'cash' }, { label: 'Bank Transfer', value: 'bank_transfer' }]}
                      value={bookData.payment_method}
                      onChange={(value) => handleSelectChange(value, "payment_method")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Amount Paid</label>
                    <Input className="form-label" name="amount_paid"
                      value={bookData.amount_paid}
                      onChange={(value) => setBookData({ ...bookData, amount_paid: value.replace(/[^0-9.]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Payment Date</label>
                    <DatePicker className="form-label" name="payment_date"
                      value={bookData.payment_date} onChange={(date) => setBookData({ ...bookData, payment_date: date })}
                      required style={{ width: "100%" }} />
                  </div>
                </div>
              </Panel>
            )}
            {step === 2 && (
              <Panel>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Bill Method</label>
                    <SelectPicker className="form-label" data={[{ label: 'Credit Card', value: 'credit_card' }, { label: 'Cash', value: 'cash' }, { label: 'Bank Transfer', value: 'bank_transfer' }]}
                      value={bookData.payment_method}
                      onChange={(value) => handleSelectChange(value, "payment_method")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Amount Paid</label>
                    <Input className="form-label" name="amount_paid"
                      value={bookData.amount_paid}
                      onChange={(value) => setBookData({ ...bookData, amount_paid: value.replace(/[^0-9.]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Payment Date</label>
                    <DatePicker className="form-label" name="payment_date"
                      value={bookData.payment_date} onChange={(date) => setBookData({ ...bookData, payment_date: date })}
                      required style={{ width: "100%" }} />
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onPrevious} disabled={step === 0}>Previous</Button>
          <Button onClick={onNext} disabled={step === 3}>Next</Button>
          <Button type="submit" appearance="primary">
            {modalType === "add" ? "Book Now" : "Update"}
          </Button>
          <Button onClick={onClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookingModal;
