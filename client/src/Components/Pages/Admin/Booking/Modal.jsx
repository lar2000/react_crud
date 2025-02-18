/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Modal, Button, Steps, Panel, Input, SelectPicker, CheckPicker, DatePicker, Tabs, InlineEdit } 
from 'rsuite';
import { useService, useCustomer, usePayType, usePackage }
 from "../../../../config/selectOption";

const BookingModal = ({ open, onClose, modalType, bookData, setBookData, handleSubmit }) => {
  const services = useService();
  const packages = usePackage();
  const customers = useCustomer();
  const payTypes = usePayType();
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
      bookData.date && 
      bookData.sv_fk || bookData.pk_fk &&
      bookData.cust_id_fk && 
      bookData.tell;
    }
    if (step === 1) {
      return bookData.paytype_id_fk && 
      bookData.calculation && 
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
      const { date, group_size, sv_fk, pk_fk } = bookData;

      const selectedServices = services.filter(s => sv_fk.includes(s.value));
      const selectedPackages = packages.filter(pk => pk_fk.includes(pk.value));

      if (selectedServices.length > 0 || selectedPackages.length > 0) {

        const servicePrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
        const packagePrice = selectedPackages.reduce((sum, pk) => sum + Number(pk.total_price), 0);

        const totalPrice = group_size * (servicePrice + packagePrice);

        setBookData({
          ...bookData,
          pay_date: date || null,
          total_price: totalPrice,
        });
        alert(`ລາຄາບໍລິການທັງໝົດ: ${servicePrice} ກີບ\nລາຄາແພັກເກດທັງໝົດ: ${packagePrice} ກີບ\nລວມ: ${totalPrice} ກີບ`);
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
    <Modal size={step === 1 ? "xs" : "sm"} open={open} onClose={onClose}>
        <Modal.Title className="title text-center mt-2">
        </Modal.Title>
      <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-center align-items-center">
      <div className="col-md-8">
      <Steps current={step} small={step === 1 ? true : false}>
          <Steps.Item title= {modalType === "add" ? "ລາຍລະອຽດຈອງ" : "ແກ້ໄຂຂໍ້ມູນຈອງ" } />
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
                  <Tabs defaultActiveKey="1" appearance="subtle">
                      <Tabs.Tab eventKey="1" title="ທົ່ວໄປ">
                      <CheckPicker className="form-label" data={services}
                        value={bookData.sv_fk || []} 
                        onChange={(value) => handleSelectChange(value, "sv_fk")}
                        placeholder="ບໍລິການທົ່ວໄປ..." required block />
                      </Tabs.Tab>
                      <Tabs.Tab eventKey="2" title="ແພັກເກດ">
                    <CheckPicker className="form-label" data={packages}
                      value={bookData.pk_fk || []} onChange={(value) => handleSelectChange(value, "pk_fk")}
                      placeholder="ແພັກເກດ..." required block />
                      </Tabs.Tab>
                    </Tabs>
                  </div>
                  <div className="col-md-6 mt-4">
                    <label className="form-label">ຈຳນວນຄົນ</label>
                    <Input className="form-label" name="amount" value={bookData.group_size}
                      onChange={(value) => setBookData({ ...bookData, group_size: value.replace(/[^0-9]/g, "") })}
                      required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ຊື່ ແລະ ນາມລະກຸນ</label>
                    <SelectPicker className="form-label" data={customers}
                      value={bookData.cust_id_fk}
                      onChange={(value) => setBookData({...bookData, cust_id_fk: value})} required block />
                  </div>
                  <div className="col-md-6">
                  <label className="form-label">ເວລານັດໝາຍ</label>
                  <DatePicker format="dd/MM/yyyy HH:mm" className="form-label" placement='auto' 
                   value={bookData.date} onChange={(value) =>  setBookData({ ...bookData, date: value })}
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
               <div className="h-100 d-flex flex-column p-0">
                 <div className="d-md-flex justify-content-between dt-layout-end">
                   <h5 className="title">ຈຳນວນເງິນ:</h5>
                   <div className="col-6 d-md-flex justify-content-between dt-layout-end">
                    <InlineEdit defaultValue={bookData.total_price || 0 }
                      onChange={(value) => {setBookData({ ...bookData, calculation: value });}}
                      style={{width: 200, textAlign: 'right'}}
                      readOnly/>
                  </div>
                 </div>        
                 <div className="d-md-flex justify-content-between dt-layout-end">
                   <h5 className="title">ຮັບເງິນ:</h5>
                    <div className="col-6 d-md-flex justify-content-between dt-layout-end">
                      <InlineEdit size="lg" placeholder="ປ້ອນຈຳນວນເງິນ..." style={{ width: 180, textAlign: 'right' }} />
                    </div>
                 </div>
           
                 <hr style={{ height: "2px", backgroundColor: "#333" }} />
           
                 <div className="header d-md-flex justify-content-between dt-layout-end">
                   <h5 className="title">ເງິນທອນ:</h5>
                   <div className="col-6 d-md-flex justify-content-between dt-layout-end">
                   <h5 size="lg" style={{ width: 200 }} />
                 </div>
                 </div>
           
                 <div className="header d-md-flex justify-content-between dt-layout-end mt-4">
                   <h6>ການຊຳລະ:</h6>
                   <div className="col-6 d-md-flex justify-content-between dt-layout-end">
                   <InlineEdit style={{ width: 200, textAlign: 'right' }} defaultValue={bookData.paytype_id_fk}>
                     <SelectPicker placement="rightStart" className="form-label"
                       data={payTypes} value={bookData.paytype_id_fk}
                       onChange={(value) => handleSelectChange(value, "paytype_id_fk")}
                       required block/>
                   </InlineEdit>
                 </div>
                </div>
                 <div className="header d-md-flex justify-content-between dt-layout-end">
                   <h6>ວັນທີ:</h6>
                   <div className="col-6 d-md-flex justify-content-between dt-layout-end">
                   <InlineEdit style={{ width: 200, textAlign: 'right' }} defaultValue={new Date(bookData.date)}>
                     <DatePicker className="form-label" placement="auto" value={bookData.pay_date}
                       onChange={(value) => setBookData({ ...bookData, pay_date: value })}
                       required />
                   </InlineEdit>
                 </div>
                 </div>
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