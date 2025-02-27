import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '../../config/connection';
import { Notification } from '../../SweetAlert2';
import Backgrouds from '../../assets/spa_bg.jpg' 
import { Loader } from 'rsuite';
import axios from 'axios';

export default function LoingPage() {
const api = Config.ApiURL;
const navigate = useNavigate();

const [isLoading,setIsLoading]=useState(false)
const [values,setValues]=useState({
    email:'',
    password:'',
})

useEffect(() => {
    checkToken();
}, []);

const handledChange=(name,value)=>{
    setValues({
        ...values,[name]:value
    })
}

const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${api}/checklogin/`, values);
 
      if (res.status === 200) {
        const { staff_id,staff_code, staffName, email, staff_status, authen_fk, token} = res.data; 
		localStorage.setItem('staff_id', staff_id);
		localStorage.setItem('staff_code', staff_code);
        localStorage.setItem('staffName', staffName);
        localStorage.setItem('email', email);
        localStorage.setItem('staff_status', staff_status);
        localStorage.setItem('authen_fk', authen_fk);
        localStorage.setItem('token', token);
        // navigate('/home');
        window.location.href = "/home";
      } else {
        Notification.error('ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ ', 'ແຈ້ງເຕືອນ');
      }
	} catch {
      Notification.error('ຊື່ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ ', 'ແຈ້ງເຕືອນ');
    } finally {
      setIsLoading(false);
    }
  };

    const [showPassword, setShowPassword] = useState(false);
    const handleCheckbox = () => {
        setShowPassword(!showPassword);
    };

    const checkToken = async () => {
            //ດຶງ token ຈາກ localStorage ມາກວດສອບ
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.post(`${api}/checklogin/authen`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.status === 200) {
                        navigate('/home');
                    }
                } catch {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        };

    return (
        <div id="app" className="app">
        <div className="login login-v2 fw-bold">
			<div className="login-cover">
				<div className="login-cover-img" style={{ backgroundImage: `url(${Backgrouds})` }} data-id="login-cover-image"></div>
				<div className="login-cover-bg"></div>
			</div>
			<div className="login-container">
				<div className="login-header">
					<div className="brand">
						<div className="d-flex align-items-center"><b>ຮ້ານນວດ</b>ແຜນບູຮານ
						</div>
                        <small>ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ 👋laryang.2000@gmail.com</small>
                        <small>admin1@gmail.com</small>
					</div>
					<div className="icon">
						<i className="fa fa-lock"></i>
					</div>
				</div>
				<div className="login-content">
                    <form  onSubmit={handleSubmit}>
                        <div className="form-floating mb-20px">
                            <input type="text" onChange={(e)=>handledChange('email',e.target.value)} 
							className="form-control fs-13px h-45px border-blue" placeholder="Email Address" required />
                               <label name="email" className="d-flex align-items-center text-gray-600 fs-13px">Email Address</label>
                        </div>
                        <div className="form-floating mb-20px">
                            <input type={showPassword ? 'text' : 'password'} onChange={(e)=>handledChange('password',e.target.value)}
								className="form-control fs-13px h-45px border-blue" placeholder="Password" required />
                                <label name="password" className="d-flex align-items-center text-gray-600 fs-13px">Password</label>
                        </div>
                        <div className="form-check mb-20px">
                            <input className="form-check-input is-invalid"  onChange={handleCheckbox}  checked={showPassword} type="checkbox"  />
                                <label className="form-check-label fs-13px text-gray-500" name="rememberMe"> ສະແດງລະຫັດຜ່ານ</label>
                            </div>
                            <div className="mb-20px">
                                <button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg"
								 disabled={isLoading}> {isLoading===true?( <Loader size="sm" content="ກຳລັງກວດສອບ..." />):'ເຂົ້າສູ່ລະບົບ'} </button>
                            </div>
                            <div className="text-gray-500">
                                Version V.01
                            </div>
                        </form>
                    </div>
			</div>
		</div>
	</div>
 
    )
} 