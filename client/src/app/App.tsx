import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CardsList from '../features/cards/CardsList';
import CardDescription from '../features/cards/CardDescription'
import Navigation from '../features/navigation/Navigation'
import Coffee from '../features/coffee/Coffee';
import Contacts from '../features/contacts/Contacts';
import Home from '../features/home/Home';
import Login from '../features/login/Login';
import News from '../features/news/News';
import Qr from '../features/qr/Qr';
import Register from '../features/registration/Register';
import Settings from '../features/settings/Settings';

import './App.css';
import './styles/normalize.css'
import './styles/vars.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navigation>
          <Routes>
          
            <Route path="/cards"
              element={<CardsList/>}
            />
            <Route path="/cards/:itemId" 
              element={<CardDescription/>} 
            />
            <Route path="/coffee"
              element={<Coffee/>}
            />
            <Route path="/contacts"
              element={<Contacts/>}
            />
            <Route path="/home"
              element={<Home/>}
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
            <Route path="/settings"
              element={<Settings/>}
            />
            
          </Routes>
        </Navigation>
      </div>
    </Router>
  );
}


export default App;



// useEffect(() => {
//   fetch('/api')
//   .then((res) => res.json())
//   .then((data) => setData(data));
// }, []);

// {/* <p>{!data ? 'Загрузка...' : JSON.stringify(data)}</p> */}

// const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
//   const response = await fetch('/api/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(values),
//   });

//   const data = await response.json();
//   if (response.status === 201) {
//     console.log('Registration successful:', data);
//   } else {
//     console.error('Registration error:', data);
//   }
// };
// const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
//   console.log('Failed:', errorInfo);
// };