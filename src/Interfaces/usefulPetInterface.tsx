interface State {
  name: string;
  uf: string;
}

interface Breed {
  name: string;
}

interface Type {
    type: string
}

interface AgeRange {
  dogState: string;
  age: string;
}

export const statesOfBrazil: State[] = [
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

export const dogBreeds: Breed[] = [
  { name: "Labrador Retriever" },
  { name: "Pastor Alemão" },
  { name: "Golden Retriever" },
  { name: "Bulldog Inglês" },
  { name: "Beagle" },
  { name: "Poodle" },
  { name: "Rottweiler" },
  { name: "Yorkshire Terrier" },
  { name: "Dachshund (Teckel)" },
  { name: "Boxer" },
  { name: "Pug" },
  { name: "Shih Tzu" },
  { name: "Chihuahua" },
  { name: "Doberman Pinscher" },
  { name: "Husky Siberiano" },
  { name: "Cocker Spaniel" },
  { name: "Dálmata" },
  { name: "Maltês" },
  { name: "São Bernardo" },
  { name: "Grande Dane" },
  { name: "Outro" }
];

export const catBreed: Breed[] = [
  { name: "Persa" },
  { name: "Siamês" },
  { name: "Maine Coon" },
  { name: "Ragdoll" },
  { name: "Sphynx" },
  { name: "Bengal" },
  { name: "Abyssinian" },
  { name: "Birman" },
  { name: "Scottish Fold" },
  { name: "Exotic Shorthair" },
  { name: "Britânico de Pelo Curto" },
  { name: "Oriental Shorthair" },
  { name: "Russian Blue" },
  { name: "Devon Rex" },
  { name: "Cornish Rex" },
  { name: "Manx" },
  { name: "Chartreux" },
  { name: "Norwegian Forest Cat" },
  { name: "Turco Angorá" },
  { name: "Munchkin" },
  { name: "Outro" }
];

export const ageRanges: AgeRange[] = [
  { dogState: "Filhote", age: "1-3 anos" }, // Puppy
  { dogState: "Joven Adulto", age: "4-7 anos" }, // Young Adult
  { dogState: "Adulto", age: "8-12 anos" }, // Adult
  { dogState: "Idoso", age: "13+ anos" } // Senior
];

export const petType: Type[] = [
  { type: "Cachorro"},
  { type: "Gato"},
];
