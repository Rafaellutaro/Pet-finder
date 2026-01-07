import { useEffect, useState } from "react";
import { getUserLanguage } from "../functions/userFunctions";
import { getAllPetsPublic } from "../functions/petFunctions";
import { statesOfBrazil, petType, ageRanges } from "../../Interfaces/usefulPetInterface"
import { useNavigate } from 'react-router-dom';

type StateSelectProp = {
    setPetData: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function StateSelect({ setPetData }: StateSelectProp) {
    const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);
    // const [petData, setPetData] = useState<any[]>([]);
    const [apiRegion, setApiRegion] = useState('');
    const navigate = useNavigate();

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
            getAllPetsPublic(apiRegion, undefined!, undefined!, undefined!, "10", undefined!, setPetData);
        }
    }, [apiRegion]);

    useEffect(() => {
        console.log(selectedOrigin)
    }, [selectedOrigin]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);
        setSelectedOrigin(selected.uf);
    };

    const SeachBasedOnUf = () => {
        if (selectedOrigin){
            navigate(`/Pets?uf=${selectedOrigin}`);
        }
    }

    return (
        <>
            <SelectComponent
                handleSelectChange={handleSelectChange}
            />
            <button onClick={() => SeachBasedOnUf()}>Procurar</button>
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

        switch (type) {
            case "origin":
                setSelectedOrigin(selected.uf);
                break;
            case "type":
                setSelectedType(selected.type);
                break
            case "age":
                setSelectedAge(selected.age);
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
                        {age.age}
                    </option>
                ))}
            </select>
        </div>
    );
}
