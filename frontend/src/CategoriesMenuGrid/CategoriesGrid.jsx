import "./CategoriesGrid.css"
import Header from "../components/Header/Header.jsx";

export const Categories_List = [
    {
        title: "Comida",
        url: "/#",
        cName: "categorie-button"
    },
    {
        title: "Educação",
        url: "/#",
        cName: "categorie-button"
    },
    {
        title: "Compras",
        url: "/#",
        cName: "categorie-button"
    },
    {
        title: "Beleza",
        url: "/#",
        cName: "categorie-button"
    },
    {
        title: "Entertenimento",
        url: "/#",
        cName: "categorie-button"
    },
    {
        title: "Outro",
        url: "/#",
        cName: "categorie-button"
    },
]


function CategoriesMenuGrid() {

    return (
        <>
            <div className="categories-menu-grid-div">
                <div className="header-div"><Header></Header></div>
                <div className="tit"><h1> WHAT ARE YOU LOOKING FOR?</h1></div>
                <div className="Categories_Container">
                    {/* 
                    {Categories_List.map((item, index) => {
                        return (
                            <li key={index} className="categorie-link-list"><a href={item.url} className="categorie-link"><div className={item.cName}>{item.title}</div></a></li>
                        )
                    })}
                    */}
                    <a href="#" className="categorie-link"><div className="categorie-button">FOOD</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">ENTERTAINMENT</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">BEAUTY</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">NATURE</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">EDUCATION</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">RELIGIOUS</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">ARTS</div></a>
                    <a href="#" className="categorie-link"><div className="categorie-button">OTHERS</div></a>
                </div >
            </div>

        </>
    );
}

export default CategoriesMenuGrid;