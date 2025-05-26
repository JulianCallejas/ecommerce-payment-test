import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Typography, Card, CardContent, Chip, Skeleton } from '@mui/material';
import { CreditCard, ShieldCheck, TruckIcon } from 'lucide-react';
import { type RootState, type AppDispatch } from '../../store';
import { fetchProduct } from './productSlice';



const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { data: product, loading, error } = useSelector((state: RootState) => state.product);

  
  useEffect(() => {
    if (slug) {
      dispatch(fetchProduct(slug));
    }
  }, [dispatch, slug]);

  const handleBuyNowClick = () => {
    
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
          Error Loading Product
        </Typography>
        <Typography>{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchProduct(slug || ''))}
          className="mt-4"
        >
          Try Again
        </Button>
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
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Back to Store
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      


      
      <div className="space-y-6">
        <div>
          <Typography variant="h4" component="h1" className="font-bold">
            {product.title}
          </Typography>
          
          <div className="flex items-center mt-2">
            <Typography variant="h5" color="primary" className="font-semibold">
              ${product.price.toFixed(2)}
            </Typography>
            
            <Chip
              label={product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              color={product.stock > 0 ? 'success' : 'error'}
              size="small"
              className="ml-4"
            />
          </div>
        </div>
        
        <Typography variant="body1" className="text-gray-700">
          {product.description}
        </Typography>
        
        <Card variant="outlined" className="bg-gray-50">
          <CardContent>
            <Typography variant="subtitle2" className="mb-3 font-semibold">
              Why buy from us?
            </Typography>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <ShieldCheck className="text-green-600 h-5 w-5 mr-2" />
                <Typography variant="body2">Secure checkout process</Typography>
              </div>
              
              <div className="flex items-center">
                <TruckIcon className="text-blue-600 h-5 w-5 mr-2" />
                <Typography variant="body2">Fast shipping options available</Typography>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="text-purple-600 h-5 w-5 mr-2" />
                <Typography variant="body2">Multiple payment methods accepted</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          startIcon={<CreditCard />}
          onClick={handleBuyNowClick}
          disabled={product.stock <= 0}
          className="py-3"
        >
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};

export default ProductPage;