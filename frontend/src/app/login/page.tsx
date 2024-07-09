'use client'
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  const { login } = useAuth();

  useEffect(() => {
    // Definir valores iniciais para email e senha caso estejam preenchidos automaticamente pelo navegador
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement | null;
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement | null;
  
    if (emailInput && passwordInput) {
      setEmail(emailInput.value);
      setPassword(passwordInput.value);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = await login(email, password);
    if (errorMessage) {
      setError(errorMessage); // Set the error message
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col py-4">
      <div className="flex items-center justify-center gap-10 flex-col md:flex-col w-10/12 h-full md:w-5/12">
        <div className="flex w-full flex-col text-center items-center gap-10">
          <div>
            <h1 className="text-xl font-bold">Agendamento de Quadras</h1>
            <span>Entre na sua conta!</span>
          </div>
          <div className="flex flex-col text-start md:w-6/12 ">
            <span style={{color: 'red'}}>{error}</span>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                className="border border-1 border-neutral-400 p-4"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="border border-1 border-neutral-400 p-4"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-full py-3 bg-emerald-400 rounded-xl hover:scale-105 duration-500" type="submit">
                Login
              </button>
            </form>
          </div>
        </div>
        <Link className="text-slate-700" href="/signup">
          Ainda não tem uma conta? Crie aqui!
        </Link>
      </div>
    </div>
  );
}
