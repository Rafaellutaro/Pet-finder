import { useEffect, useState } from "react";
import { getUserLanguage } from "../functions/userFunctions";
import { getAllPetsPublic } from "../functions/petFunctions";
import {statesOfBrazil, petType, ageRanges} from "../../Interfaces/usefulPetInterface"

type StateSelectProp = {
    setPetData: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function StateSelect({ setPetData }: StateSelectProp) {
    const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);
    // const [petData, setPetData] = useState<any[]>([]);
    const [region, setRegion] = useState('');
    const [apiRegion, setApiRegion] = useState('');

    useEffect(() => {
        const fetchRegion = async () => {
            const regionReturn = await getUserLanguage();
            const regionName = statesOfBrazil.find(i => i.name === regionReturn);

            if (regionName) {
                setApiRegion(regionName.uf);
            }
        };
        fetchRegion();
    }, []);


    useEffect(() => {
        if (apiRegion) {
            getAllPetsPublic(apiRegion, undefined!,undefined!, undefined!, "10", undefined!, setPetData);
        }
    }, [apiRegion]);

    useEffect(() => {
        console.log(region)
        console.log(selectedOrigin)
    }, [region]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedOrigin(selected);
        setRegion(selected.uf);
    };

    return (
        <>
            <SelectComponent
                handleSelectChange={handleSelectChange}
            />
            <button>Procurar</button>
        </>
    );
}

type StateSelectNoApiProps = {
    setSelectedOrigin: React.Dispatch<any>;
    setSelectedType: React.Dispatch<any>;
    setSelectedAge: React.Dispatch<any>;
};

export function StateSelectNoApi({ setSelectedOrigin, setSelectedType, setSelectedAge }: StateSelectNoApiProps) {
    // const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);

    const handleSelectChange = (type: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);

        console.log(selected)

        switch(type){
            case "origin":
                setSelectedOrigin(selected.uf);
                break;
            case "type":
                setSelectedType(selected.type);
                break
            case "age":
                setSelectedAge(selected);
                break
            default:
                break;
        }
        
    };

    return (
        <>
            <div className="state-category">
                <SelectComponent
                    handleSelectChange={handleSelectChange("origin")}
                />
            </div>

            <div className="breed-category">
                <TypeComponent 
                    handleSelectChange={handleSelectChange("type")}
                />
            </div>

            <div className="age-category">
                <AgeComponent
                    handleSelectChange={handleSelectChange("age")}
                />
            </div>
        </>
    );
}

function SelectComponent({ handleSelectChange }: { handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div>
            <select
                onChange={(e) => handleSelectChange(e)}
            >
                <option value={JSON.stringify('undefined')}>Selecione um Estado</option>
                {statesOfBrazil.map((origin, i) => (
                    <option key={i} value={JSON.stringify(origin)}>
                        {origin.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function TypeComponent({ handleSelectChange }: { handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div>
            <select
                onChange={(e) => handleSelectChange(e)}
            >
                <option value={JSON.stringify('undefined')}>Selecione o Tipo</option>
                {petType.map((type, i) => (
                    <option key={i} value={JSON.stringify(type)}>
                        {type.type}
                    </option>
                ))}
            </select>
        </div>
    );
}

function AgeComponent({ handleSelectChange }: { handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div>
            <select
                onChange={(e) => handleSelectChange(e)}
            >
                <option value={JSON.stringify('undefined')}>Selecione a Idade</option>
                {ageRanges.map((age, i) => (
                    <option key={i} value={JSON.stringify(age)}>
                        {age.dogState} | {age.age}
                    </option>
                ))}
            </select>
        </div>
    );
}
