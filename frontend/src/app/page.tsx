'use client'
import React, { useEffect, useState } from "react";
import Link from 'next/link';

const checkAuth = () => {
  const token = localStorage.getItem('token');

  if (token) {
    // Redireciona para a página de login se não houver token
    window.location.href = `${window.location.origin}/home`;  }
  
};

export default function HomeApp() {
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col py-4">
      <div className="flex items-center justify-center gap-10 flex-col w-full h-full md:w-3/12">
        <h1 className="text-xl font-bold">Agendamento de Quadras</h1>
        <div className="flex flex-col gap-2">
          <Link className="px-10 py-2 bg-emerald-400 rounded-lg justify-center flex" href="/login">
            <button>Login</button>
          </Link>
          <Link className="text-slate-700"href="/signup">
            Ainda não tem uma conta? Crie aqui!
          </Link>
        </div>
      </div>
    </div>
  )
}
