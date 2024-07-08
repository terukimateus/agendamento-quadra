import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {
    const location = useLocation()
    
    return (
        <sidebar className='col-2 h-100'>
            <ul className="py-4">
                <li>
                    <Link className={`a-sidebar ${location.pathname === '/' ? 'active' : ''}`} to="/">
                        <span className="mdi mdi-calendar-check"/>
                        <text>Agendamentos</text>
                    </Link>
                </li>
                <li>
                    <Link className={`a-sidebar ${location.pathname === '/clientes' ? 'active' : ''}`} to="/clientes">
                        <span className="mdi mdi-account-multiple"/>
                        <text>Clientes</text>
                    </Link>
                </li>
            </ul>
        </sidebar>
    )
}

export default Sidebar
