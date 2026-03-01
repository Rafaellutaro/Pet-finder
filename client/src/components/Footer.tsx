import "../assets/css/Footer.css"
import { SiSpeedypage } from "react-icons/si";
import { MdOutlineVaccines } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { HiLightBulb } from "react-icons/hi";
import { BiSolidConversation } from "react-icons/bi";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

function Footer() {
   return (
  <section className="footer-main-container">
    <div className="group-container">

      {/* Quick Links */}
      <div className="quick-links">
        <div className="footer-title">
          <span aria-hidden="true"><SiSpeedypage/></span>
          <span>Links Rapidos</span>
        </div>

        <div className="footer-details">
          <a href="/pets">Adote um Pet</a>
          <a href="/Profile">Registre seu Pet</a>
          <a href="/#">Favoritos</a>
          <a href="/#">Sobre Nós</a>
          <a href="/#">Contato</a>
        </div>

        <div className="footer-last">
          {/* <div>
            <span aria-hidden="true">🕒</span>
            <span>Support: Mon–Sat, 9:00–18:00</span>
          </div> */}
          <div>
            <span aria-hidden="true"><FaLocationDot/></span>
            <span>Brasil • Suzano, SP</span>
          </div>
        </div>
      </div>

      {/* Pet Care */}
      <div className="pet-care">
        <div className="footer-title">
          <span aria-hidden="true"><MdOutlineVaccines/></span>
          <span>Cuidados com o Pet</span>
        </div>

        <div className="footer-details">
          <a href="/#">Dicas de Adoção</a>
          <a href="/#">Guia de Iniciante</a>
          <a href="/#">Vacinas & Saude</a>
          <a href="/#">Nutrição</a>
          <a href="/#">Treinos Basicos</a>
        </div>

        <div className="footer-last">
          <div>
            <span aria-hidden="true"><HiLightBulb/></span>
            <span>Novo Aqui? Começe com o “Guia de Iniciante”.</span>
          </div>
        </div>
      </div>

      {/* Stay Connected */}
      <div className="stay-connected">
        <div className="footer-title">
          <span aria-hidden="true"><BiSolidConversation/></span>
          <span>Fique Conectado</span>
        </div>

        <div className="footer-icons" aria-label="Social links">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <span aria-hidden="true"><FaInstagram/></span>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            <span aria-hidden="true"><AiFillTikTok/></span>
          </a>
          <a href="https://www.linkedin.com/in/rafael-dos-santos-alves-pires-222a63324/" target="_blank" rel="noreferrer" aria-label="Linkedin">
            <span aria-hidden="true"><FaLinkedin /></span>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
            <span aria-hidden="true"><IoLogoYoutube/></span>
          </a>
        </div>

        <div className="footer-newsletter" aria-label="Newsletter">
          <input type="text" placeholder="Seu Nome" aria-label="Seu Nome" />
          <input type="email" placeholder="Seu email" aria-label="Seu email" />
          <button type="button">Se Inscrever</button>
        </div>

        <div className="footer-last">
          <div>
            <span aria-hidden="true"><MdOutlineEmail/></span>
            <a href="mailto:Rafael.Alves0_1@hotmail.com">Rafael.Alves0_1@hotmail.com</a>
          </div>
          <div>
            <span aria-hidden="true"><FaPhone/></span>
            <a href="tel:+5511954195131">+55 (11) 95419-5131</a>
          </div>
        </div>
      </div>

    </div>

    <div className="footer-policies">
      <div>© {new Date().getFullYear()} Rafael dos Santos Alves Pires. All rights reserved.</div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <a href="/privacy">Termos de Privacidade</a>
        <a href="/cookies">Cookies</a>
      </div>
    </div>
  </section>
);

}

export default Footer;