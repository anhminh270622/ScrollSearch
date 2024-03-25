import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './scroll.scss'
import { Header } from '../header';
const App = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const loader = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = searchTerm
                    ? `https://dummyjson.com/products/search?q=${searchTerm}&skip=${(page - 1) * 20}&limit=20`
                    : `https://dummyjson.com/products?skip=${(page - 1) * 20}&limit=20`;
                const response = await axios.get(url);
                return response.data.products;
            } catch (error) {
                console.error("Failed to fetch products:", error);
                return [];
            }
        };

        fetchProducts().then(newProducts => {
            if (page === 1) {
                setProducts(newProducts);
            } else {
                setProducts(prevProducts => [...prevProducts, ...newProducts]);
            }
        });
    }, [page, searchTerm]);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => observer.disconnect();
    }, []);
    const handleSearchChange = (e) => {
        setPage(1);
        setSearchTerm(e.target.value);
    };
    return (
        <div className="scroll">
            <Header searchValue={searchTerm} onSearchChange={handleSearchChange} />
            <div className="products-list">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product-item">
                            <img src={product.thumbnail} alt={product.title} />
                            <div className="info">
                                <div className="category">{product.category} </div>
                                <div className="title">{product.title} </div>
                                <div className="price">Giá: {product.price}đ</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">Không có sản phẩm</div>
                )}
            </div>
            <div ref={loader} />
        </div>
    );
};

export default App;
