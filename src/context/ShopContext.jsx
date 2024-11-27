import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';
import { products } from '../assets/assets';
import { useNavigate } from 'react-router-dom';


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowsearch] = useState({});

    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();


    const addToCart = (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size');
            return;
        }

        let cartData = { ...cartItems };
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                totalCount += cartItems[items][item];
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            let itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo) { // Ensure itemInfo is found
                for (const size in cartItems[itemId]) {
                    try {
                        if (cartItems[itemId][size] > 0) {
                            totalAmount += itemInfo.price * cartItems[itemId][size];
                        }
                    } catch (error) {
                        console.error(`Error processing item ${itemId} size ${size}:`, error);
                    }
                }
            } else {
                console.warn(`Product with id ${itemId} not found`);
            }
        }
        return totalAmount;
    }

    const value = {
        products,
        currency,
        delivery_fee,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContextProvider;
