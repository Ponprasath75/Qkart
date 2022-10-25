import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "../components/ProductCard"
import Cart,{generateCartItemsFrom} from "../components/Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
* @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


 const Products = () => {
  const [productsList,setProductsList]=useState([]);
  const [isLoading,setisLoading]=useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [debounceTimeout,setDebounceTimeout] = useState(null);
  const token=localStorage.getItem('token')
  const[items,setItems] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try{
      const response=await axios.get(`${config.endpoint}/products`);
      const value=response.data;
      setProductsList(value);
      console.log(value)
      setisLoading(false)
      return response.data

    }
    catch(err){
      if(err.response.status===400){
        console.log(err.response)
        enqueueSnackbar(`${err.response.data.message}`,{variant:"error"})}
      else{
      enqueueSnackbar("Something went wrong. Check the backend console for more details",{variant:"error"})}
    }
  
 };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const url=`${config.endpoint}/products`
    var reqURL=""
    // if(text!==""){
      reqURL=`${url}/search?value=${text}`
    // }
    // else{
    //   reqURL=url
    // }
    try{
      const response=await axios.get(reqURL);
      const value=response.data;
      setProductsList(value);
      console.log(value)
      setisLoading(false)
      return response.data

    }
    catch(err){
      console.log(err.response)
      if(err.response.status===404){
        // console.log(err.response)
        setProductsList([]);}
      else if(err.response.status===500){
        enqueueSnackbar(err.response.data.message,{variant:"error"});
        // setProductsList(products)
      }
      else{
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and returns valid JSON",{variant:"error"})
        
    }
  }};

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value=event.target.value
    if(debounceTimeout){
      clearTimeout(debounceTimeout)
    }
    const Timeout=setTimeout(()=>{performSearch(value)},500)
    setDebounceTimeout(Timeout)
  };

const fetchCart = async(token)=> {
  if(!token) return;
  try{
  const url = `${config.endpoint}/cart`
  const response = await axios.get(url,{
  headers:{
    Authorization : `Bearer ${token}`
  }})
  // console.log(response)
return response.data}
  catch(err){
    enqueueSnackbar(err.response.data.message,{variant:"error"});
    return null
  }
}

const isItemInCart=(items,productId)=>{
  return items.findIndex((item)=>item.productId===productId)!==-1
};

const addToCart =async (token,items,productId,products,qty,check={preventDuplicate:false})=>{
  if(!token)
  {enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"})
  return}

  if(check.preventDuplicate && isItemInCart(items,productId)){
    enqueueSnackbar("Item already in Cart.Use the cart sidebar to update quantity or remove item",{variant:"warning"})
      return;
  }
  try{
    const url =`${config.endpoint}/cart`;
    const response=await axios.post(url,{productId,qty},{headers:{
      Authorization:`Bearer ${token}`,
    },})
    console.log(response.data,'ff')
    const cartItems=generateCartItemsFrom(response.data,products);
    setItems(cartItems)
  }
  catch(err){
    if(err.response){
      enqueueSnackbar(err.response.data.message,{variant:'warning'})
      return null
    }else{
      enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and returns valid JSON",{variant:"error"})
    }
  }
}

  useEffect(() => {
    performAPICall(); 
  }, []);

  useEffect(() => {
    fetchCart(token).then((cartData) => generateCartItemsFrom(cartData,productsList))
    .then((cartItems)=>setItems(cartItems));},[productsList])





  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size=	'small'
        InputProps={{ className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={e=>debounceSearch(e,debounceTimeout)}
      />

      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={e=>debounceSearch(e,debounceTimeout)}
      />
       <Grid container>
         <Grid item className="product-grid" xs={12} md={token ? 9:12}>
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>
           {isLoading &&
           <Box className="loading" sx={{ display: 'flex',justifyContent:"center"}}>
           <CircularProgress color="success"/>
           <div >Loading Products</div>
         </Box>}
           {!isLoading &&
          <Grid container marginY="1rem" paddingY="1rem" paddingX="1rem" spacing={2}>
          { productsList.length ?
            (productsList.map((product) =>   
           <Grid item xs={12} sm={6} md={3} key={product._id} >
           <ProductCard product={product}
           handleAddToCart ={async()=>{
            debugger; 
            await addToCart(token,items,product._id,productsList,1,{preventDuplicate:true})}}/>
            </Grid>
            ))
            :(
              <Box className="loading" sx={{ display: 'flex',justifyContent:"center"}}>
              <SentimentDissatisfied />
              <div >No Products Found</div>
         </Box>
            ) }
          </Grid>}
         </Grid>
         
         {(token)?
         (<Grid item xs={12} md={3}  className="cart-grid"><Cart products={productsList} 
         items={items} 
         handleQuantity={addToCart} /></Grid>) 
        :null} 
        
       </Grid>
       
      <Footer />
    </div>
  );
};

export default Products;
