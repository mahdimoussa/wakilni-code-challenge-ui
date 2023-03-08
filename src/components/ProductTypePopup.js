import { Box, Button, Modal, TextField } from "@mui/material";
import Cookies from "js-cookie";
import React, { useState } from "react";
import axios from "../axios";
import { FaUpload } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

const ProductTypePopup = ({
	open,
	product,
	setIsOpen,
	setProductType,
	setProductTypes,
	searchStr,
}) => {
	const [formError, setFormError] = useState("");
	const stylediv = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		margin: "auto",
	};
	const style = {
		bgcolor: "white",
		borderRadius: "5px",
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
		width: "100%",
	};
	async function handleSubmit() {
		let status = "";
		if (!product.name) {
			setFormError("Please provide a product type name");
			return;
		}
		if (!product.image) {
			setFormError("Please upload an image");
			return;
		}
		setFormError("");
		const formData = new FormData();
		formData.append("image", product.image);
		formData.append("name", product.name);
		if (product?.id) {
			status = "/update";
			formData.append("id", product.id);
		}
		const response = await axios.post(
			`productType${status}?search=${searchStr}`,
			formData,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setProductTypes(response.data.data);
		setProductType({});
		setIsOpen(false);
	}
	async function handleImageChange(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			await new Promise((resolve) => {
				reader.onload = () => {
					resolve();
				};
			});
			setProductType((prev) => ({
				...prev,
				image_url: reader.result,
				image: file,
			}));
		}
	}

	return (
		<Modal
			open={open}
			onClose={() => {
				setIsOpen(false);
				setProductType({});
				setFormError("");
			}}
			aria-labelledby="parent-modal-title"
			aria-describedby="parent-modal-description"
		>
			<div className="popupBoxDiv">
				<Box
					sx={{
						...style,
						display: "flex",
						flexDirection: "column",
						rowGap: "15px",
					}}
				>
					<h2 id="parent-modal-title">
						{product?.id ? "Edit Product Type" : "Add Product Type"}
					</h2>
					<TextField
						id="outlined-basic"
						label="Name"
						variant="outlined"
						value={product.name}
						className={formError ? "inputError" : ""}
						onChange={(e) => {
							setProductType((prev) => ({
								...prev,
								name: e.target.value,
							}));
						}}
					/>
					<img src={product.image_url} className="listImage" />
					{formError && <p className="error">{formError}</p>}
					<div>
						<Button
							variant="contained"
							component="label"
						>
							<FaUpload/>
							<input type="file" hidden onChange={handleImageChange} />
						</Button>
					</div>
					<div
						style={{
							display: "inline-block",
						}}
					>
						<Button
							variant="contained"
							component="label"
							style={{
								backgroundColor: 'green',
							}}
							onClick={handleSubmit}
						>
							<FaCheck/>
						</Button>
					</div>
				</Box>
			</div>
		</Modal>
	);
};

export default ProductTypePopup;
