import { useEffect, useState } from "react";
import { getUserLanguage } from "../functions/userFunctions";
import { getAllPetsPublic } from "../functions/petFunctions";

const statesOfBrazil = [
    { name: "Acre", uf: "AC" },
    { name: "Alagoas", uf: "AL" },
    { name: "Amapá", uf: "AP" },
    { name: "Amazonas", uf: "AM" },
    { name: "Bahia", uf: "BA" },
    { name: "Ceará", uf: "CE" },
    { name: "Distrito Federal", uf: "DF" },
    { name: "Espírito Santo", uf: "ES" },
    { name: "Goiás", uf: "GO" },
    { name: "Maranhão", uf: "MA" },
    { name: "Mato Grosso", uf: "MT" },
    { name: "Mato Grosso do Sul", uf: "MS" },
    { name: "Minas Gerais", uf: "MG" },
    { name: "Pará", uf: "PA" },
    { name: "Paraíba", uf: "PB" },
    { name: "Paraná", uf: "PR" },
    { name: "Pernambuco", uf: "PE" },
    { name: "Piauí", uf: "PI" },
    { name: "Rio de Janeiro", uf: "RJ" },
    { name: "Rio Grande do Norte", uf: "RN" },
    { name: "Rio Grande do Sul", uf: "RS" },
    { name: "Rondônia", uf: "RO" },
    { name: "Roraima", uf: "RR" },
    { name: "Santa Catarina", uf: "SC" },
    { name: "São Paulo", uf: "SP" },
    { name: "Sergipe", uf: "SE" },
    { name: "Tocantins", uf: "TO" }
];

type StateSelectProp = {
  setPetData: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function StateSelect({setPetData}: StateSelectProp) {
    const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);
    // const [petData, setPetData] = useState<any[]>([]);
    const [region, setRegion] = useState('');

    useEffect(() => {
        const fetchRegion = async () => {
            const regionReturn = await getUserLanguage(); 
            const regionName = statesOfBrazil.find(i => i.name === regionReturn);

            if (regionName) {
                setRegion(regionName.uf); 
            }
        };
        fetchRegion();
    }, []); 

    
    useEffect(() => {
        if (region) {
            getAllPetsPublic(region, setPetData); 
        }
    }, [region]);
   
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedOrigin(selected);
        setRegion(selected.uf); 
    };

    return (
        <div>
            <SelectComponent 
                selectedOrigin={selectedOrigin} 
                handleSelectChange={handleSelectChange} 
            />
        </div>
    );
}

export  function StateSelectNoApi() {
    const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);
   
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedOrigin(selected);
    };

    return (
        <div>
            <SelectComponent 
                selectedOrigin={selectedOrigin} 
                handleSelectChange={handleSelectChange} 
            />
        </div>
    );
}

function SelectComponent({ selectedOrigin, handleSelectChange }: { selectedOrigin: any, handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div>
            <select 
                onChange={handleSelectChange} 
                value={selectedOrigin ? selectedOrigin.name : ''}
            >
                <option value={"initial"}>Selecione um Estado</option>
                {statesOfBrazil.map((origin, i) => (
                    <option key={i} value={JSON.stringify(origin)}>
                        {origin.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
