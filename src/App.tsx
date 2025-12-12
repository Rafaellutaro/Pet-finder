import { useEffect, useState } from "react";
import "./assets/css/App.css";
import heroImg from "./assets/imgs/hero.png";
import { getUserLanguage } from "./components/functions/userFunctions";
import { getAllPetsPublic, petContainerCloseToYou } from "./components/functions/petFunctions"
import { Swiper } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const dog1 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog2 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog3 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog4 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";

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


function App() {
  const [selectedOrigin, setSelectedOrigin] = useState<{} | null>(null);
  const [petData, setPetData] = useState<any[]>([]);
  const [region, setRegion] = useState('');

  useEffect(() => {
    const fetchRegion = async () => {
      const regionReturn = await getUserLanguage()
      const regionName = statesOfBrazil.find(i => i.name == regionReturn)

      if (regionName) {
        setRegion(regionName.uf)
      }
    }
    fetchRegion()
    getAllPetsPublic(region, setPetData)

    if (!selectedOrigin) {
      setSelectedOrigin(statesOfBrazil[0])
    }
  }, [region])

  useEffect(() => {
    console.log(petData)
  }, [petData])

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            ENCONTRE O SEU <br /> <span>PET PERFEITO</span>
          </h1>

          <p>
            Diversos pets estão esperando para receber o seu carinho, <br />adote um já!!!
          </p>

          <div className="hero-search">
            <select onChange={(e) => setSelectedOrigin(JSON.parse(e.target.value))} defaultValue={statesOfBrazil[0].name}>
              {statesOfBrazil.map((origin: any, i: number) => (
                <option key={i} value={JSON.stringify(origin)}>
                  {`${statesOfBrazil[i].name}`}
                </option>
              ))}
            </select>
            <button>Procurar</button>
          </div>

          <p>Estados Mais Procuradas</p>
          <div className="cities-grid">
            <div className="city-pill">São Paulo</div>
            <div className="city-pill">Rio de Janeiro</div>
            <div className="city-pill">Roraima</div>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImg} alt="Hero" />
        </div>
      </section>

      {/* AVAILABLE DOGS */}
      <section className="dogs-grid">
        <h2>Pets Disponiveis Para Adoção Perto de Você</h2>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
        >
          {petContainerCloseToYou(petData)}
        </Swiper>

      </section>


      {/* POPULAR ACCESSORIES */}
      <section className="accessories">
        <h2>Accesorios de Pet Populares</h2>

        <div className="accessories-grid">
          <div className="access-card"><img src={dog1} /></div>
          <div className="access-card"><img src={dog2} /></div>
          <div className="access-card"><img src={dog3} /></div>
        </div>
      </section>

      {/* POPULAR DOG BREEDS */}
      <section className="breeds">
        <h2>Raças de Pet Populares</h2>
        <div className="breeds-grid">
          <img src={dog1} />
          <img src={dog2} />
          <img src={dog3} />
          <img src={dog4} />
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="blog">
        <h2>Blogs Sobre Pets</h2>
        <div className="blog-grid">
          <div className="blog-card"><img src={dog1} /><p>Blog text...</p></div>
          <div className="blog-card"><img src={dog2} /><p>Blog text...</p></div>
          <div className="blog-card"><img src={dog3} /><p>Blog text...</p></div>
        </div>
      </section>
    </>
  );
}

export default App;
