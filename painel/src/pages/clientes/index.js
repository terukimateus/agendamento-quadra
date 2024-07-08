import { useEffect } from "react";
import TableComponent from "../../components/Table";
import { Button, Drawer, Modal } from "rsuite";
import 'rsuite/Button/styles/index.css'
import "rsuite/dist/rsuite.css"
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import {
    allClientes, 
    updateCliente,
    filterClientes,
    addCliente,
    unlinkCliente
} from '../../store/modules/cliente/actions'
import { removeClass } from "rsuite/esm/DOMHelper";

const Clientes = () => {
    
    const dispatch = useDispatch()
    const {clientes, cliente, form, components, behavior} = useSelector((state) => state.cliente)
    console.log(clientes)
    const setComponent = (component, state) => {
        dispatch(updateCliente({
            components: { ...components, [component]: state }
        }))
    }
    const updateNestedState = (obj, path, value) => {
        const keys = path.split('.')
        const lastKey = keys.pop()
        const deepClone = JSON.parse(JSON.stringify(obj))

        let nestedObj = deepClone
        keys.forEach(key => {
            if (!nestedObj[key]) nestedObj[key] = {}
            nestedObj = nestedObj[key]
        })

        nestedObj[lastKey] = value
        return deepClone
    }

    const setCliente = (path, value) => {
        const updatedCliente = updateNestedState(cliente, path, value)
        dispatch(updateCliente({ cliente: updatedCliente }))
    }

    const save = () => {
        dispatch(addCliente())
    }

    const remove = () => {
        dispatch(unlinkCliente())
    }

    useEffect(() => {
        dispatch(allClientes())
    }, [])


    return (
        <div className="col p-5 overflow-auto h-100">
            <Drawer open={components.drawer} size="sm" onClose={() => setComponent('drawer', false)}>
                <Drawer.Body>
                    <div className="row mt-5 gap-3">
                    <h3 >{behavior === 'create' ? "Criar novo" : "Atualizar"} cliente</h3>
                        <div className="form-group mb-3 col-12">
                            <b>Email</b>
                            <div className="input-group">
                                <input type="email" className="form-control" placeholder="E-mail do cliente" value={cliente.email} onChange={(e) => setCliente('email', e.target.value)} />
                                <div className="input-group-append">
                                    <Button 
                                        appearance="primary" 
                                        loading={form.filtering} 
                                        disabled={form.filtering} 
                                        onClick={() => dispatch(filterClientes())}
                                    >
                                        Pesquisar
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="form-group d-flex w-100 gap-3 col-5">
                            <b>Primeiro nome</b>
                            <input
                                type='text'
                                className="form-control"
                                placeholder="Primeiro Nome"
                                disabled={form.disabled}
                                value={cliente.person?.nome?.first_name || ''}
                                onChange={(e) => setCliente('person.nome.first_name', e.target.value)}
                            />
                            <b>Segundo nome</b>
                            <input
                                type='text'
                                className="form-control"
                                placeholder="Segundo Nome"
                                disabled={form.disabled}
                                value={cliente.person?.nome?.second_name || ''}
                                onChange={(e) => setCliente('person.nome.second_name', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-5">
                            <b>Telefone</b>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Telefone"
                                disabled={form.disabled}
                                value={cliente.person?.telefone || ''}
                                onChange={(e) => setCliente('person.telefone', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-5">
                            <b className="">Data de Nascimento</b>
                            <input
                                type="date"
                                className="form-control"
                                disabled={form.disabled}
                                value={cliente.person?.dataNascimento || ''}
                                onChange={(e) => setCliente('person.dataNascimento', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-5">
                            <b>Sexo</b>
                            <select
                                disabled={form.disabled}
                                className="form-control"
                                value={cliente.sexo}
                                onChange={(e) => setCliente('sexo', e.target.value)}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                        </div>
                        <div className="form-group col-6">
                            <b className="">CPF</b>
                            <input
                                type="text"
                                className="form-control"
                                disabled={form.disabled}
                                value={cliente.person?.documento || ''}
                                onChange={(e) => setCliente('person.documento', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3">
                            <b className="">CEP</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite o CEP"
                                disabled={form.disabled}
                                value={cliente.person?.endereco?.cep || ''}
                                onChange={(e) => setCliente('person.endereco.cep', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-6">
                            <b className="">Rua / Logradouro</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rua / Logradouro"
                                disabled={form.disabled}
                                value={cliente.person?.endereco?.logradouro || ''}
                                onChange={(e) => setCliente('person.endereco.logradouro', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3">
                            <b className="">Número</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Número"
                                disabled={form.disabled}
                                value={cliente.person?.endereco?.numero || ''}
                                onChange={(e) => setCliente('person.endereco.numero', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-3">
                            <b className="">UF</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="UF"
                                disabled={form.disabled}
                                value={cliente.person?.endereco?.estado || ''}
                                onChange={(e) => setCliente('person.endereco.estado', e.target.value)}
                            />
                        </div>
                        <div className="form-group col-9">
                            <b className="">Cidade</b>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cidade"
                                disabled={form.disabled}
                                value={cliente.person?.endereco?.cidade || ''}
                                onChange={(e) => setCliente('person.endereco.cidade', e.target.value)}
                            />
                        </div>
                    </div>
                <Button
                    //disabled={ableToSave(cliente)}
                    block
                    className="btn-lg mt-3"
                    style={behavior === "create" ? {backgroundColor: '#00b87a'} : {backgroundColor: 'red'}}
                    size="lg"
                    loading={form.saving}
                    onClick={() => {
                    if (behavior === 'create') {
                        save();
                    } else {
                        setComponent('confirmDelete', true);
                    }
                    }}
                >
                    {behavior === 'create' ? 'Salvar' : 'Remover'} cliente
                </Button>
                </Drawer.Body>
            </Drawer>
            <Modal
                open={components.confirmDelete}
                onHide={() => setComponent('confirmDelete', false)}
                size="xs"
            >
                <Modal.Body>
                {'  '} Tem certeza que deseja excluir? Essa ação será irreversível!
                </Modal.Body>
                <Modal.Footer>
                <Button loading={form.saving} onClick={() => remove()} color="red">
                    Sim, tenho certeza!
                </Button>
                <Button
                    onClick={() => setComponent('confirmDelete', false)}
                    appearance="subtle"
                >
                    Cancelar
                </Button>
                </Modal.Footer>
            </Modal>
            <div className='row'> 
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-between">
                        <h2 className="mb-4 mt-0">Clientes</h2>
                        <div>
                            <button className="btn btn-primary btn-lg" onClick={() => {
                                dispatch(updateCliente({
                                    behavior: 'create'
                                }))
                                setComponent('drawer', true)
                                }}>
                                <span className="mdi mdi-plus">Novo Cliente</span>
                            </button>
                        </div>
                    </div>
                    <TableComponent  loading={form.filtering} data={clientes} config={[
                        { label: 'Nome', key: 'person.nome.first_name', width: 200, fixed:true},
                        { label: 'Segundo Nome', key: 'person.nome.second_name', width: 200},
                        { label: 'Email', key: 'email', width: 200},
                        { label: 'Telefone', key: 'person.telefone', width: 200},
                        { label: 'Documento', key: 'person.documento', width: 200},
                        { 
                            label: 'Sexo', 
                            content: (item) => item.sexo === 'M' ? 'Masculino' : 'Feminino', 
                            width: 200
                        },
                        { 
                            label: 'Data de Cadastro', 
                            content: (item) => moment(item.dataCadastro).format('YYYY-MM-DD | HH:mm'), 
                            width: 200
                        }
                    ]}
                    actions={(clientes) => (
                        <Button appearance="primary" size="sm">Ver {clientes.firstName}</Button>
                    )}
                    onRowClick={(cliente) => {
                        dispatch(
                            updateCliente({
                                behavior: 'update'
                            })
                        )
                        dispatch(
                            updateCliente({
                                cliente,
                            })
                        )
                        setComponent('drawer', true)
                    } }
                    > 
                    </TableComponent>
                </div>
            </div>

        </div>
    )
}

export default Clientes