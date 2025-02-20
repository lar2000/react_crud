
import Backgrouds from '../../assets/spa_bg.jpg' 

const LogIn = () => {
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
                        <small>ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ 👋</small>
					</div>
					<div className="icon">
						<i className="fa fa-lock"></i>
					</div>
				</div>
				<div className="login-content">
					<form action="/home" method="GET">
						<div className="form-floating mb-20px">
							<input type="text" className="form-control fs-13px h-45px border-0" placeholder="Email Address" id="emailAddress" />
							<label name="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">ອີເມວ໌</label>
						</div>
						<div className="form-floating mb-20px">
							<input type="password" className="form-control fs-13px h-45px border-0" placeholder="Password" />
							<label name="emailAddress" className="d-flex align-items-center text-gray-600 fs-13px">Password</label>
						</div>
						<div className="form-check mb-20px">
							<input className="form-check-input border-0" type="checkbox" value="1" id="rememberMe" />
							<label className="form-check-label fs-13px text-gray-500" name="rememberMe">
								Remember Me
							</label>
						</div>
						<div className="mb-20px">
							<button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg">Sign me in</button>
						</div>
						<div className="text-gray-500">
							Not a member yet? Click <a href="register_v3.html" className="text-white">here</a> to register.
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
 
    )
} 
export default LogIn;