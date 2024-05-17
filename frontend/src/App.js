import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Terms from './pages/Terms & Policies/Terms';
import Login from './pages/Login/Login';
import AllItems from './pages/All Items/AllItems';
import NotFound from './pages/404 Not Found/NotFound';
import Profile from './pages/Profile/Profile';
import MyItems from './pages/Profile/MyItems';
import Messages from './pages/Profile/Messages';
import Help from './pages/Profile/Help';
import Feedback from './pages/Profile/Feedback';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import AddItem from './pages/Add Item/AddItem';
import SingleItem from './pages/SingleItem/SingleItem';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminItems from './pages/Admin/Items';
import AdminHistory from './pages/Admin/History';
import AdminUsers from './pages/Admin/Users';
import AdminMessages from './pages/Admin/Messages';
import AdminSingleItem from './pages/Admin/SingleItem';
import AdminSingleUser from './pages/Admin/SingleUser';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/all-items" element={<AllItems />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/messages" element={<Messages/>} />
        <Route path="/help" element={<Help />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/view-details" element={<SingleItem />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-items" element={<AdminItems />} />
        <Route path="/admin-history" element={<AdminHistory />} />
        <Route path="/admin-messages" element={<AdminMessages />} />
        <Route path="/admin-single-item" element={<AdminSingleItem />} />
        <Route path="/admin-single-user/:userId" element={<AdminSingleUser />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
