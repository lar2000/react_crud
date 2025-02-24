/* eslint-disable no-constant-binary-expression */
// import Header from '../src/Components/Layout/Header';
// import Footer from '../src/Components/Layout/Footer';
// import MenuSidebar from '../src/Components/Layout/MenuSide';
// import Content from './router';

// function App() {
//   return (
//     <div id="app" className="app app-header-fixed app-sidebar-fixed">
//       <Header />
//       <MenuSidebar />
//       <Content />
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { useEffect, useState, useRef} from 'react';
import Header from '../src/Components/Layout/Header';
import Footer from '../src/Components/Layout/Footer';
import MenuSidebar from '../src/Components/Layout/MenuSide';
import Content from './router';
import _ from 'lodash';
import { useLocation,useNavigate } from 'react-router-dom';

function App() {
  const resizeRef = useRef(null);
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);
  const [minified,setMinified]=useState(false);
  const routes=['/r-sale', '/received']
  const navigate = useNavigate();
  const token=localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    setPath(pathName);
    if(_.includes(routes,path)){
      setMinified(true);
    }
  }, [navigate, path, pathName, routes, token]);

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

