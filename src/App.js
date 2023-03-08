import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Items from "./pages/Items";
import Login from "./pages/Login";
import ProductTypes from "./pages/ProductTypes";
import Signup from "./pages/Signup";
import "./pages/General.css";

function App() {
	let location = useLocation();
	return (
		<Routes location={location} key={location.key}>
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Signup />} />
			<Route path="/productTypes" element={<ProductTypes />} />
			<Route path="/productTypes/:id" element={<Items />} />
		</Routes>
	);
}

export default App;
