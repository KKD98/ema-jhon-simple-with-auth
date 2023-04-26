import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart , setCart] = useState([])

    useEffect(() => {
        fetch('products.json')
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // Step-1: Get ID of the addedProduct
        for(const id in storedCart){
            // Step-2: Get the product from products state by using ID
            const addedProduct = products.find(product => product.id === id)
            if(addedProduct){
                 // Step-3: Get quantity of the product
            const quantity = storedCart[id];
            addedProduct.quantity =quantity;
            // Step-4: add the added product to the savedCart
            savedCart.push(addedProduct);
            }
            // console.log('addedProduct' , addedProduct);
        }
        // Step-5: set the cart
        setCart(savedCart);
    } , [products])

    const handleAddToCart = (product) => {
        // cart.push(product);
        let newCart = [];
        // const newCart = [...cart , product];
        // if product doesn't exist in the cart , then set quantity 1
        // if product  exist then update the quantity

        const exists = cart.find(pd => pd.id === product.id);
        if(!exists){
            product.quantity = 1;
            newCart = [...cart , product];
        }
        else{
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id);
            newCart = [...remaining , exists];
        }
        setCart((newCart));
        addToDb(product.id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product.id}
                        product={product}
                        handleAddToCart = {handleAddToCart}></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart} handleClearCart={handleClearCart}>
                    <Link to="/orders" className='proceed-link'>
                        <button className='btn-proceed'><span>Review Order</span>
                        <FontAwesomeIcon icon={faArrowAltCircleRight}/>
                        </button>
                    </Link>
                </Cart>
            </div>
        </div>
    );
};

export default Shop;