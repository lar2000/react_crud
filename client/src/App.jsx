import { useEffect, useState, useRef } from 'react';
import Header from '../src/Components/Layout/Header';
import Footer from '../src/Components/Layout/Footer';
import MenuSidebar from '../src/Components/Layout/MenuSide';
import Content from './router';
import _ from 'lodash';
import { Config } from '../src/config/connection';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const api = Config.ApiURL;
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const [path, setPath] = useState(pathName);
  const [minified, setMinified] = useState(false);
  const routes = ['/r-sale', '/received'];

  const token = localStorage.getItem('token');

  const resizeRef = useRef(null);

  useEffect(() => {
    checkToken();
    setPath(pathName);

    if (_.includes(routes, pathName)) {
      setMinified(true);
    } else {
      setMinified(false);
    }
  }, [pathName, token]);

  const checkToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await axios.post(`${api}/checklogin/authen`,{}, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status !== 200) {
          navigate('/login');
        }
      } catch (error) {
        console.log('Error during token authentication:', error);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {path === '/login' || path === '/open' ? (
        <Content />
      ) : (
        <div ref={resizeRef} id="app" className="app app-header-fixed app-sidebar-fixed">
          <Header />
          <MenuSidebar minified={minified} />
          <Content />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
