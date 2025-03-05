import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Input, SelectPicker, Placeholder, Loader } from "rsuite";
import { Notification, Alert } from '../../../../SweetAlert2'
import proImage from '../../../../assets/imges.jpg';
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config, Urlimage} from "../../../../config/connection";
import { useRoomType } from "../../../../config/selectOption";
import { AuthenActions } from "../../../../util";

const Room = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/images/`;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)
  const [imageUrl, setImageUrl] = useState(proImage);
  const [selectedFile, setSelectedFile] = useState(null);

  const roomType = useRoomType();
  const actions = AuthenActions();

  const [roomData, setroomData] = useState({
    room_id: null,
    room_number: "",
    roomtype_fk: "",
    room_img: null,
  });

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/room`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch room data", err);
    }
    finally{
      setLoading(false)
    }
  };
  const resetForm = () => {
    setroomData({
        room_id: null,
        room_number: "",
        roomtype_fk: "",
        room_img: "",
    });
    setOpen(false);
        setImageUrl(proImage); // Reset image URL
        setSelectedFile(null); // Reset selected file
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }

  const handleAddClick = () => {
    handleOpen();
    setModalType("add");
  };

  const handleEditClick = (data) => {
    setModalType("edit");
    handleOpen();
    setroomData({
      _id: data.room_id,
      room_number: data.room_number,
      roomtype_fk: data.roomtype_fk,
    });
    setImageUrl(data.room_img ? `${img}${data.room_img}` : proImage);
  };

  const handleChange = (name, value) => {
    setroomData({
      ...roomData,
      [name]: value,
    });
  };
    const handleClearImage = () => {
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      setroomData({
        ...roomData, room_img: null
      })
      setImageUrl(proImage)
    };
  const handleSelectChange = (event, field) => {
    setroomData({
      ...roomData,
      [field]: event,
    });
  };
    const handleFileChange = (e) => {
      alert(roomData.room_img)
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target.result);
        };
        setroomData({
          ...roomData, room_img:file
        })
        reader.readAsDataURL(file);
      } else {
      setImageUrl(proImage);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true)
    const formData = new FormData();

    for (const key in roomData) {
      formData.append(key, roomData[key]);
    }
    try {
        await axios.post(`${api}/room/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.successData(`${formData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
        handleClose();
        fetchgetData();
        resetForm();
    } catch (err) {
      console.error("Failed to submit room data", err);
      Notification.error('ບັນທຶກຂໍ້ມູນລົ້ມເຫຼວ!');
    }
    finally {
      setLoadingSave(false)
    }
  };
  const handleDeleteClick = async (id) => {
    const isConfirmed = await Alert.confirm("ຕ້ອງການລຶບຂໍ້ມູນນີ້ແທ້ບໍ່?");
    if (isConfirmed) {
      try {
        await axios.delete(`${api}/room/${id}`);
        Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
        fetchgetData();
      } catch (err) {
        console.error("Failed to delete room", err);
        Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
      }
    }
  };
  
  const filteredData = getData.filter((room) => {
    const matchesSearch =
      room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.roomtype_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
      selectedStatus === "" || room.status === parseInt(selectedStatus);

    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * length;
  const paginatedData = filteredData.slice(startIndex, startIndex + length);

  return (
    <div id="content" className="app-content">
      <div className="panel panel-inverse">
        <div className="panel-body">
          <div className="row mt-2 justify-content-between">
            <div className="d-md-flex justify-content-between align-items-center dt-layout-start col-md-auto me-auto">
              <Length setLength={setLength} />
              <div className="ms-2 mb-2">
                <select className="form-select form-select-sm" value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="0">ຫວ່າງ</option>
                  <option value="1">ຈອງແລ້ວ</option>
                  <option value="2">ກຳລັງໃຊ້ງານ</option>
                </select>
              </div>
            </div>

            <div className="d-md-flex justify-content-between align-items-center dt-layout-end col-md-auto ms-auto">
              <SearchQuery searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
              <div className="actions mb-2">
              <a href="javarscript:;" className={`btn btn-sm btn-success ms-2 ${!actions.canCreate ? "disabled" : ""}`}
                  onClick={actions.canCreate ? () => handleAddClick() : (e) => e.preventDefault()}>
                  <i className="fas fa-user-plus"></i>
                </a>
              </div>
            </div>
          </div>
          <div style={{ overflowX: 'auto', overflowY:'auto' }}>
          <table id="data-table-default" className="table table-striped table-bordered align-middle text-nowrap">
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th width="1%" data-orderable="false">#</th>
                <th className="text-nowrap">ເບີຫ້ອງ</th>
                <th className="text-nowrap">ປະເພດຫ້ອງ</th>
                <th className="text-nowrap">ສະຖານະ</th>
                <th className="text-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={8} className="text-center">
                  <Placeholder.Grid rows={5} columns={6} active />
                  <Loader size='lg'  content="ກຳລັງໂຫລດ..." vertical />
                  </td>
                </tr>
              ): paginatedData.length > 0 ? paginatedData.map((room, index) => (
                <tr key={room.room_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td>{room.room_number}</td>
                  <td width="1%" className="with-img">
                    {room.room_img && (<img src={`${img}${room.room_img}`}
                        className="rounded h-30px my-n1 mx-n1" alt="image"/>
                    )}
                  </td>
                  <td>{room.roomtype_name}</td>
                  <td>
                    {   room.status === 2 ? (
                        <span className="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>ກຳລັງໃຊ້ງານ</span>) 
                        : room.status === 1 ? (
                        <span className="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>ຈອງແລ້ວ</span>) 
                        : (
                        <span className="badge border border-secondary text-secondary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">
                        <i className="fa fa-circle fs-9px fa-fw me-5px"></i>ຫວ່າງ
                        </span>
                    )}
                    </td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                      <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                              onClick={actions.canUpdate ? () => handleEditClick(room) : (e) => e.preventDefault()}>
                                <i className="fas fa-pen-to-square fa-fw"></i>
                              ແກ້ໄຂ</a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                            onClick={actions.canDelete ? () => handleDeleteClick(room.room_id) : (e) => e.preventDefault()}>
                            <i className="fas fa-trash fa-fw"></i>
                             ລຶບ
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )): (
                <tr className="text-center">
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນຫ້ອງ ===============</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          <Pagination total={filteredData.length} length={length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      <Modal size={"xs"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນຫ້ອງ" : "ແກ້ໄຂ ຂໍ້ມູນຫ້ອງ"}
          </Modal.Title>
        </Modal.Header>
        <form  onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row mb-3">
          <div className="mb-3 d-flex justify-content-center align-items-center">
            <label role='button'>
              <input type="file" id="fileInput" accept="image/*" className='hide' onChange={handleFileChange}/>
                <img src={imageUrl} className="w-150px rounded-3" />
            </label>
            {selectedFile && ( 
              <span role='button' onClick={handleClearImage} 
              className=" d-flex align-items-center justify-content-center badge bg-danger text-white position-absolute end-40 top-0 rounded-pill mt-n2 me-n5">
                <i className="fa-solid fa-xmark"></i></span>
            )}
            </div>
          <div className="col-md-12">
              <label className="form-label">ເບີຫ້ອງ</label>
              <Input className="form-label" name="room_number" value={roomData.room_number} 
              onChange={(value) => handleChange("room_number", value)}
              placeholder="ເບີຫ້ອງ..." required />
            </div>
            <div className="col-md-12">
              <label className="form-label">ປະເພດຫ້ອງ</label>
              <SelectPicker className="form-label" data={roomType} value={roomData.roomtype_fk}
                onChange={(value) => handleSelectChange(value, "roomtype_fk")}
                placeholder="ເລືອກປະເພດ" required block/>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <Button type="submit" disabled={loadingSave} appearance="primary">
          {loadingSave ? (<Loader content="ກຳລັງບັນທຶກ..."/>):
          <>{modalType === "add" ? "ບັນທຶກ" : "ອັບບເດດ"}</>
          }
          </Button>
          <Button onClick={resetForm} color="red" appearance="primary">
            ຍົກເລີກ
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Room;
