import Header from '../src/Components/Layout/Header';
import Footer from '../src/Components/Layout/Footer';
import MenuSidebar from '../src/Components/Layout/MenuSide';
import Content from './router';

function App() {
  return (
    <div id="app" className="app app-header-fixed app-sidebar-fixed">
      <Header />
      <MenuSidebar />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
