import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '../features/navigation/Navigation'
import AdminCoffee from '../features/coffee/Admin-coffee';
import UserCoffee from '../features/coffee/User-coffee';
import Contacts from '../features/contacts/Contacts';
import Home from '../features/home/Home';
import Product from '../features/home/Product';
import Login from '../features/login/Login';
import News from '../features/news/News';
import Qr from '../features/qr/Qr';
import Register from '../features/registration/Register';
import AdminSettings from '../features/settings/AdminSettings';
import AddAdmin from '../features/settings/AddAdmin';
import AddFriend from '../features/settings/AddFriend';
import AddProduct from '../features/settings/AddProduct';
import UserSettings from '../features/settings/UserSettings';
import Token from '../features/tokens/Token';

import './App.css';
import './styles/normalize.css'
import './styles/vars.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation>
          <Routes>
          
            <Route path="/" 
              element={<Navigate to="/home" />}
            />
            <Route path="/activate/:token"
              element={<Token/>}
            />
            <Route path="/admin-coffee"
              element={<AdminCoffee/>}
            />
            <Route path="/user-coffee/:login"
              element={<UserCoffee/>}
            />
            <Route path="/contacts"
              element={<Contacts/>}
            />
            <Route path="/home"
              element={<Home/>}
            />
              <Route path="/home/:productTitle"
                element={<Product/>}
              />
            <Route path="/login"
              element={<Login/>}
            />
            <Route path="/news"
              element={<News/>}
            />
            <Route path="/qr"
              element={<Qr/>}
            />
            <Route path="/register"
              element={<Register/>}
            />

            <Route path="/admin-settings"
              element={<AdminSettings/>}
            />
              <Route path="/admin-settings/add-product"
                element={<AddProduct/>}
              />
              <Route path="/admin-settings/add-admin"
                element={<AddAdmin/>}
              />
              <Route path="/admin-settings/add-friend"
                element={<AddFriend/>}
              />
            <Route path="/user-settings"
              element={<UserSettings/>}
            />
            
          </Routes>
        </Navigation>
      </div>
    </Router>
  );
}
export default App;