import style from "./Locations.module.css"
import CategoriesMenuGrid from "../../CategoriesMenuGrid/CategoriesGrid";
/*
Vai conter informações dos locais de Braga
*/
function Locations() {
    return (
        <>
            <div className="body">
                <div><CategoriesMenuGrid></CategoriesMenuGrid></div>
            </div>
        </>
    );
}


export default Locations