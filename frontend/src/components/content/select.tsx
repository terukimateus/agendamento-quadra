import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const SelectComponent = ({setCourt, quadras}) => {

    return(
        <Select onValueChange={setCourt}>
            <SelectTrigger className="w">
            <SelectValue placeholder="Escolha sua quadra" />
            </SelectTrigger>
            <SelectContent>
                {quadras.map((value, index) => ( // Adicione um return explícito ou use uma sintaxe que implica um retorno implícito
                    <SelectItem value={value} key={index}>Quadra {value}</SelectItem>
                ))}
            </SelectContent>
      </Select>
    )
}

export default SelectComponent