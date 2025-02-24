// import { useState} from 'react';
// import { Modal, Button, ButtonToolbar, InputGroup, Input } from 'rsuite';

// const ChangePass = ({open, onClose, staffData, setStaffData}) => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   return (
//     <>
//       <ButtonToolbar>
//         <Button onClick={handleOpen}> Open</Button>
//       </ButtonToolbar>

//       <Modal open={open} onClose={handleClose}>
//         <Modal.Header>
//           <Modal.Title>Modal Title</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         <>
//               <div className="col-md-12">
//                     <label className="form-label">ອີເມວ໌</label>
//                     <Input className="form-label" name="email" value={staffData.email}
//                      onChange={(value) => handleChange("email", value)}
//                       placeholder="ອີເມວ໌..." />
//                   </div>
//               <div className="col-md-12">
//                   <label className="form-label">Password</label>
//                   <InputGroup inside block>
//                     <Input type={visible ? 'text' : 'password'} value={staffData.password || ""}
//                       onChange={(value) => handleChange("password", value)} required />
//                     <InputGroup.Button onClick={handleShow}>
//                       {visible ? (<i className="fa-solid fa-eye" />) 
//                       : (<i className="fa-solid fa-eye-slash" />)}
//                     </InputGroup.Button>
//                   </InputGroup>
//                 </div>
//                 <div className="col-md-12">
//                     <label className="form-label">Confirmpassword</label>
//                     <InputGroup>
//                       <Input type='password' />
//                     </InputGroup>
//                   </div>
//                   </>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={handleClose} appearance="primary">
//             Ok
//           </Button>
//           <Button onClick={handleClose} appearance="subtle">
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ChangePass;