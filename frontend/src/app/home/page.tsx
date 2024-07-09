'use client'
import React, { useEffect, useState } from "react";
import SelectComponent from '../../components/content/select';
import CalendarComponent from "../../components/content/calendar";
import { FiCheckCircle } from "react-icons/fi";
import { useAuth } from '../../api/auth';
import mercadopago from '../../api/mercadopago';
import "rsuite/dist/rsuite.css";

const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user')

  if (!token && !user ) {
    window.location.href = `${window.location.origin}/login`;  
  }
};

export default function Home() {
  const { user, logout } = useAuth();
  const [arena, setArena] = useState({
    _id: "",
    endereco: {
      cidade: "",
      rua: "",
      uf: "",
      cep: "",
      numero: "",
    },
    nome: "Arena",
    telefone: "",
    coordenadas: [-23.4490604, -51.9604743],
    quadras: [1],
    distance: 2.0209292912844306,
  });

  useEffect(() => {
    const reqArena = async () => {
      try {
        const response = await fetch('https://agendamento-azure.vercel.app/arena/6682db8b6d68cd9e4b640a7f');
        const data = await response.json();
        setArena(data);
      } catch (err) {
        console.error('Failed to fetch arena data', err.message);
      }
    };
    reqArena();
  }, []);

  const [cliente, setCliente] = useState(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [court, setCourt] = useState(null);
  const [horasDisponiveis, setHorasDisp] = useState<string[]>([]);
  const [horaSelecionada, setHoraSelecionada] = useState<string | null>(null);
  const [transferStatus, setTransferStatus] = useState<string | null>(null);
  const [agendamento, setAgendamento] = useState(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    checkAuth();
    if (user) {
      setCliente(user);
    }
  }, [user]);

  useEffect(() => {
    const reqHorarios = async () => {
      if (court && date) {
        try {
          const requestData = {
            data: date.toISOString().split('T')[0],
            arenaID: arena._id,
            servicoID: '667db3b4524787cc6dd8b13f',
            quadras: court,
          };

          const response = await fetch('https://agendamento-azure.vercel.app/agendamento/dias-disponiveis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });

          const data = await response.json();
          if (!data.error) {
            const horarios = data.agenda.flatMap((item) => item.horarios);
            setHorasDisp(horarios);
          } else {
            console.error('Erro ao buscar horários disponíveis:', data.message);
          }
        } catch (error) {
          console.error('Erro ao fazer a requisição:', error);
        }
      }
    };
    reqHorarios();
  }, [court, date]);

  const handleTimeClick = (time) => {
    if (time === horaSelecionada) {
      setHoraSelecionada(null);
    } else {
      setHoraSelecionada(time);
    }
  };

  const handleAgendamento = () => {
    const criarAgendamento = async () => {
      try {
        const dateWithTime = new Date(date);
        const [hours, minutes] = horaSelecionada.split(':');
  
        // Ajuste da hora, minuto, segundo e milissegundo
        dateWithTime.setHours(parseInt(hours, 10));
        dateWithTime.setMinutes(parseInt(minutes, 10));
        dateWithTime.setSeconds(0);
        dateWithTime.setMilliseconds(0);
  
        // Corrige o problema do fuso horário
        const localOffset = dateWithTime.getTimezoneOffset() * 60000;
        const correctedDate = new Date(dateWithTime.getTime() - localOffset);
  
        const requestData = {
          clienteID: cliente._id,
          data: correctedDate.toISOString(),
          arenaID: arena._id,
          servicoID: '667db3b4524787cc6dd8b13f',
          quadras: court,
        };
        const response = await fetch('https://agendamento-azure.vercel.app/agendamento/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.agendamentos && data.agendamentos.transactionID) {
          setAgendamento(data);
          setTransferStatus('pending');
          verificarPagamento(data.agendamentos.transactionID, data.agendamentos._id);
        } else {
          console.error('Transaction ID not found in response');
        }
      } catch (err) {
        console.error('Erro ao criar agendamento:', err);
      }
    };
    criarAgendamento();
  };

  const verificarPagamento = async (transferId, agendamentoId) => {
    try {
      while (transferStatus !== 'approved') {
        const response = await mercadopago.get(`/payments/${transferId}`);

        if (response.data.status === 'approved') {
          await fetch(`https://agendamento-azure.vercel.app/agendamento/${agendamentoId}`, {
            method: 'PUT',
          });
          setTransferStatus('approved')
          break;
        } else {
          console.log('Pagamento ainda não aprovado. Verificando novamente em 5 segundos.');
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
    }
  };

  return (
    <main>
      <div className="w-full h-screen flex items-center flex-col py-4">
        <div className="w-8/12 items-center flex justify-between">
            {cliente && <span>Bem vindo, {cliente.person.nome.first_name}</span>}
            <button onClick={handleLogout}>Logout</button>
        </div>
        
        <div className="w-full h-full flex flex-col py-16 items-center">
              <span className="text-xl font-black py-4">{arena.nome || 'Nome da Arena'}</span>

              {agendamento ? (
                    <div className="flex  w-8/12 flex-col justify-center items-center text-center py-10">
                      {transferStatus == 'pending' ? (
                        <div className="flex w-full flex-col items-center gap-10">
                          <span>Seu agendamento sera efetuado apenas após o pagamento.</span>
                          <span>Valor {agendamento.payment.transaction_amount} R$</span>
                          <img style={{width: '10rem'}} className="object-fit border-none w-6/12" src={`data:image/jpeg;base64,${agendamento.payment.point_of_interaction.transaction_data.qr_code_base64}`} alt="QR Code" /> 
                          <span>O QR Code tem válidade de 30 minutos</span>
                          <span className="break-all">{agendamento.payment.point_of_interaction.transaction_data.qr_code}</span>
                        </div>

                      ) : (
                        <div className="flex flex-col gap-4">
                          <span className="flex items-center gap-3 text-xl"><FiCheckCircle size='2em' style={{color: "green"}}/> Seu agendamento foi feito com sucesso!</span>
                          <span className="text-xl">{agendamento.agendamentos.data}</span>
                          <span className="text-xl">Quadra {agendamento.agendamentos.quadras}</span>
                          <button onClick={() => {
                            window.location.reload()
                          }}>Voltar</button>
                        </div>
                      )}
                    </div>  
                  ) : ( 
                    <>
                    <div className="w-8/12 flex items-center flex-col gap-5">
                    <div>
                      <CalendarComponent date={date} setDate={setDate} />
                    </div>
                    {arena && ( // Verifica se arena está definido antes de passar para o SelectComponent
                      <SelectComponent setCourt={setCourt} quadras={arena.quadras} />
                    )}
                    </div>
                    <div className="w-8/12 flex items-center flex-col py-4">
                      <span className="text-xl font-bold">Quadra {court} | {date?.toLocaleDateString()}</span>
                      <div className="shrink-0 bg-border h-[1px] w-full my-4"></div>
                        {horasDisponiveis.length > 0 ? (
                          <>
                            <span className="text-xl font-bold">Horarios Disponiveis</span>
                            <div className="grid grid-cols-3 py-4 gap-3">
                              {horasDisponiveis.map((time, index) => (
                                <button className={`p-3 rounded-xl text-base duration-500 ${horaSelecionada === time ? 'bg-emerald-400' : 'bg-neutral-300'}`}
                                value={time}
                                key={index}
                                onClick={() => handleTimeClick(time)}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                            <button className="p-4 text-md bg-emerald-400 rounded-xl hover:scale-105 duration-500" onClick={handleAgendamento}>Agendar</button>
                          </>
                        ) :  <span className="text-lg font-bold">Sem horários disponíveis</span>}
                        </div>
                      </>
                      )
                }
         </div>
      </div>
    </main>
  );
}
