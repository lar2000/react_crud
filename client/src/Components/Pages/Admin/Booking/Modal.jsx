/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Steps, Panel, Input, SelectPicker, DatePicker, DateRangePicker } 
from 'rsuite';
import { useService, useCustomer, usePayType, useDuration, useTimePerDay }
 from "../../../../config/selectOption";

const BookingModal = ({ open, onClose, modalType, bookData, setBookData, handleSubmit }) => {
  const services = useService();
  const customers = useCustomer();
  const payTypes = usePayType();
  const durations = useDuration();
  const timeperday = useTimePerDay();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (modalType === 'add') {
      setStep(0); // Reset to step 0 when "Add New" is clicked
    } else if (modalType === 'edit') {
      setStep(0);
    }
  }, [modalType, open]); // This ensures that step resets when the modal opens

  const onChange = (nextStep) => {
    setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
  };
  const validateStep = () => {
    if (step === 0) {
      return bookData.group_size && 
      Array.isArray(bookData.date) && bookData.date.length === 2 && bookData.date[0] && bookData.date[1] && 
      bookData.service_id_fk && 
      bookData.dur_id_fk && 
      bookData.time_per_day_fk && 
      bookData.cust_id_fk && 
      bookData.tell;
    }
    if (step === 1) {
      return bookData.paytype_id_fk && 
      bookData.total_price && 
      bookData.pay_date;
    }
    return true;
  };

  const onPrevious = () => onChange(step - 1);
  const onNext = () => {
    if (!validateStep()) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!bookData.pay_date && bookData.date) {
      const { date, group_size, service_id_fk, dur_id_fk, time_per_day_fk} = bookData;
  
      const selectedService = services.find(s => s.value === service_id_fk);
      const selectedDuration = durations.find(d => d.value === dur_id_fk);
      const selectedTimePerDay = timeperday.find(tpd => tpd.value === time_per_day_fk);
  
      if (selectedService && selectedDuration && selectedTimePerDay) {
        const price = selectedService.price;
        const duration = selectedDuration.duration;
        const timeperday = (selectedTimePerDay.time_per_day)/30;
        const calcu = duration * timeperday;
        setBookData({
          ...bookData,
          pay_date: date ? date[0] : null,
          total_price: (group_size * price) * calcu,  
        });
      }
    }
  
    onChange(step + 1);  // Continue to the next step
  };  

  const handleSelectChange = (event, field) => {
    setBookData({
      ...bookData,
      [field]: event,
    });
  };
  return (
    <Modal size={"sm"} open={open} onClose={onClose}>
  
        <Modal.Title className="title text-center mt-2">
        </Modal.Title>
      <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-center align-items-center">
      <div className="col-md-8">
      <Steps current={step}>
          <Steps.Item title= {modalType === "add" ? "ລາຍລະອຽດການຈອງ" : "ແກ້ໄຂຂໍ້ມູນການຈອງ" } />
          <Steps.Item title="ຊຳລະເງິນ" />
        </Steps>
        </div>
        </div>
        <Modal.Body>
          <div>
            {step === 0 && (
              <Panel>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">ຈຳນວນຄົນ</label>
                    <Input className="form-label" name="amount" value={bookData.group_size}
                      onChange={(value) => setBookData({ ...bookData, group_size: value.replace(/[^0-9]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ເລຶອກບໍລິການ</label>
                    <SelectPicker className="form-label" data={services}
                      value={bookData.service_id_fk}
                      onChange={(value) => handleSelectChange(value, "service_id_fk")} required block />
                  </div>
                  <div className="col-md-6">
                  <label className="form-label">ໄລຍະເວລາ</label>
                    <SelectPicker className="form-label" data={durations}
                      value={bookData.dur_id_fk}
                      onChange={(value) => handleSelectChange(value, "dur_id_fk")} required block />
                    </div>
                  <div className="col-md-6">
                    <label className="form-label">ນາທີ/ວັນ</label>
                    <SelectPicker className="form-label" data={timeperday}
                      value={bookData.time_per_day_fk}
                      onChange={(value) => handleSelectChange(value, "time_per_day_fk")} required block />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ຊື່ ແລະ ນາມລະກຸນ</label>
                    <SelectPicker className="form-label" data={customers}
                      value={bookData.cust_id_fk}
                      onChange={(value) => handleSelectChange(value, "cust_id_fk")} required block />
                  </div>
                  <div className="col-md-6">
                  <label className="form-label">ວັນທີຈອງ~ວັນທີສິ້ນສຸດ</label>
                  <DateRangePicker className="form-label" name="date"
                   value={bookData.date || []} onChange={(date) => { setBookData({ 
                    ...bookData, date: date && date.length === 2 ? date : [] });}}
                    required style={{ width: "100%" }}/>
                    </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <Input className="form-label" name="tell" value={bookData.tell}
                      onChange={(value) => setBookData({ ...bookData, tell: value.replace(/[^0-9]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <Input className="form-label" name="email"
                      value={bookData.email}
                      onChange={(value) => setBookData({ ...bookData, email: value })} />
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
                  <div className="col-md-12">
                    <label className="form-label">ປະເພດການຈ່າຍ</label>
                    <SelectPicker className="form-label" data={payTypes}
                      value={bookData.paytype_id_fk}
                      onChange={(value) => handleSelectChange(value, "paytype_id_fk")} required block />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">ຈຳນວນເງິນ</label>
                    <Input className="form-label" name="total_price"
                      value={bookData.total_price}
                      onChange={(value) => setBookData({ ...bookData, total_price: value.replace(/[^0-9.]/g, "") })}
                      readOnly style={{color:'green'}}/>
                  </div>
                  {(bookData.paytype_id_fk === 3 || bookData.paytype_id_fk === 4) && (
                    <>
                      <div className="col-md-12">
                        <label className="form-label">CVV Code</label>
                        <Input className="form-label" name="cvv" value={bookData.cvv}
                          onChange={(value) => setBookData({ ...bookData, cvv: value.replace(/[^0-9]/g, "") })}
                          required/>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">MM/YY</label>
                        <DatePicker className="form-label" name="expiry_date" value={bookData.expiry_date}
                          onChange={(value) => setBookData({ ...bookData, expiry_date: value })}
                          required style={{ width: "100%" }}/>
                      </div>
                      <div className="col-md-12">
                        <label className="form-label">Card Number</label>
                        <Input className="form-label" name="card_number"
                          value={bookData.card_number}
                          onChange={(value) => setBookData({ ...bookData, card_number: value.replace(/[^0-9]/g, "") })}
                          required/>
                      </div>
                    </>
                  )}
                  <div className="col-md-12">
                    <label className="form-label">ວັນທີ</label>
                    <DatePicker className="form-label" name="pay_date"
                      value={bookData.pay_date} onChange={(value) => setBookData({ ...bookData, pay_date:value})}
                      required style={{ width: "100%" }} />
                  </div>
                </div>
              </Panel>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onPrevious} disabled={step === 0}>Previous</Button>
          {step !== 1 && (
            <Button onClick={onNext} disabled={!validateStep()}>Next</Button>
          )}
          <Button type="submit" appearance="primary" disabled={step !== 1}
          onClick={handleSubmit}>
            {modalType === "add" ? "Book Now" : "Update"}
          </Button>
          <Button onClick={onClose} appearance="subtle">Cancel</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default BookingModal;