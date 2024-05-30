import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CardsList from '../features/cards/CardsList';
import CardDescription from '../features/cards/CardDescription'
import Navigation from '../features/navigation/Navigation'

import './App.css';
import './styles/normalize.css'
import './styles/vars.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/"
            element={<Navigation/>}
          />
          <Route path="/cards"
            element={<CardsList/>}
          />
          <Route path="/cards/:itemId" 
            element={<CardDescription/>} 
          />
        </Routes>
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