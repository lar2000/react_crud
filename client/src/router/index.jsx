import { Routes, Route, Navigate } from 'react-router-dom';
import Booking from '../Components/Pages/Admin/Booking/BookingList';
import CheckIn from '../Components/Pages/Admin/Check-in/CheckIn';
import Staff from '../Components/Pages/Admin/Staff/Staff';
import Customer from '../Components/Pages/Admin/Customer/Customer';
import ImportProd from '../Components/Pages/Admin/Product/ImportProduct';
import Product from '../Components/Pages/Admin/Product/Product';
import Set_Product from '../Components/Pages/Admin/Product/Set_Product';
import ServiceType from '../Components/Pages/Admin/Service/ServiceType';
import Service from '../Components/Pages/Admin/Service/Service';
import Package from '../Components/Pages/Admin/Service/Package';
import RoomType from '../Components/Pages/Admin/Room/RoomType';
import Room from '../Components/Pages/Admin/Room/Room';
import HomePage from '../Components/Pages/Home/Home';

export default function Content() {
    return (
            <Routes>
            <Route path="/" element={<Navigate replace to={'home'} />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/checkIn" element={<CheckIn />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/importproduct" element={<ImportProd />} />
            <Route path="/product" element={<Product />} />
            <Route path="/set_product" element={<Set_Product />} />
            <Route path="/service_type" element={<ServiceType />} />
            <Route path="/service" element={<Service />} />
            <Route path="/package" element={<Package />} />
            <Route path="/roomtype" element={<RoomType />} />
            <Route path="/room" element={<Room />} />
            </Routes>
    );
}
