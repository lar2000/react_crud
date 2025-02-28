import { useEffect, useState } from "react";
import axios from "axios";
import proImage from '../../../../assets/imges.jpg';
import { Modal, 
  Button, Input, 
  CheckPicker,
  CheckTreePicker, 
  SelectPicker, 
  Loader, 
  Placeholder 
} from "rsuite";

import { Notification, Alert } from '../../../../SweetAlert2'
import Length from "../../../Feature/Length";
import SearchQuery from "../../../Feature/searchQuery";
import Pagination from "../../../Feature/Pagination";
import { Config, Urlimage } from "../../../../config/connection";
import { useService, useSetProduct } from "../../../../config/selectOption";
import { AuthenActions } from "../../../../util";

const Package = () => {
  const api = Config.ApiURL;
  const img = `${Urlimage.ImgURL}/pk_images/`;
  const [getData, setData] = useState([]);
  const [length, setLength] = useState(10); // Default to 10 items per page
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState("add"); // Add or edit
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(proImage);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave]=useState(false)

  const [PackageData, setPackageData] = useState({
    pk_id: null,
    association_service_fk: [],
    pk_code: "",
    pk_name: "",
    pk_price: "",
    set_id_fk: null,
    pk_images: null,
  });
  const setProducts = useSetProduct();
  // const options = [ 
  //   { 
  //     "label": "Madhya Pradesh", 
  //     "value": 1, 
  //     "children": [ 
  //       { 
  //         "label": "Mhow", 
  //         "value": 2 
  //       }, 
  //       { 
  //         "label": "Mhow", 
  //         "value": 3 
  //       }, 
  //     ] 
  //   },
  //   {
  //     "label": "Indore", 
  //     "value": 4, 
  //     "children": [ 
  //       { 
  //         "label": "Vijay Nagar", 
  //         "value": 5 
  //       }, 
  //       { 
  //         "label": "Rajiv Gandhi Square", 
  //         "value": 6 
  //       }, 
  //       { 
  //         "label": "MR 10", 
  //         "value": 7 
  //       }, 
  //     ] 
  //   },  
  // ]; 

  const services = useService();
  const actions = AuthenActions();

  useEffect(() => {
    fetchgetData();
  }, []);

  const fetchgetData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/package`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch Package data", err);
    }
    finally{
      setLoading(false)
    }
  };
  const resetForm = () => {
    setPackageData({
        pk_id: null,
        association_service_fk: [],
        pk_code: "",
        pk_name: "",
        pk_price: "",
        set_id_fk: "",
        pk_images: null,
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
    setPackageData({
      _id: data.pk_id,
      association_service_fk: data.association_service_fk.map(id => Number(id)),
      pk_code: data.pk_code,
      pk_name: data.pk_name,
      pk_price: data.pk_price,
      set_id_fk: data.set_id_fk,
      pk_images: null,
    });
    setImageUrl(data.pk_images ? `${img}${data.pk_images}` : proImage);
  };

  const handleChange = (name, value) => {
    setPackageData({
      ...PackageData,
      [name]: value,
    });
  };

  const handleSelectChange = (event, field) => {
    setPackageData({
      ...PackageData,
      [field]: event,
    });
  };
  const handleCheck = (name, value) => {
    alert("Selected Value: " + JSON.stringify(value)); // Debugging
    setPackageData((prev) => ({
      ...prev,
      [name]: value // Dynamically update the state by field name
    }));
  };

  const handleClearImage = () => {
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      setPackageData({
        ...PackageData, pk_images: null
      })
      setImageUrl(proImage)
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target.result);
        };
        setPackageData({...PackageData, pk_images:file})
        reader.readAsDataURL(file);
      } else {
      setImageUrl(proImage);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true)

    const formData = new FormData();

  for (const key in PackageData) {
    if (Array.isArray(PackageData[key])) {
      PackageData[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (PackageData[key] instanceof File) {
      formData.append(key, PackageData[key]);
    } else {
      formData.append(key, PackageData[key]);
    }
  }

    try {
        await axios.post(`${api}/package/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
         Alert.successData(`${PackageData._id ? "ອັບເດດ" : "ບັນທຶກ"} ຂໍ້ມູນສຳເລັດແລ້ວ!`);
        handleClose();
        fetchgetData();
    } catch (err) {
      console.error("Failed to submit Package data", err);
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
      await axios.delete(`${api}/package/${id}`);
      Alert.successData("ລຶບຂໍ້ມູນສຳເລັດແລ້ວ!");
      fetchgetData();
    } catch (err) {
      console.error("Failed to delete Package", err);
      Notification.error('ລຶບຂໍ້ມູນລົ້ມເຫຼວ');
     }
   }
  };
  
  const filteredData = getData.filter((pkg) => {
    const matchesSearch =
      pkg.pk_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.pk_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
          <table id="data-table-default" 
          className={`table ${!loading && 'table-striped'} table-bordered align-middle text-nowrap`}>
            <thead>
              <tr>
                <th className="text-nowrap">ລ/ດ</th>
                <th width="1%" data-orderable="false">#</th>
                <th className="text-nowrap">ລະຫັດ</th>
                <th className="text-nowrap">ຊື່ແພັກເກດ</th>
                <th className="text-nowrap">ບໍລິການທີໄດ້ຮັບ</th>
                {/* <th className="text-nowrap">ໄລຍະເວລາ</th> */}
                <th className="text-nowrap">ລາຄາ</th>
                <th className="text-nowrap">ເຊັດອຸປະກອນ</th>
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
              ) : paginatedData.length > 0 ? paginatedData.map((pkg, index) => (
                <tr key={pkg.pk_id}>
                  <td width="1%" className="fw-bold">
                    {startIndex + index + 1}
                  </td>
                  <td width="1%" className="with-img">
                    {pkg.pk_images && (
                      <img src={`${img}${pkg.pk_images}`}
                        className="rounded h-30px my-n1 mx-n1" alt="image"/>
                    )}
                  </td>
                  <td>{pkg.pk_code}</td>
                  <td>{pkg.pk_name}</td>
                  <td>{pkg.service_names ? ( pkg.service_names.split(',').map((name, index) => (
                          <span key={index}>🔸{name}<br /></span>))) : ""}</td>
                  {/* <td>{formatDuration(pkg.total_duration)}</td> */}
                  <td>{pkg.pk_price} ກີບ</td>
                  <td>{pkg.set_name}</td>
                  <td>
                    <div className="panel-heading">
                      <div className="btn-group my-n1">
                        <a href="javascript:;" className="btn-primary btn-sm dropdown-toggle"data-bs-toggle="dropdown">
                          <i className="fas fa-ellipsis"></i></a>
                        <div className="dropdown-menu dropdown-menu-end">
                        <a href="javascript:;" className={`dropdown-item ${!actions.canUpdate ? "disabled" : ""}`}
                            onClick={actions.canUpdate ? () => handleEditClick(pkg) : (e) => e.preventDefault()}>
                              <i className="fas fa-pen-to-square fa-fw"></i>
                             ແກ້ໄຂ</a>
                          <a href="javascript:;" className={`dropdown-item ${!actions.canDelete ? "disabled" : ""}`}
                            onClick={actions.canDelete ? () => handleDeleteClick(pkg.pk_id) : (e) => e.preventDefault()}>
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
                  <td colSpan={8} className="text-red">================ ບໍມີຂໍ້ມູນແພັກເກດ ===============</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            total={filteredData.length}
            length={length}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/*---------- Modal Component ---------------*/}

      <Modal size={"sm"} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="title text-center">
            {modalType === "add" ? "ເພີ່ມ ຂໍ້ມູນແພັກເກດ" : "ແກ້ໄຂ ຂໍ້ມູນແພັກເກດ"}
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
            <div className="col-md-6">
              <label className="form-label">ຊື່ແພັກເກດ</label>
              <Input className="form-label" name="pk_name" value={PackageData.pk_name} 
              onChange={(value) => handleChange("pk_name", value)}
              placeholder="ຊື່..." required />
            </div>
            <div className="col-md-6">
            <label className="form-label">ເລຶອກບໍລິການ</label>
            <CheckPicker placement="auto" className="form-label" data={services} 
            value={PackageData.association_service_fk}
                onChange={(value) => handleChange("association_service_fk", value)}  
                placeholder="ເລືອກສິນຄ້າ" required block/>
                {/* <CheckTreePicker
  className="form-label"
  data={services}  
  value={PackageData.association_service_fk}
  onChange={(value) => handleCheck("association_service_fk", value)}
  placeholder="ເລືອກສິນຄ້າ"
  block
/> */}

            </div>
            <div className="col-md-6">
              <label className="form-label">ລາຄາ</label>
              <Input name="price" className="form-label" value={PackageData.pk_price} 
              onChange={(value) => handleChange("pk_price", value.replace(/[^0-9]/g, ""))}
             placeholder="ລາຄາ..." required/>
            </div>
            <div className="col-md-6">
              <label className="form-label">ເຊັດສິນຄ້າ</label>
              <SelectPicker placement="auto" className="form-label" data={setProducts} value={PackageData.set_id_fk}
                onChange={(value) => handleSelectChange(value, "set_id_fk")}
                placeholder="ເລືອກເຊັດສິນຄ້າ..." required block/>
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

export default Package;
