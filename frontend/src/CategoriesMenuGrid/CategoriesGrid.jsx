import "./CategoriesGrid.css"
import { useNavigate } from 'react-router-dom';

export const Categories_List = [
    {
        title: "Food",
        cName: "categorie-button"
    },
    {
        title: "Education",
        cName: "categorie-button"
    },
    {
        title: "Shopping",
        cName: "categorie-button"
    },
    {
        title: "Beauty",
        cName: "categorie-button"
    },
    {
        title: "Enterntainment",
        cName: "categorie-button"
    },
    {
        title: "Religion",
        cName: "categorie-button"
    },
    {
        title: "Historical monuments",
        cName: "categorie-button"
    },
    {
        title: "Arts",
        cName: "categorie-button"
    },
    {
        title: "Others",
        cName: "categorie-button"
    },
    {
        title: "Schools",
        cName: "categorie-button"
    },
    {
        title: "All Places",
        cName: "categorie-button"
    }
];

const url = "/locations/seebycategories";

function CategoriesMenuGrid({ userLocationChoice, setUserLocationChoice }) {

    const navigate = useNavigate();

    const handleCategoryClick = (title) => {
        setUserLocationChoice(title);
        navigate('/locations/seebycategories');
    };


    return (
        <>
            <div className="categories-menu-grid-div">
                <div className="categorias">
                    <div className="Categories_Container">
                        {Categories_List.map((item, index) => {
                            return (
                                <li key={index} className="categorie-link-list"><a className="categorie-link" onClick={() => handleCategoryClick(item.title)}><div className={item.cName}>{item.title}</div></a></li>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoriesMenuGrid;