import { Link } from 'react-router-dom';
import { Dropdown, Avatar } from 'rsuite';

const renderToggle = props => (
    <Avatar circle {...props} src="https://i.pravatar.cc/150?u=git@rsutiejs.com" />
  );

const Header = () => {
    return (
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center gap-2">
                <Dropdown renderToggle={renderToggle}>
                    <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
                    <p>Logado como</p>
                    <strong>EuroBeach</strong>
                    </Dropdown.Item>
                    <Dropdown.Separator />
                    <Link to='/arena'>
                        <Dropdown.Item>Configurações</Dropdown.Item>
                    </Link>
                </Dropdown>
                <div>
                    <span className="d-block m-0 p-0 text-white">Arena EuroBeach</span>
                    <small className="m-0 p-0 text-warning">Plano Gold</small>
                </div>
            </div>
        </header>
    )
}

export default Header