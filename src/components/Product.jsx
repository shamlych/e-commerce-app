import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import "./SearchBar.css";
import Spinner from "./Spinner/index"


const Product = () => {
  const [item, setItem] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [ loading, setLoading ] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 8;
  const pagesVisited = pageNumber * itemsPerPage;

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = item.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
      setFilteredData(item);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData(item);
    setWordEntered("");
  };

  useEffect(() => {
    const getProducts = async () => {
        setLoading(false);
      try {
        const { data: response } = await axios.get(
          "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline"
        );
        console.log("response", response);
        setItem(response);
        setFilteredData(response);
      } catch (error) {
        console.log(error.message);
      }
        setLoading(false);
    };
    getProducts();
  }, []);

  const cardItem = (item) => {
    return (
      <div class="card my-5 py-4" key={item.id} style={{ width: "18rem" }}>
        <img src={item.image_link} class="card-img-top" alt={item.name} />
        <div class="card-body text-center">
          <h5 class="card-title">{item.name}</h5>
          <p className="fw-bold lead">${item.price}</p>
          <NavLink to={`/products/${item.id}`} class="btn btn-outline-primary">
            Buy Now
          </NavLink>
        </div>
      </div>
    );
  };

  const pageCount = Math.ceil(item.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const ShowProducts = () => {
    return (
        <>
      <div className="container">
        <div className="row justify-content-around">
          {filteredData
            .slice(pagesVisited, pagesVisited + itemsPerPage)
            .map(cardItem)}
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </div>
        </>
    )
  }
  return (
    <div>
      <div className="container py-3">
        <div className="row  col-12 text-center">
          <div className="">
            <div className="searchInputs">
              <input
                type="text"
                placeholder="Search Product"
                value={wordEntered}
                onChange={handleFilter}
              />
              <div className="searchIcon">
                {filteredData.length !== 0 ? (
                  <SearchIcon />
                ) : (
                  <CloseIcon id="clearBtn" onClick={clearInput} />
                )}
              </div>
            </div>
            <div>
              <h1>Product List</h1>
            </div>
            <hr />
          </div>
        </div>
      </div>
      {loading ? <Spinner/> : <ShowProducts/>}
     
    </div>
  );
};

export default Product;
