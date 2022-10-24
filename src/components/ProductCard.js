import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

// {
//   "name":"Tan Leatherette Weekender Duffle",
//   "category":"Fashion",
//   "cost":150,
//   "rating":4,
//   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   "_id":"PmInA797xJhMIPti"
//   }
const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="300"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {product.name}
        </Typography>
        <Typography sx={{fontWeight: 'bold'}} >
        {'$'+product.cost}
        </Typography>
        <Rating readOnly name="half-rating" defaultValue={product.rating} precision={0.5}/>
      </CardContent>
      <CardActions>
        <Button fullWidth
          className="card-button" size="medium" variant="contained" startIcon={<AddShoppingCartOutlined />}>Add to Cart</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
