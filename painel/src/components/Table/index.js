import { Table, Button } from 'rsuite';
import 'rsuite/Table/styles/index.css';


const {Column, HeaderCell, Cell} = Table

const TableComponent = ({data, config, actions, content, loading, onRowClick}) => {
       return ( 
        <Table
            height={400}
            data={data}
            onRowClick={onRowClick}
            loading={loading}
            >
                {config.map((c) => (
                    <Column flexGrow={!c.width ? 1 : 0} width={c.width} fixed={c.fixed}>
                    <HeaderCell>{c.label}</HeaderCell>
                    {!c.content ? (
                        <Cell dataKey={c.key}/> 
                ): (
                    <Cell>
                        {(item) => c.content(item)}
                    </Cell> )
                    }
                </Column>
                ))}
                <Column width={150} fixed="right">
                    <HeaderCell>Ações</HeaderCell>
                    <Cell>
                        {(item) => actions(item)}
                    </Cell>
                </Column>
        </Table>
       )
}

export default TableComponent