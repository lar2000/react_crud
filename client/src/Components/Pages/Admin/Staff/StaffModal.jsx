/* eslint-disable react/prop-types */
// Modal.jsx
// import { useState, useEffect } from "react";
// import { Modal, Button, SelectPicker, Input, Radio, RadioGroup } from "rsuite";
// import userImage from "../../../../assets/user.png";
// import { useProvince, useDistrict } from "../../../../config/selectOption"; // Assuming hooks are in this location

// const StaffModal = ({ open, onClose, staffData, setStaffData, modalType, onSubmit, resetForm }) => {
//   const provinces = useProvince();
//   const districts = useDistrict(staffData.province);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(userImage);

//   useEffect(() => {
//     if (staffData.profile) {
//       setImageUrl(staffData.profile ? `${staffData.profile}` : userImage);
//     } else {
//       setImageUrl(userImage);
//     }
//   }, [staffData]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageUrl(event.target.result);
//       };
//       setStaffData({
//         ...staffData,
//         profile: file,
//       });
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClearImage = () => {
//     setSelectedFile(null);
//     setImageUrl(userImage);
//     setStaffData({
//       ...staffData,
//       profile: null,
//     });
//   };

//   const handleSelectChange = (value, field) => {
//     setStaffData({
//       ...staffData,
//       [field]: value,
//     });
//   };

//   return (
//     <Modal size={"sm"} open={open} onClose={onClose}>
//       <Modal.Header>
//         <Modal.Title className="title text-center">
//           {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນພະນັກງານ" : "ແກ້ໄຂ ຂໍ້ມູນພະນັກງານ"}
//         </Modal.Title>
//       </Modal.Header>
//       <form onSubmit={onSubmit}>
//         <Modal.Body>
//           <div className="row mb-3">
//             <div className="mb-3 d-flex justify-content-center align-items-center">
//               <label role="button">
//                 <input
//                   type="file"
//                   id="fileInput"
//                   accept="image/*"
//                   className="hide"
//                   onChange={handleFileChange}
//                 />
//                 <img src={imageUrl} className="w-150px rounded-3" />
//               </label>
//               {selectedFile && (
//                 <span
//                   role="button"
//                   onClick={handleClearImage}
//                   className="d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5"
//                 >
//                   <i className="fa-solid fa-xmark"></i>
//                 </span>
//               )}
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ຊື່</label>
//               <Input
//                 className="form-label"
//                 name="name"
//                 value={staffData.staff_name}
//                 onChange={(value) => setStaffData({ ...staffData, staff_name: value })}
//                 placeholder="ຊື່..."
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ນາມສະກຸນ</label>
//               <Input
//                 className="form-label"
//                 name="surname"
//                 value={staffData.staff_surname}
//                 onChange={(value) => setStaffData({ ...staffData, staff_surname: value })}
//                 placeholder="ນາມສະກຸນ..."
//                 required
//               />
//             </div>
//             <div className="col-md-12">
//               <label className="form-label">ອີເມວ໌</label>
//               <Input
//                 className="form-label"
//                 name="email"
//                 value={staffData.email}
//                 onChange={(value) => setStaffData({ ...staffData, email: value })}
//                 placeholder="ອີເມວ໌..."
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ເບີໂທ</label>
//               <Input
//                 className="form-label"
//                 name="tell"
//                 value={staffData.tell}
//                 onChange={(value) => setStaffData({ ...staffData, tell: value.replace(/[^0-9]/g, "") })}
//                 placeholder="020xxxxxxxx/030xxxxxxx"
//                 required
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ແຂວງ</label>
//               <SelectPicker
//                 className="form-label"
//                 data={provinces}
//                 value={staffData.province}
//                 onChange={(value) => handleSelectChange(value, "province")}
//                 placeholder="ເລືອກແຂວງ"
//                 required
//                 block
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ເມືອງ</label>
//               <SelectPicker
//                 className="form-label"
//                 data={districts}
//                 value={staffData.district_fk}
//                 onChange={(value) => handleSelectChange(value, "district_fk")}
//                 placeholder="ເລືອກເມືອງ"
//                 required
//                 block
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">ບ້ານ</label>
//               <Input
//                 className="form-label"
//                 value={staffData.village}
//                 onChange={(value) => setStaffData({ ...staffData, village: value })}
//                 placeholder="ບ້ານ..."
//                 required
//               />
//             </div>
//             <div className="col-md-12 mt-4">
//               <RadioGroup name="radio-group-inline" inline defaultValue="A">
//                 <Radio value="A">Normal</Radio>
//                 <Radio value="B">Admin</Radio>
//                 <Radio value="C">Superadmin</Radio>
//               </RadioGroup>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button type="submit" appearance="primary">
//             {modalType === "add" ? "Add" : "Update"}
//           </Button>
//           <Button onClick={resetForm} appearance="subtle">
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </form>
//     </Modal>
//   );
// };

// export default StaffModal;
