import React, { useEffect, useState } from "react";
import List from "../components/List";
import axios from "../axios";
import Cookies from "js-cookie";
import ProductTypePopup from "../components/ProductTypePopup";

function ProductTypes() {
	const [productsTypes, setProductTypes] = useState([]);
	const [loading, setLoading] = useState([]);
	const [productType, setProductType] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [searchStr, setSearchStr] = useState("");

	const fetchProductTypes = async () => {
		const response = await axios.get(`productTypes?search=${searchStr}`, {
			headers: {
				Authorization: "Bearer " + Cookies.get("access_token"),
			},
		});
		console.log(response.data.data);
		setProductTypes(response.data.data);
	};

	useEffect(() => {
		fetchProductTypes();
	}, [searchStr]);

	return (
		<div>
			<List
				products={productsTypes}
				setProductTypes={setProductTypes}
				setProductType={setProductType}
				setIsOpen={setIsOpen}
				searchStr={searchStr}
				setSearchStr={setSearchStr}
			/>
			<ProductTypePopup
				product={productType}
				setProductType={setProductType}
				setProductTypes={setProductTypes}
				open={isOpen}
				setIsOpen={setIsOpen}
				searchStr={searchStr}
				setSearchStr={setSearchStr}
			/>
		</div>
	);
}

export default ProductTypes;
