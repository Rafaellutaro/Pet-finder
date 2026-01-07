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

const popularBreeds = [
    "Labrador Retriever",
    "Pastor Alemão",
    "Golden Retriever",
    "Bulldog Inglês",
    "Beagle",
    "Poodle",
    "Rottweiler",
    "Yorkshire Terrier",
    "Dachshund (Teckel)",
    "Boxer",
    "Pug",
    "Shih Tzu",
    "Chihuahua",
    "Doberman Pinscher",
    "Husky Siberiano",
    "Cocker Spaniel",
    "Dálmata",
    "Maltês",
    "São Bernardo",
    "Grande Dane",
];

  const ageRanges = [
    {dogState: "Filhote", age: "1-3 anos"},  // Puppy
    {dogState: "Joven Adulto", age: "4-7 anos"},  // Young Adult
    {dogState: "Adulto", age: "8-12 anos"}, // Adult
    {dogState: "Idoso", age: "13+ anos"}   // Senior
  ];

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
            getAllPetsPublic(apiRegion, undefined!, undefined!, "10", undefined!, setPetData);
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
    setSelectedBreed: React.Dispatch<any>;
    setSelectedAge: React.Dispatch<any>;
};

export function StateSelectNoApi({ setSelectedOrigin, setSelectedBreed, setSelectedAge }: StateSelectNoApiProps) {
    // const [selectedOrigin, setSelectedOrigin] = useState<any | null>(null);

    const handleSelectChange = (type: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = JSON.parse(e.target.value);

        switch(type){
            case "origin":
                setSelectedOrigin(selected.uf);
                break;
            case "breed":
                setSelectedBreed(selected);
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
                <BreedComponent 
                    handleSelectChange={handleSelectChange("breed")}
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

function BreedComponent({ handleSelectChange }: { handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div>
            <select
                onChange={(e) => handleSelectChange(e)}
            >
                <option value={"initial"}>Selecione a Raça</option>
                {popularBreeds.map((breed, i) => (
                    <option key={i} value={JSON.stringify(breed)}>
                        {breed}
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
                <option value={"initial"}>Selecione a Idade</option>
                {ageRanges.map((age, i) => (
                    <option key={i} value={JSON.stringify(age)}>
                        {age.dogState} | {age.age}
                    </option>
                ))}
            </select>
        </div>
    );
}
