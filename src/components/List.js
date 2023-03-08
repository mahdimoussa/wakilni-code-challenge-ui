import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
import axios from "../axios";
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function List({
	products,
	setProductTypes,
	setProductType,
	setIsOpen,
	searchStr,
	setSearchStr,
}) {
	const [rows, setRows] = useState([]);
	const navigate = useNavigate();

	const columns = [
		{ id: "id", label: "ID", minWidth: "10%", className: "tableTextColumn" },
		{
			id: "name",
			label: "Name",
			minWidth: "10%",
			className: "tableTextColumn",
		},
		{
			id: "image",
			label: "Image",
			minWidth: "20%",
			className: "tableImageColumn",
			format: (value) => value.toLocaleString("en-US"),
		},
		{
			id: "count",
			label: "In Stock",
			minWidth: "10%",
			className: "tableTextColumn",
			format: (value) => value.toLocaleString("en-US"),
		},
		{
			id: "editBtn",
			label: "",
			minWidth: "10%",
			align: "right",
			className: "tableButtonColumn",
		},
		{
			id: "deleteBtn",
			label: "",
			minWidth: "10%",
			align: "right",
			className: "tableButtonColumn",
		},
	];

	function createData(id, name, image, count, editBtn, deleteBtn) {
		return { id, name, image, count, editBtn, deleteBtn };
	}
	const editProductType = async (id) => {
		setProductType({ ...products[id] });
		setIsOpen(true);
	};
	const addProductType = async (id) => {
		setProductType({});
		setIsOpen(true);
	};

	const deleteProductType = async (id) => {
		const response = await axios.delete(
			`productType/${id}?search=${searchStr}`,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setProductTypes(response.data.data);
	};

	useEffect(() => {
		let rowsArray = products.map((product, key) =>
			createData(
				product.id,
				product.name,
				<img
					src={product.image_url}
					className="listImage"
				/>,
				product.count,
				<div>
					<Button
						color="success"
						onClick={() => editProductType(key)}
					>
						<FaEdit />
					</Button>
				</div>,
				<div>
					<Button
						color="error"
						onClick={() => deleteProductType(product.id)}
					>
						<FaTrash />
					</Button>
				</div>
			)
		);
		setRows(rowsArray);
	}, [products]);

	return (
		<div className="listWrapper login-wrapper">
			<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<div style={{ marginBottom: "30px", fontSize: "24px"}}><b>Product Types:</b></div>
				<SearchBar
					searchStr={searchStr}
					setSearchStr={setSearchStr}
					handleAddButton={addProductType}
				/>
				<TableContainer >
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ width: column.minWidth }}
										className={column.className}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, idx) => {
								return (
									<tr role="checkbox" tabIndex={-1} key={idx}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ width: column.minWidth }}
													className={column.className}
													onClick={() => {
														if (
															column.id === "id" ||
															column.id === "name" ||
															column.id === "count"
														) {
															navigate(`${row["id"]}`);
														}
													}}
												>
													{column.format && typeof value === "number"
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</tr>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}
