import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { filterArena, updateArena } from "../../store/modules/arena/actions";
import consts from '../../const';
import { useNavigate } from 'react-router-dom';
import { Notification, useToaster } from 'rsuite';

const Arena = () => {
    const dispatch = useDispatch();
    const arena = useSelector((state) => state.arena.arena);
    const [localArena, setLocalArena] = useState(arena);
    const navigate = useNavigate();
    const toaster = useToaster();

    useEffect(() => {
        dispatch(filterArena(consts.arenaID));
    }, [dispatch]);

    useEffect(() => {
        setLocalArena(arena);
    }, [arena]);

    const handleChange = (field, value) => {
        let newValue = value;

        if (field === 'quadras') {
            // Apenas atualiza a string no estado local
            newValue = value;
        }

        const fieldParts = field.split('.');
        if (fieldParts.length > 1) {
            setLocalArena(prevState => {
                let newState = { ...prevState };
                let current = newState;

                for (let i = 0; i < fieldParts.length - 1; i++) {
                    if (!current[fieldParts[i]]) {
                        current[fieldParts[i]] = {};
                    } else {
                        current[fieldParts[i]] = { ...current[fieldParts[i]] };
                    }
                    current = current[fieldParts[i]];
                }

                current[fieldParts[fieldParts.length - 1]] = newValue;
                return newState;
            });
        } else {
            setLocalArena(prevState => ({
                ...prevState,
                [field]: newValue
            }));
        }
    }

    const handleSave = () => {
        // Converte 'quadras' para um array de números ao salvar
        const quadrasToUpdate = localArena.quadras && typeof localArena.quadras === 'string'
            ? localArena.quadras.split(',')
                .map(numStr => {
                    const num = parseInt(numStr.trim(), 10);
                    return isNaN(num) ? undefined : num;
                })
                .filter(num => num !== undefined)
            : localArena.quadras;

        const arenaToSave = {
            ...localArena,
            quadras: quadrasToUpdate
        };
        dispatch(updateArena(arenaToSave));
        navigate('/');
        alert('Alterado com sucesso')
        };

    return (
        <div className="col p-5 overflow-auto h-100">
            <h1>Arena: {arena?.nome}</h1>
            <div className="row mt-5 gap-3">
                <div className="form-col col-6">
                    <b>Nome da Arena</b>
                    <input 
                        type="text" 
                        value={localArena?.nome || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('nome', e.target.value)}
                    />
                </div>
                <div className="form-col col-6">
                    <b>Quadras</b>
                    <input 
                        type="text" 
                        value={localArena?.quadras || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('quadras', e.target.value)}
                    />
                </div>
                <div className="d-flex row">
                    <div className="col-4">
                        <b>Rua</b>
                        <input 
                        type="text" 
                        value={localArena?.endereco?.rua || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('endereco.rua', e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <b>Número</b>
                        <input 
                        type="text" 
                        value={localArena?.endereco?.numero || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('endereco.numero', e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <b>Cidade</b>
                        <input 
                        type="text" 
                        value={localArena?.endereco?.cidade || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('endereco.cidade', e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <b>UF</b>
                        <input 
                        type="text" 
                        value={localArena?.endereco?.uf || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('endereco.uf', e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <b>CEP</b>
                        <input 
                        type="text" 
                        value={localArena?.endereco?.cep || ''} 
                        className="form-control" 
                        onChange={(e) => handleChange('endereco.cep', e.target.value)}
                        />
                    </div>
                </div>
                {/* Adicione outros campos conforme necessário */}
                <button className="btn btn-primary mt-3" onClick={handleSave}>
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default Arena;
