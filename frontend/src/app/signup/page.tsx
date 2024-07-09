'use client'
import React, { useState } from "react";
import Link from "next/link";
import { Modal } from 'rsuite'
import "rsuite/dist/rsuite.css"
import { FiCheckCircle } from "react-icons/fi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState("M");
    const [documento, setDocument] = useState("")

    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [cep, setCep] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [bairro, setBairro] = useState("")
    const [numero, setNumero] = useState("")
    const [pais, setPais] = useState("")
    
    const [modal, setModal] = useState(false)
    const handleOpen = () => setModal(true);
    const handleClose = () => {
        setModal(false);
        window.location.href = `${window.location.origin}/home`;     
    };

    const handleCep = async (ceps) => {
        if(ceps.length == 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${ceps}/json/`);
                const data = await res.json(); // Await the promise here
                
                setLogradouro(data.logradouro);
                setBairro(data.bairro);
                setCidade(data.localidade);
                setEstado(data.uf);
            } catch (error) {
                console.error('Error fetching CEP data:', error);
            }
        } 
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'birthdate':
                setBirthdate(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            case 'gender':
                setGender(value);
                break;
            case 'documento':
                setDocument(value)
                break
            case 'cidade':
                setCidade(value)
                break
            case 'cep':
                setCep(value)
                handleCep(value)
                break
            case 'logradouro':
                setLogradouro(value)
                break
            case 'bairro':
                setBairro(value)
                break
            case 'estado':
                setEstado(value)
                break
            case 'numero':
                setNumero(value)
                break
            default:
                break;
        }
    };
    
    const signin = async () => {
        try {
            const requestData = {
                cliente: {
                    email,
                    senha: password,
                    person: {
                        nome: {
                            first_name: firstName,
                            second_name: lastName,
                        },
                        dataNascimento: birthdate,
                        telefone: phoneNumber,
                        documento,
                        endereco: {
                            cidade: cidade,
                            estado: estado,
                            cep: cep,
                            logradouro: logradouro,
                            bairro: bairro,
                            numero: numero,
                            pais: 'Brasil',
                        }
                    },
                    sexo: gender
                },
                arenaID: '6682db8b6d68cd9e4b640a7f'
            };

            const response = await fetch('https://agendamento-azure.vercel.app/cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            // Handle response as needed
            const data = await response.json();
            console.log('Signup response:', data);
            handleOpen()

            // Redirect or handle success based on response
        } catch (error) {
            console.error('Erro ao criar conta:', error);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Verificar se todos os campos estão preenchidos antes de enviar
        if (email && password && firstName && lastName && birthdate && phoneNumber && gender &&document) {
            signin();
        } else {
            console.error('Por favor, preencha todos os campos.');
        }
    };

    return(
        <div className="w-full h-screen flex items-center justify-center flex-col py-4">
            <div className="flex items-center justify-center gap-10 flex-col md:flex-col w-10/12 h-full md:w-5/12">
                <div className="flex w-full flex-col md:text-start text-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold">Agendamento de Quadras</h1>
                        <span>Crie sua conta!</span>
                    </div>

                    <div className="flex flex-col ">
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                            <input className="border border-1 border-neutral-400 p-4" type="email" name="email" placeholder="E-mail" value={email} onChange={handleChange} required />
                            <input className="border border-1 border-neutral-400 p-4" type="password" name="password" placeholder="Sua senha" value={password} onChange={handleChange} required />
                            <div className="w-full flex gap-2 justify-between">
                                <input className="w-full border border-1 border-neutral-400 p-4" type="text" name="firstName" placeholder="Primeiro Nome" value={firstName} onChange={handleChange} required />
                                <input className="w-full border border-1 border-neutral-400 p-4" type="text" name="lastName" placeholder="Segundo Nome" value={lastName} onChange={handleChange} required />
                            </div>
                            <label htmlFor="birthdate">Sua data de Nascimento</label>
                            <input className="border border-1 border-neutral-400 p-4" type="date" id="birthdate" name="birthdate" placeholder="Data de Nascimento" value={birthdate} onChange={handleChange} required />
                            <div className="w-full flex gap-2 justify-between">
                                <input className="w-full border border-1 border-neutral-400 p-4" type="tel" name="phoneNumber" placeholder="Celular" value={phoneNumber} onChange={handleChange} required />
                                <input className="w-full border border-1 border-neutral-400 p-4" type="" name="documento" placeholder="Seu CPF" value={documento} onChange={handleChange} required />
                            </div>
                            <select className="border border-1 border-neutral-400 p-4 bg-transparent" name="gender" id="gender" value={gender} onChange={handleChange} required>
                                <option selected value='M'>Masculino</option>
                                <option value='F'>Feminino</option>
                            </select>
                            <div className="w-full flex gap-2 justify-between">
                                <input className="w-full border border-1 border-neutral-400 p-4" type="number" name="cep" placeholder="Seu CEP" value={cep} onChange={handleChange} required />
                                <input className="w-full border border-1 border-neutral-400 p-4" type="" name="estado" placeholder="Seu estado" value={estado} onChange={handleChange} required />
                            </div>
                            <div className="w-full flex gap-2 justify-between">
                                <input className="w-full border border-1 border-neutral-400 p-4" type="" name="cidade" placeholder="Sua cidade" value={cidade} onChange={handleChange} required />
                                <input className="w-full border border-1 border-neutral-400 p-4" type="" name="logradouro" placeholder="Sua rua" value={logradouro} onChange={handleChange} required />
                            </div>
                            <div className="w-full flex gap-2 justify-between">
                                <input className="w-full border border-1 border-neutral-400 p-4" type="" name="bairro" placeholder="Seu bairro" value={bairro} onChange={handleChange} required />
                                <input className="w-full border border-1 border-neutral-400 p-4" type="number" name="numero" placeholder="Seu número do endereço" value={numero} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="w-full py-3 bg-emerald-400 rounded-xl hover:scale-105 duration-500">Criar conta</button>
                        </form>
                    </div>
                        <Link className="text-slate-700"href="/login">
                            Já possui uma conta? Clique aqui!
                        </Link>
                </div>
                <Modal open={modal} onClose={handleClose}>
                    <Modal.Header>
                    <span className="flex items-center gap-2 text-xl text-green-500"><FiCheckCircle /> Sucesso</span>
                    </Modal.Header>
                <Modal.Body>
                    Sua conta foi criada com sucesso!
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose} >
                    Login
                    </button>
                </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}