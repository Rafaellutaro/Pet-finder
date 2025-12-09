import "./assets/css/App.css";
import heroImg from "./assets/imgs/hero.png";

const dog1 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog2 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog3 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";
const dog4 = "https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg";

function App() {
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
            <select>
              <option>Selecione Local</option>
            </select>
            <button>Procurar</button>
          </div>

          <p>Cidades Mais Procuradas</p>
          <div className="cities-grid">
            <div className="city-pill">São Paulo</div>
            <div className="city-pill">Rio de Janeiro</div>
            <div className="city-pill">Curitiba</div>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImg} alt="Hero" />
        </div>
      </section>

      {/* AVAILABLE DOGS */}
      <section className="dogs-grid">
        <h2>Pets Disponiveis Para Adoção Perto de Você</h2>
        <div className="grid">
          <img src={dog1} />
          <img src={dog2} />
          <img src={dog3} />
          <img src={dog4} />
        </div>
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
