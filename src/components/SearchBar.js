import React from "react";
import { FaPlus } from 'react-icons/fa';
function SearchBar({ searchStr, setSearchStr, handleAddButton }) {
	return (
		<div className="searchBar">
			<input
				type="text"
				placeholder="Search"
				value={searchStr}
				onChange={(e) => {
					setSearchStr(e.target.value);
				}}
			/>
			<button className="addButton" onClick={handleAddButton}>
      			<FaPlus />
			</button>
		</div>
	);
}

export default SearchBar;
