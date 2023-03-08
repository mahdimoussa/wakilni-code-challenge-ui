import React, { useEffect, useState } from "react";
import axios from "../axios";
import Cookies from "js-cookie";
import ProductItemPopup from "../components/ProductItemPopup";
import { useParams } from "react-router-dom";
import ItemList from "../components/ItemList";

function ProductItems() {
	let { id } = useParams();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState({});
	const [isOpen, setIsOpen] = useState(false);
	const [searchStr, setSearchStr] = useState("");

	const fetchProductItems = async () => {
		const response = await axios.get(
			`productType/${id}/items?search=${searchStr}`,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setItems(response.data.data);
	};

	useEffect(() => {
		fetchProductItems();
	}, [searchStr]);

	return (
		<div>
			<ItemList
				id={id}
				items={items}
				setItems={setItems}
				setItem={setItem}
				setIsOpen={setIsOpen}
				searchStr={searchStr}
				setSearchStr={setSearchStr}
				loading={loading}
				setLoading={setLoading}
			/>
			<ProductItemPopup
				id={id}
				item={item}
				setItem={setItem}
				setItems={setItems}
				open={isOpen}
				setIsOpen={setIsOpen}
				searchStr={searchStr}
				setSearchStr={setSearchStr}
			/>
		</div>
	);
}

export default ProductItems;
