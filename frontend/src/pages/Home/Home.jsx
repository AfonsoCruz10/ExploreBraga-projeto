import style from "./Home.module.css";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from "react";

/*
Pagina inicial do Projeto (HomePage)
*/
function Home() {
    const headerRef = useRef(null);
    const section1 = useRef(null);
    const section2 = useRef(null);
    const section3 = useRef(null);
    const [currentSection, setCurrentSection] = useState(1);
    const navigate = useNavigate();

    const scrollToSection = (sectionNumber) => {
        setCurrentSection(sectionNumber); // Update the current section number
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
        switch (sectionNumber) {
            case 1:
                window.scrollTo({ top: section1.current.offsetTop - headerHeight, behavior: 'smooth' });
                break;
            case 2:
                window.scrollTo({ top: section2.current.offsetTop - headerHeight, behavior: 'smooth' });
                break;
            case 3:
                window.scrollTo({ top: section3.current.offsetTop - headerHeight, behavior: 'smooth' });
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Header ref={headerRef} />
            <div className="body">
                <section ref={section1}>
                    <div className={style.section1}>
                        <h1 className={style.titulo}>COMEÇA A <br /> DESCOBERTA</h1>
                        <button className={style.Arrowred} onClick={() => scrollToSection(2)}>
                            <SlArrowDown />
                        </button>
                    </div>
                </section>
                <section ref={section2}>
                    <div className={style.section2}>
                        <div className={style["menu-section2"]}></div>
                        <div >
                            <h3 className={style.titulo2}>Eventos</h3>
                        </div>
                        <div className={style.Wrapper}>
                            <div className={style.cartoesWrapper}>
                                <div className={style.cartoes}>
                                    <div className={style.cartaoBlack} onClick={ () => navigate(`/events`) }>
                                        <div className={style.c1evento}></div>
                                        <div className={style.nome}>
                                            <h1>Descobre eventos novos todos os dias!</h1>
                                        </div>
                                    </div>
                                    <div className={style.cartaoBlack} onClick={ () => navigate(`/userCreatEvent`) } >
                                        <div className={style.c2evento}></div>
                                        <div className={style.nome}>
                                            <h1>Cria os teus eventos!</h1>
                                        </div>
                                    </div>
                                    <div className={style.cartaoBlack} onClick={ () => navigate(`/events`) }>
                                        <div className={style.c3evento} ></div>
                                        <div className={style.nome}>
                                            <h1>Partilha os teus eventos favoritos!</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className={style.ArrowBlack} onClick={() => scrollToSection(3)}>
                                    <SlArrowDown />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <section ref={section3}>
                    <div className={style.section3}>
                        <div>
                            <h3  className={style.titulo2}>Locais</h3>
                        </div>
                        <div className={style.Wrapper}>
                            <div className={style.cartoesWrapper}>
                                <div className={style.cartoes}>
                                    <div className={style.cartaored} onClick={ () => navigate(`/locations`) } >
                                        <div className={style.c1local} ></div>
                                        <div className={style.nome}>
                                            <h1>Conhece locais fantásticos!</h1>
                                        </div>
                                    </div>
                                    <div className={style.cartaored} onClick={ () => navigate(`/userCreateLocation`) }>
                                        <div className={style.c2local}></div>
                                        <div className={style.nome}>
                                            <h1>Partilha o teu negócio!</h1>
                                        </div>
                                    </div>
                                    <div className={style.cartaored} onClick={ () => navigate(`/locations`) }>
                                        <div className={style.c3local} ></div>
                                        <div className={style.nome}>
                                            <h1>Cria uma lista com os teu locais favoritos!</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className={style.Arrowred} onClick={() => scrollToSection(1)}>
                                    <SlArrowUp />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default Home;
