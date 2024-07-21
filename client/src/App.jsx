import React from 'react'
import {BrowserRouter,Routes , Route} from "react-router-dom"
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateEvent from './pages/CreateEvent';
import UpdateEvent from './pages/UpdateEvent';

export default function App() {
  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/about' element={<About />} />
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-event' element={<CreateEvent />} />
        <Route path='/update-event/:eventId' element={<UpdateEvent />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}
