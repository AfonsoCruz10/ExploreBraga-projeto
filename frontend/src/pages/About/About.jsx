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
                        <p> Sou estudante de Ciência da Computação na Universidade do Minho e decidi fazer este aplicativo web como nosso projeto final de graduação. Espero que você goste tanto quanto eu me diverti a desenvolve-lo.
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
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
}

export default About;
