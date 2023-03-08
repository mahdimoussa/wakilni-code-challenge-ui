import { Box, Button, Modal, TextField } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FaCheck } from 'react-icons/fa';
import Quagga from "quagga";
import axios from "../axios";

const ProductItemPopup = ({
	id,
	open,
	item,
	setIsOpen,
	setItem,
	setItems,
	searchStr,
}) => {
	const [formError, setFormError] = useState("");
	const [openBarcodeReader, setOpenBarcodeReader] = useState(false);
	const stylediv = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		margin: "auto",
	};
	const style = {
		bgcolor: "background.paper",
		borderRadius: "5px",
		boxShadow: 20,
		pt: 2,
		px: 4,
		pb: 3,
		width: "100%",
	};
	const initBarcodeScanner = () => {
		Quagga.init(
			{
				inputStream: {
					name: "Live",
					type: "LiveStream",
					target: document.getElementById("scannerContainer"),
				},
				decoder: {
					readers: ["code_128_reader"],
				},
			},
			function (err) {
				if (err) {
					console.log(err);
					return;
				}
				Quagga.start();
			}
		);
		Quagga.onDetected((result) => {
			let SingleItem = { ...item };
			SingleItem.serial_number = result.codeResult.code;
			setItem(SingleItem);
			setOpenBarcodeReader(false);
			Quagga.stop();
			document.querySelector("#scannerContainer").innerHTML = "";
		});
	};
	useEffect(() => {
		if (openBarcodeReader) {
			initBarcodeScanner();
		}
	}, [openBarcodeReader]);

	async function handleSubmit() {
		let status = "";
		if (!item.serial_number) {
			setFormError("Please provide a serial number");
			return;
		}
		setFormError("");
		const formData = new FormData();
		formData.append("serial_number", item.serial_number);
		if (item?.id) {
			status = "/update";
			formData.append("id", item.id);
			formData.append("sold", item.sold);
		} else {
			formData.append("sold", 0);
		}
		const response = await axios.post(
			`productType/${id}/item${status}?search=${searchStr}`,
			formData,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setItems(response.data.data);
		setItem({});
		setIsOpen(false);
	}
	return (
		<Modal
			open={open}
			onClose={() => {
				try {
					Quagga.stop();
				} catch (e) {
					console.log(e);
				} finally {
					setOpenBarcodeReader(false);
					setFormError("");
					setItem({});
					setIsOpen(false);
				}
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
					<h2 id="parent-modal-title">{item?.id ? "Edit Item" : "Add Item"}</h2>
					<TextField
						id="outlined-basic"
						placeholder="Serial Number"
						variant="outlined"
						value={item.serial_number}
						className={formError ? "inputError" : ""}
						onChange={(e) => {
							setItem((prev) => ({
								...prev,
								serial_number: e.target.value,
							}));
						}}
					/>
					<div>
						<Button
							variant="contained"
							component="label"
							style={{ backgroundColor: "red" }}
							onClick={() => {
								if (openBarcodeReader) {
									Quagga.stop();
									document.querySelector("#scannerContainer").innerHTML = "";
								}
								setOpenBarcodeReader((prev) => !prev);
							}}
						>
							{openBarcodeReader ? "Close" : "Scan Barcode"}
						</Button>
					</div>
					<div
						id="scannerContainer"
						style={{ width: "100%", height: "100%" }}
					></div>
					{formError && <p className="error">{formError}</p>}
					<div>
						<Button
							variant="contained"
							component="label"
							style={{ backgroundColor: "green" }}
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

export default ProductItemPopup;
