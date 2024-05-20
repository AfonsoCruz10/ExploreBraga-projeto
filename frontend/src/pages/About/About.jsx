import styles from "./About.module.css";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

function About() {
    return (
        <>
            <Header />
            <div className="body">
                <h1 className="titulo">Sobre nós</h1>
                <div className={styles.info}>
                    <div className={styles.texto}>
                        <p> Nós somos 4 estudantes de Ciência da Computação na Universidade do Minho e decidimos fazer este aplicativo web como nosso projeto final de graduação. Esperamos que você goste tanto quanto nos divertimos desenvolvendo-o.
                        </p>
                    </div>
                </div>
                <div className={styles.Wrapper}>
                    <div className={styles.pessoasWrapper}>
                        <div className={styles.pessoas}>
                            <a href="https://github.com/AfonsoCruz10" className={styles.pess}>
                                <div className={styles.imagemAfonso}></div>
                                <div className={styles.nome}>
                                    <h1>Afonso</h1>
                                </div>
                            </a>
                            <a href="https://github.com/JQUINN2000" className={styles.pess}>
                                <div className={styles.imagemHenrique}></div>
                                <div className={styles.nome}>
                                    <h1>Henrique</h1>
                                </div>
                            </a>
                            <a href="https://github.com/Pedro003" className={styles.pess}>
                                <div className={styles.imagemPedro}></div>
                                <div className={styles.nome}>
                                    <h1>Pedro</h1>
                                </div>
                            </a>
                            <a href="https://github.com/jordan21pt" className={styles.pess}>
                                <div className={styles.imagemRui}></div>
                                <div className={styles.nome}>
                                    <h1>Rui</h1>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
}

export default About;
