
import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductPage from './ProductPage';

import { useParams } from 'react-router-dom';
import api from '../../tests/__mocks__/api';
import { createWrapper, type DeepPartial } from '../../tests/reduxTestingUtils';
import type { RootState } from '../../store';
import { mockStartCheckout, usePurchaseProcess } from '../../tests/__mocks__/usePurchaseProcess';



// Mocks
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));


jest.mock("../../services/api");
jest.mock('../../hooks/usePurchaseProcess');

// const mockStartCheckout = jest.fn();

const mockProduct = {
  id: "p1",
  name: 'Test Product',
  unitPrice: 100,
  stock: 5,
  images: ['image1.jpg'],
  description: 'This is a test product.',
  slug: 'test-product',
};

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.__mock.reset();

    (usePurchaseProcess as jest.Mock).mockImplementation(() => ({
          startCheckout: mockStartCheckout,
        }));
    
  });

  const baseState: DeepPartial<RootState> = {
      order: {
        data: null,
        loaded: true,
        error: null,
      },
      summary: {
        data: null,
      },
      transaction: {
        data: null,
        loading: false,
        polling: false,
        error: null,
        loaded: false,
      },
      checkout: {
        paymentData: null,
        termsAccepted: "",
        privacyAccepted: "",
        customer: null,
        address: null,
        quantity: 1,
        productId: "",
        _persist: {
          version: 1,
          rehydrated: true,
        },
      },
      purchaseStageState: {
        stage: "",
        isCheckoutModalOpen: false,
        isSummaryOpen: false,
        transactionModalMessage: "",
      },
      product: {
        data: mockProduct,
        loading: false,
        error: null,
      },
    };
  



  test('should render the "Pay with Credit Card" button when the product is available', async () => {
    const wrapper = createWrapper(baseState);
    (api.getProduct as jest.Mock).mockResolvedValue(mockProduct);
    (useParams as jest.Mock).mockReturnValue({ slug: 'test-product' });

    render(<ProductPage />, { wrapper });
   
    const payButton = await screen.findByTestId('pmt-button');
    expect(payButton).toBeInTheDocument();
    expect(payButton).toHaveTextContent('Pay with Credit Card');
    expect(payButton).not.toBeDisabled();
  });

  test('should disable the "Pay with Credit Card" button when the product is out of stock', async () => {
    const wrapper = createWrapper(baseState);
    (api.getProduct as jest.Mock).mockResolvedValue({...mockProduct, stock: 0});
   
    (useParams as jest.Mock).mockReturnValue({ slug: 'test-product' });

    render(<ProductPage />, { wrapper });
   
    const payButton = await screen.findByTestId('pmt-button');
    expect(payButton).toBeDisabled();
  });

  test('should call startCheckout with the product ID when the button is clicked', async () => {
    const wrapper = createWrapper(baseState);
    (api.getProduct as jest.Mock).mockResolvedValue({...mockProduct, stock: 0});
   
    (useParams as jest.Mock).mockReturnValue({ slug: 'test-product' });

    render(<ProductPage />, { wrapper });

    const payButton = await screen.findByTestId('pmt-button');
    fireEvent.click(payButton);

    expect(usePurchaseProcess).toHaveBeenCalled();
    expect(usePurchaseProcess.mockImplementation(mockStartCheckout)).toHaveBeenCalled();

  });

  test('should show loading skeletons when the product is loading', async () => {
    const store = configureStore({
      reducer: {
        product: () => ({
          data: null,
          loading: true,
          error: null,
        }),
      },
    });

    (useParams as jest.Mock).mockReturnValue({ slug: 'test-product' });

    render(
      <Provider store={store}>
        <ProductPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("skeleton")).toHaveLength(5);
    });
  });
});