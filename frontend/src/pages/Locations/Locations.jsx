import style from "./Locations.module.css"
import Header from "../../components/Header/Header.jsx";
import CategoriesMenuGrid from "../../CategoriesMenuGrid/CategoriesGrid";
import Footer from "../../components/Footer/Footer.jsx";
import MyMap from "../../components/MyMap.jsx";
/*
Vai conter informações dos locais de Braga
*/
function Locations({ userLocationChoice, setUserLocationChoice }) {
    return (
        <>
            <Header />
            <div className="body">
                <h1 className="titulo"> What are you searching for?</h1>
                <CategoriesMenuGrid userLocationChoice={userLocationChoice} setUserLocationChoice={setUserLocationChoice} />
            </div>
            <Footer />
        </>
    );
}

export default Locations