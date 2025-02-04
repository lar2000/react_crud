/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Steps, Panel, Input, SelectPicker, DatePicker, DateRangePicker } from 'rsuite';
import { useService, useCustomer, usePayType } from "../../../../config/selectOption";

const BookingModal = ({ open, onClose, modalType, bookData, setBookData, handleSubmit }) => {
  const services = useService();
  const customers = useCustomer();
  const payTypes = usePayType();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (modalType === 'add') {
      setStep(0); // Reset to step 0 when "Add New" is clicked
    }
  }, [modalType, open]); // This ensures that step resets when the modal opens

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };

  const onPrevious = () => onChange(step - 1);
  
  const onNext = () => {
    const isValid = step === 0 
      ? bookData.group_size && bookData.date && bookData.service_id_fk && bookData.cust_id_fk && bookData.tell
      : step === 1
      ? bookData.paytype_id_fk && bookData.total_price && bookData.pay_date && 
        (bookData.paytype_id_fk !== 3 && bookData.paytype_id_fk !== 4 || 
          (bookData.cvv && bookData.expiry_date && bookData.card_number))
      : step === 2
      ? bookData.payment_method && bookData.amount_paid && bookData.payment_date
      : true;

    if (isValid) onChange(step + 1);
    else alert("Please fill in all required fields.");
  };

  const handleSelectChange = (event, field) => {
    setBookData({
      ...bookData,
      [field]: event,
    });
  };

  const isNextDisabled = !(step === 0 
      ? bookData.group_size && bookData.date && bookData.service_id_fk && bookData.cust_id_fk && bookData.tell
      : step === 1
      ? bookData.paytype_id_fk && bookData.total_price && bookData.pay_date && 
        (bookData.paytype_id_fk !== 3 && bookData.paytype_id_fk !== 4 || 
          (bookData.cvv && bookData.expiry_date && bookData.card_number))
      : step === 2
      ? bookData.payment_method && bookData.amount_paid && bookData.payment_date
      : true);
      
      if (!bookData.pay_date && bookData.date) {
        const { date, group_size, service_id_fk } = bookData;
    
        // Find the selected service based on the service_id_fk
        const selectedService = services.find(service => service.value === service_id_fk);
    
        // If service is found, calculate the total price
        if (selectedService) {
          const price = selectedService.price; // Get the price of the selected service
    
          setBookData({
            ...bookData,
            pay_date: date ? date[0] : null,  // Set the pay_date to the start date of the booking
            total_price: group_size * price,   // Calculate the total_price
          });
        }
      }
    

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
                    <label className="form-label">ປະເພດການຈ່າຍ</label>
                    <SelectPicker className="form-label" data={payTypes}
                      value={bookData.paytype_id_fk}
                      onChange={(value) => handleSelectChange(value, "paytype_id_fk")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ຈຳນວນເງິນ</label>
                    <Input className="form-label" name="total_price"
                      value={bookData.total_price}
                      onChange={(value) => setBookData({ ...bookData, total_price: value.replace(/[^0-9.]/g, "") })}
                      readOnly style={{color:'green'}}/>
                  </div>
                  {(bookData.paytype_id_fk === 3 || bookData.paytype_id_fk === 4) && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">CVV Code</label>
                        <Input className="form-label" name="cvv" value={bookData.cvv}
                          onChange={(value) => setBookData({ ...bookData, cvv: value.replace(/[^0-9]/g, "") })}
                          required/>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">MM/YY</label>
                        <DatePicker className="form-label" name="expiry_date" value={bookData.expiry_date}
                          onChange={(value) => setBookData({ ...bookData, expiry_date: value })}
                          required style={{ width: "100%" }} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Card Number</label>
                        <Input className="form-label" name="card_number"
                          value={bookData.card_number}
                          onChange={(value) => setBookData({ ...bookData, card_number: value.replace(/[^0-9]/g, "") })}
                          required/>
                      </div>
                    </>
                  )}
                  <div className="col-md-6">
                    <label className="form-label">ວັນທີ</label>
                    <DatePicker className="form-label" name="pay_date"
                      value={bookData.pay_date} onChange={(value) => setBookData({ ...bookData, pay_date:value})}
                      required style={{ width: "100%" }} />
                  </div>
                </div>
              </Panel>
            )}
            {step === 2 && (
              <Panel>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">ຊຳລະເງິນ</label>
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
          <Button onClick={onNext} disabled={step === 3 || isNextDisabled}>Next</Button>
          <Button type="submit" appearance="primary" disabled={step !== 1}>
            {modalType === "add" ? "Book Now" : "Update"}
          </Button>
          <Button onClick={onClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookingModal;
