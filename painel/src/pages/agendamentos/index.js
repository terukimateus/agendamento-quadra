import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import {filterAgendamento} from '../../store/modules/agendamento/actions'
import util from '../../util'
import api from '../../services/api'
import { all, takeLatest, call, put } from 'redux-saga/effects'
import consts from '../../const'

import { InputPicker } from 'rsuite';
import "rsuite/dist/rsuite.css";
const localizer = momentLocalizer(moment)



const Agendamentos = () => {

    const dispatch = useDispatch()

    const { agendamentos } = useSelector((state) => state.agendamento)

    const [quadra, setQuadra] = useState(null)
    const [data, setData] = useState([{ label: 'Todas quadras', value: null }]);


    useEffect(() => {
        const fetchArenaData = async () => {
            try {
                const { data: res } = await api.get('/arena/6682db8b6d68cd9e4b640a7f');
                // Supondo que a resposta contenha as informações necessárias
                const quadrasOptions = res.quadras.map((quadra, index) => ({
                    label: `Quadra ${quadra}`,
                    value: quadra,
                }));
                setData([{ label: 'Todas quadras', value: null }, ...quadrasOptions]);
            } catch (error) {
                console.error('Failed to fetch arena data:', error);
            }
        };

        fetchArenaData();
    }, []);
    const formatEventos = agendamentos.map(agendamento => ({
        title: `Quadra ${agendamento.quadras} - ${agendamento.clienteID.person.nome.first_name} ${agendamento.clienteID.person.nome.second_name}`,
        start: moment(agendamento.data).toDate(),
        end: moment(agendamento.data)
        .add(
          util.hourToMinutes(
            moment(agendamento.servicoID.duracao).format('HH:mm')
          ),
          'minutes'
        )
        .toDate(),
        }
    ))

    const formatRange = ( periodo ) => {
        let finalRange = {}
        if (Array.isArray(periodo)) {
            finalRange = {
                start: moment(periodo[0]).format('YYYY-MM-DD'),
                end: moment(periodo[periodo.length - 1]).format('YYYY-MM-DD')
            }
        } else {
            finalRange = {
                start: moment(periodo.start).format('YYYY-MM-DD'),
                end: moment(periodo.end).format('YYYY-MM-DD')
            }
        }

        return finalRange
    }

    useEffect(() => {
        dispatch(filterAgendamento(
            moment().weekday(0).format('YYYY-MM-DD'),
            moment().weekday(6).format('YYYY-MM-DD'),
            quadra !== null ? [quadra] : null // Transforma em array quando não for null
        ))
    }, [dispatch, quadra])


    return (
        <div className="col p-5 overflow-auto h-100">
            <div className='row'> 
                <div className="col-12">
                    <div className='w-100 d-flex justify-content-between'>
                        <div className='w-100 d-flex justify-content-between'>
                            <h2 className="mb-4 mt-0">Agendamentos</h2>
                            <InputPicker data={data} style={{ width: 224, height: 40 }} onChange={setQuadra}
                            />
                        </div>
                    </div>
                    <Calendar
                        onRangeChange={(periodo) => {
                            const { start, end } = formatRange(periodo)
                            dispatch(filterAgendamento(start, end, quadra))
                        }}
                        localizer={localizer}
                        events={formatEventos}
                        selectable
                        popup
                        defaultView="week"
                        style={{ height: 600 }}
                    />
                </div>
            </div>

        </div>
    )
}

export default Agendamentos