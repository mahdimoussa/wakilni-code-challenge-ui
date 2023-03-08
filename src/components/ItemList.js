import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Checkbox } from "@mui/material";
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import axios from "../axios";
import Cookies from "js-cookie";
import SearchBar from "./SearchBar";

export default function ItemList({
	id,
	items,
	setItems,
	setItem,
	setIsOpen,
	searchStr,
	setSearchStr,
	loading,
	setLoading,
}) {
	const [rows, setRows] = useState([]);

	const columns = [
		{ id: "id", label: "ID", minWidth: "10%", className: "tableTextColumn" },
		{
			id: "serial_number",
			label: "Serial Number",
			minWidth: "20%",
			className: "table-serial-column",
		},
		{
			id: "sold",
			label: "Sold",
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

	function createData(id, serial_number, sold, editBtn, deleteBtn) {
		return { id, serial_number, sold, editBtn, deleteBtn };
	}
	const addItem = async (id) => {
		setItem({});
		setIsOpen(true);
	};
	const editItem = async (id) => {
		setItem({ ...items[id] });
		setIsOpen(true);
	};

	const deleteItem = async (itemId) => {
		const response = await axios.delete(
			`productType/${id}/item/${itemId}?search=${searchStr}`,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setItems(response.data.data);
	};
	const handleCheckBoxClicked = async (singlItem) => {
		setLoading(true);
		singlItem.sold = singlItem.sold > 0 ? 0 : 1;
		const formData = new FormData();
		formData.append("serial_number", singlItem.serial_number);
		formData.append("id", singlItem.id);
		formData.append("sold", singlItem.sold);
		const response = await axios.post(
			`productType/${id}/item/update?search=${searchStr}`,
			formData,
			{
				headers: {
					Authorization: "Bearer " + Cookies.get("access_token"),
				},
			}
		);
		setItems(response.data.data);
		setLoading(false);
	};

	useEffect(() => {
		let rowsArray = items
			? items.map((singleItem, key) =>
				createData(
					singleItem.id,
					singleItem.serial_number,
					<Checkbox
						checked={singleItem.sold > 0}
						onChange={() => {
							handleCheckBoxClicked({ ...items[key] });
						}}
						disabled={loading}
					/>,
					<div>
						<Button
							onClick={() => editItem(key)}
						>
							<FaEdit/>
						</Button>
					</div>,
					<div>
						<Button
							color="error"
							onClick={() => deleteItem(singleItem.id)}
						>
							<FaTrash />
						</Button>
					</div>
				)
			)
			: [];
		setRows(rowsArray);
	}, [items]);

	return (
		<div className="listWrapper login-wrapper">
			<Paper sx={{ width: "100%", overflow: "hidden" }}>
				<div style={{ marginBottom: "30px", fontSize: "24px"}}><b>Items:</b></div>
				<SearchBar
					searchStr={searchStr}
					setSearchStr={setSearchStr}
					handleAddButton={addItem}
				/>
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ width: column.minWidth }}
										className={"item" + column.className}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, idx) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={idx}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ width: column.minWidth }}
													className={"item" + column.className}
												>
													{column.format && typeof value === "number"
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		</div>
	);
}
