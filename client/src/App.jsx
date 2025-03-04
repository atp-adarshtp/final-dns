
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import Header from './components/Header'
import Home from './pages/home/Home'
import DNS from './pages/dns/Dashboard'
import Profile from './pages/home/Profile'
import Login from './pages/login/Login'
import Register from './pages/login/Register'

function App() {

  return (
    <Router>
        <AuthProvider>
          <Header/>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/dns" element={<DNS/>}/>
            </Route>
          </Routes>
        </AuthProvider>
    </Router>
  )
}

export default App
