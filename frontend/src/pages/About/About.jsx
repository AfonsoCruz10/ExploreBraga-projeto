import styles from "./About.module.css";
import Header from "../../components/Header/Header.jsx";

function About() {
    return (
        <>
        <Header /> 
        <div className="body">
            <div className={styles.titulo}>
                <h1  style={{ fontFamily: 'Arial, sans-serif', fontSize: '60px', padding: '35px', marginBottom: '5px' }}>ABOUT US</h1>
            </div>
            <div className={styles.info}>
                <div className={styles.texto}>
                    <p> We are 4 Science Computer students at University of Minho and we decided to do this web app as our degree final project.
                        We hope you like it as much as we had fun developing it.
                    </p>
                </div>
            </div>
            <div className={styles.Wrapper}>
                <div className={styles.pessoasWrapper}>
                    <div className={styles.pessoas}>
                        <div className={styles.pess}>
                            <div className={styles.imagemAfonso}></div>
                            <div className={styles.nome}>
                                <h1>Afonso</h1>
                            </div>
                            <div className={styles.git}>
                                <h2><a href="https://github.com/AfonsoCruz10">GITHUB</a></h2>
                            </div>
                        </div>
                        <div className={styles.pess}>
                            <div className={styles.imagemHenrique}></div>
                            <div className={styles.nome}>
                                <h1>Henrique</h1>
                            </div>
                            <div className={styles.git}>
                                <h2><a href="https://github.com/JQUINN2000">GITHUB</a></h2>
                            </div>
                        </div>
                        <div className={styles.pess}>
                            <div className={styles.imagemPedro}></div>
                            <div className={styles.nome}>
                                <h1>Pedro</h1>
                            </div>
                            <div className={styles.git}>
                                <h2><a href="https://github.com/Pedro003">GITHUB</a></h2>
                            </div>
                        </div>
                        <div className={styles.pess}>
                            <div className={styles.imagemRui}></div>
                            <div className={styles.nome}>
                                <h1>Rui</h1>
                            </div>
                            <div className={styles.git}>
                                <h2><a href="https://github.com/jordan21pt">GITHUB</a></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default About;
