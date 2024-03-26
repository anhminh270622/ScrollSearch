import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './scroll.scss';
import { Header } from '../header';
import Loading from '../loading';

const App = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true); // Trạng thái mới để kiểm tra còn dữ liệu không
    const loader = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!hasMore) return;
            setIsLoading(true);
            const skipCount = (page - 1) * 20;
            let url = searchTerm
                ? `https://dummyjson.com/products/search?q=${searchTerm}&skip=${skipCount}&limit=20`
                : `https://dummyjson.com/products?skip=${skipCount}&limit=20`;

            try {
                const response = await axios.get(url);
                const newProducts = response.data.products;
                if (newProducts.length < 20) {
                    setHasMore(false);
                }
                if (page === 1) {
                    setProducts(newProducts);
                } else {
                    setProducts(prevProducts => [...prevProducts, ...newProducts]);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page, searchTerm, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const firstEntry = entries[0];
            if (firstEntry.isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.1 });

        const currentLoader = loader.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasMore]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
        setHasMore(true);
    };

    return (
        <div className="scroll">
            <Header searchValue={searchTerm} onSearchChange={handleSearchChange} />
            {isLoading && <Loading />}
            <div className="products-list">
                {products.map(product => (
                    <div key={product.id} className="product-item">
                        <img src={product.thumbnail} alt={product.title} />
                        <div className="info">
                            <div className="category">{product.category}</div>
                            <div className="title">{product.title}</div>
                            <div className="price">Giá: {product.price}đ</div>
                        </div>
                    </div>
                ))}
                {!isLoading && products.length === 0 && !hasMore && (
                    <div className="no-products">Không có sản phẩm để hiển thị</div>
                )}
            </div>
            <div className="loader" ref={loader}></div>
        </div>
    );
};

export default App;
