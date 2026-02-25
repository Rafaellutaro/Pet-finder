import { useEffect, useState } from "react";
import "./assets/css/App.css";
import heroImg from "./assets/imgs/hero.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import StateSelect from "./components/reusable/StateSelection";
import { useNavigateWithFrom } from "./components/reusable/Redirect";
import { getAllPetsPublic } from "./components/functions/petFunctions";
import { statesOfBrazil } from "./Interfaces/usefulPetInterface"
import { getUserLanguage } from "./components/functions/userFunctions";

const dog1 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog2 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog3 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog4 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";

function App() {
  const [petData, setPetData] = useState<any>({});
  const [apiRegion, setApiRegion] = useState('');
  const singlePet = useNavigateWithFrom();
  

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
              getAllPetsPublic(apiRegion, undefined!, undefined!, undefined!, "10", undefined!, 1, setPetData);
          }
      }, [apiRegion]);

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
            <StateSelect />
          </div>

          <p>Estados Mais Procuradas</p>
          <div className="cities-grid">
            <button className="city-pill" onClick={() => singlePet(`/Pets?uf=SP`)}>São Paulo</button>
            <button className="city-pill" onClick={() => singlePet(`/Pets?uf=RJ`)}>Rio de Janeiro</button>
            <button className="city-pill" onClick={() => singlePet(`/Pets?uf=RO`)}>Roraima</button>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImg} alt="Hero" />
        </div>
      </section>

      {/* AVAILABLE DOGS */}
      <section className="dogs-grid">
        <h2>Pets Disponiveis Para Adoção Perto de Você</h2>

        {petData && petData.data ? (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={16}
            slidesPerView={4}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
              0: { slidesPerView: 1.15, spaceBetween: 12 },     // phones
              480: { slidesPerView: 1.6, spaceBetween: 14 },    // big phones
              768: { slidesPerView: 2.4, spaceBetween: 16 },    // tablets
              1024: { slidesPerView: 4, spaceBetween: 18 },     // desktop
            }}
          >
            {petData.data.map((item: any) => (
              <SwiperSlide key={item.id}>
                <img src={item.imgs[0]?.url} alt={item.name} onClick={() => singlePet(`/Pets/${item.id}`)} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div>Loading Pets...</div> // using the same idea i used in flutter, now i can understand it better, since i used mostly backend there and didnt grasp 100%.
        )}                           {/* its easier than i thought it was '-' */}
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
