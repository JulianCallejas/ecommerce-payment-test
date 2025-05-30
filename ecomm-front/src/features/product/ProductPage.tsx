import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Typography,
  Card,
  Chip,
  Skeleton,
  Box,
  
} from "@mui/material";
import {  CreditCard } from "lucide-react";
import { type RootState, type AppDispatch } from "../../store";
import { fetchProduct } from "./productSlice";
import { currencyFormatter } from "../../utils";
import ProductImageGallery from "../../components/ProductImageGallery";
import CardWhyBuy from "../../components/CardWhyBuy";
import QuantityCounter from "../../components/QuantityCounter";
import { usePurchaseProcess } from "../../hooks";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { startCheckout } = usePurchaseProcess();
  
  const {
    data: product,
    loading,
    error,
  } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProduct(slug));
    }
  }, [dispatch, slug]);

  const handleBuyNowClick = () => {
    if (!product) return;
    startCheckout(product.id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton variant="rectangular" height={400} />
        <div className="space-y-4">
          <Skeleton variant="text" height={40} width="70%" />
          <Skeleton variant="text" height={24} width="40%" />
          <Skeleton variant="text" height={100} />
          <Skeleton variant="rectangular" height={56} width="100%" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <Typography variant="h5" color="error" gutterBottom>
          Error al cargar el producto
        </Typography>
        <Box className="flex justify-center items-center gap-4 flex-col md:flex-row mt-4">

        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchProduct(slug || ""))}
          className="mt-4"
          >
          Intentar nuevamente
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          className="mt-4"
          >
          Regresar
        </Button>
          </Box>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="p-6 text-center">
        <Typography variant="h5" gutterBottom>
          Product Not Found
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          className="mt-4"
        >
          Back to Store
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <Typography
        variant="h3"
        component="h1"
        className="font-bold text-center md:hidden"
      >
        {product.name}
      </Typography>
      <ProductImageGallery images={product.images} />
      <div className="space-y-6">
        <div>
          <Typography
            variant="h3"
            component="h1"
            className="font-bold hidden md:block"
          >
            {product.name}
          </Typography>
          <div className="flex items-center mt-2">
            <Typography variant="h5" color="primary" className="font-semibold">
              <span className="text-3xl">
                {currencyFormatter(product.unitPrice)}
              </span>
            </Typography>

            <Chip
              label={
                product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"
              }
              color={product.stock > 0 ? "success" : "error"}
              size="small"
              className="ml-5"
            />
          </div>
        </div>

        <QuantityCounter stock={product.stock} />

        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          startIcon={<CreditCard />}
          onClick={handleBuyNowClick}
          disabled={product.stock <= 0}
          className="py-3"
        >
          Pay with Credit Card
        </Button>

        <Typography variant="body1" className="text-gray-700">
          {product.description}
        </Typography>
        <CardWhyBuy />
      </div>
    </div>
  );
};

export default ProductPage;
