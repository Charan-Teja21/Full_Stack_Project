import './Home.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { FaRegStarHalfStroke } from 'react-icons/fa6';

function Home() {
  let navigate = useNavigate();
  let [recipes, setRecipes] = useState([]);
  let title = "Tandoori Chicken";
  let [recipeObj, setRecipeObj] = useState({});

  async function getSpecialItem() {
    let res = await axios.get(`http://localhost:3500/fooditem/${title}`);
    setRecipeObj(res.data.payload);
  }

  function readRecipeByRecipeId(recipeOb) {
    navigate(`/fooditem/${recipeOb.recipeid}`, { state: recipeOb });
  }

  const getAllRecipes = async () => {
    let res = await axios.get('http://localhost:3500/fooditem');
    setRecipes(res.data.payload);
  }

  function handleOrder() {
    navigate(`/fooditem/${recipeObj.recipeid}`, { state: recipeObj });
  }
  function handletop() {
    navigate('/explore');
  }

  useEffect(() => {
    getSpecialItem();
    getAllRecipes();
  }, []);

  return (
    <div className="home container">
      <div className="Special row pt-5 pb-5">
        <div className="col-sm-12 col-md-6 p-3 d-flex align-items-center justify-content-center">
          <div>
            <h3>Our Special Dish</h3>
            <h1 className='text-center'>{recipeObj.title}</h1>
            <p style={{ textAlign: 'justify' }}>{recipeObj.description}</p>
            <button type="button" className="btn btn-outline-primary d-block mx-auto" onClick={handleOrder}>Order Now</button>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 d-flex align-items-center justify-content-center">
          <img style={{ width: "80%" }} src={recipeObj.image} alt="" />
        </div>
      </div>
      <div className='Favourite'>
        <h1 className="text-center pb-5">Our Top-3 Dishes</h1>
        <div className="container mx-auto">
          <div className="row">
            {recipes.slice(0, 3).map((recipe) => (
              <div key={recipe.recipeid} className="col-12 col-sm-6 col-lg-4 d-flex pb-3">
                <div className="card shadow-lg p-4 w-100 cd" onClick={() => readRecipeByRecipeId(recipe)}>
                  <div className="cardImg">
                    <img src={recipe.image} alt="" className='img mx-auto align-self-center product_image' />
                  </div>
                  <div className="card-body">
                    <h1 className="fs-5 text-center">{recipe.title}</h1>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStarHalfStroke />
                    {recipe.rating}
                    <p>{recipe.description.substring(0, 80) + "..."}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-3 pb-3">
        <button type="button" className="btn btn-outline-primary d-block mx-auto" onClick={handletop}>View All</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
