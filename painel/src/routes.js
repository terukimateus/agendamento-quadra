import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/header'
import Sidebar from './components/sidebar'
import './styles.css'

import Agendamentos from './pages/agendamentos'
import Clientes from './pages/clientes'
import Arena from './pages/arena'

const AppRoutes = () => {
    return (
        <>
            <div className='container-fluid h-100'>
                <div className="row h-100">
                    <Router>
                        <Header />
                        <Sidebar />
                        <Routes>
                            <Route path="/" element={<Agendamentos />} />
                            <Route path="/clientes" element={<Clientes />} />
                            <Route path='/arena' element={<Arena/>} />
                        </Routes>
                    </Router>
                </div>
            </div>
        </>
    )
}

export default AppRoutes
