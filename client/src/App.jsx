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


import { useEffect, useState} from 'react';
import Header from '../src/Components/Layout/Header';
import Footer from '../src/Components/Layout/Footer';
import MenuSidebar from '../src/Components/Layout/MenuSide';
import Content from './router';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const pathName = location.pathname;
  const [path, setPath] = useState(pathName);


  useEffect(() => {
    setPath(pathName);
  }, [pathName]);

  return (
    <>
      {path === '/login' || path === '/open' ? (
        <Content />
      ) : (
        <div id="app" className="app app-header-fixed app-sidebar-fixed">
          <Header />
          <MenuSidebar />
          <Content />
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;

