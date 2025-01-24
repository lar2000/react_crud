import { Routes, Route,Navigate } from 'react-router-dom';
import Staff from '../Components/Pages/Admin/Staff/Staff';
import Customer from '../Components/Pages/Admin/Customer/Customer';
import Product from '../Components/Pages/Admin/Product/Product';
import HomePage from '../Components/Pages/Home/Home';

export default function Content() {
    return (
            <Routes>
            <Route path="/" element={<Navigate replace to={'home'} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/product" element={<Product />} />
            </Routes>
    );
}
