import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addItem, delItem } from "../redux/actions/index";
import Spinner from "./Spinner/index";

const ProductDetail = ({ item }) => {
  const params = useParams();
  const [cartBtn, setCartBtn] = useState("Add to Cart");
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleCart = (product) => {
    if (cartBtn === "Add to Cart") {
      dispatch(addItem(product));
      setCartBtn("Remove from Cart");
    } else {
      dispatch(delItem(product));
      setCartBtn("Add to Cart");
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          `http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline&id=${params.id}`
        );
        console.log("response", response);
        const selectedCartArr = response;
        selectedCartArr.forEach((item) => {
          const updatedList = response.filter(
            (item) => item.id === parseInt(params.id)
          );
          setProduct(updatedList);
        });
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    getProducts();
  }, []);

  const ShowProduct = () => {
    return (
      <>
        {product.map((item) => (
          <div className="d-flex">
            <div className="col-md-6">
              <img
                src={item.image_link}
                alt={item.name}
                height="400px"
                width="400px"
              />
            </div>
            <div className="col-md-6">
              <h4 className="text-uppercase text-black-50">{item.category}</h4>
              <h1 className="display-5">{item.name}</h1>
              <p className="lead fw-bolder">
                Rating {item.rating}
                <i className="fa fa-star"></i>
              </p>
              <h3 className="display-6 fw-bold my-4">${item.price}</h3>
              <p className="lead">{item.description}</p>
              <button
                onClick={() => handleCart(product)}
                className="btn btn-outline-primary my-5"
              >
                {cartBtn}
              </button>
              <NavLink to="/cart" className="btn btn-dark mx-2 px-3 py-2">
                Go to Cart
              </NavLink>
            </div>
          </div>
        ))}
      </>
    );
  };
  return (
    <>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? <Spinner /> : <ShowProduct />}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
