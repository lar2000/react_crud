
import { useNavigate } from 'react-router-dom';
import userImage from '../../assets/user.jpeg';

const Header = () => {

    const userName = localStorage.getItem('staffName');
    const navigate=useNavigate()
	
	const handleLogout=()=>{
		localStorage.clear();
		navigate('/login')
	}

  return (
		<div id="header" className="app-header">
			<div className="navbar-header">
				<a href="index.html" className="navbar-brand"><span className="navbar-logo"></span> <b className="me-3px">Color</b> Admin</a>
				<button type="button" className="navbar-mobile-toggler" data-toggle="app-sidebar-mobile">
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
			</div>
			<div className="navbar-nav">
				<div className="navbar-item navbar-form">
					<form action="" method="POST" name="search">
						<div className="form-group">
							<input type="text" className="form-control" placeholder="Enter keyword" />
							<button type="submit" className="btn btn-search"><i className="fa fa-search"></i></button>
						</div>
					</form>
				</div>
				<div className="navbar-item dropdown">
					<a href="#" data-bs-toggle="dropdown" className="navbar-link dropdown-toggle icon">
						<i className="fa fa-bell"></i>
						<span className="badge">5</span>
					</a>
					<div className="dropdown-menu media-list dropdown-menu-end">
						<div className="dropdown-header">NOTIFICATIONS (5)</div>
						<a href="javascript:;" className="dropdown-item media">
							<div className="media-left">
								<i className="fa fa-bug media-object bg-gray-500"></i>
							</div>
							<div className="media-body">
								<h6 className="media-heading">Server Error Reports <i className="fa fa-exclamation-circle text-danger"></i></h6>
								<div className="text-muted fs-10px">3 minutes ago</div>
							</div>
						</a>
						<a href="javascript:;" className="dropdown-item media">
							<div className="media-left">
								<img src={userImage} className="media-object" alt="" />
								<i className="fab fa-facebook-messenger text-blue media-object-icon"></i>
							</div>
							<div className="media-body">
								<h6 className="media-heading">John Smith</h6>
								<p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
								<div className="text-muted fs-10px">25 minutes ago</div>
							</div>
						</a>
						<a href="javascript:;" className="dropdown-item media">
							<div className="media-left">
								<img src={userImage} className="media-object" alt="" />
								<i className="fab fa-facebook-messenger text-blue media-object-icon"></i>
							</div>
							<div className="media-body">
								<h6 className="media-heading">Olivia </h6>
								<p>Quisque pulvinar tellus sit amet sem scelerisque tincidunt.</p>
								<div className="text-muted fs-10px">35 minutes ago</div>
							</div>
						</a>
						<a href="javascript:;" className="dropdown-item media">
							<div className="media-left">
								<i className="fa fa-plus media-object bg-gray-500"></i>
							</div>
							<div className="media-body">
								<h6 className="media-heading"> New User Registered</h6>
								<div className="text-muted fs-10px">1 hour ago</div>
							</div>
						</a>
						<a href="javascript:;" className="dropdown-item media">
							<div className="media-left">
								<i className="fa fa-envelope media-object bg-gray-500"></i>
								<i className="fab fa-google text-warning media-object-icon fs-14px"></i>
							</div>
							<div className="media-body">
								<h6 className="media-heading"> New Email From John</h6>
								<div className="text-muted fs-10px">2 hour ago</div>
							</div>
						</a>
						<div className="dropdown-footer text-center">
							<a href="javascript:;" className="text-decoration-none">View more</a>
						</div>
					</div>
				</div>
				
				<div className="navbar-item navbar-user dropdown">
					<a href="#" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
						<img src={userImage} alt="" /> 
						<span>
							<span className="d-none d-md-inline">
								👋Hi,{userName}
								</span>
							<b className="caret"></b>
						</span>
					</a>
					<div className="dropdown-menu dropdown-menu-end me-1">
						<a href="extra_profile.html" className="dropdown-item">Edit Profile</a>
						<a href="email_inbox.html" className="dropdown-item d-flex align-items-center">
							Inbox
							<span className="badge bg-danger rounded-pill ms-auto pb-4px">2</span> 
						</a>
						<a href="calendar.html" className="dropdown-item">Calendar</a>
						<a href="extra_settings_page.html" className="dropdown-item">Settings</a>
						<div className="dropdown-divider"></div>
						<a href="javascript:;" onClick={handleLogout} className="dropdown-item">Log Out</a>
					</div>
				</div>
			</div>
		</div>
  );
};

export default Header;

