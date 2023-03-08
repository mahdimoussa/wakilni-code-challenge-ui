import axios from "../axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function SignupForm() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [nameError, setNameError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const handleEmailChange = (event) => {
		if (event.target.value) {
			setEmailError("");
		}
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		if (event.target.value) {
			setPasswordError("");
		}
		setPassword(event.target.value);
	};

	const handleNameChange = (event) => {
		if (event.target.value) {
			setNameError("");
		}
		setName(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (name === "") {
			setNameError("Password is required.");
			return;
		} else {
			setNameError("");
		}
		if (email === "") {
			setEmailError("Email is required.");
			return;
		} else {
			setEmailError("");
		}
		if (password === "") {
			setPasswordError("Password is required.");
			return;
		} else {
			setPasswordError("");
		}

		if (email !== "" && password !== "" && name !== "") {
			let body = { email, password, name };
			const res = await axios.post("auth/register", body);
			console.log(res.data);
			if (res.data.success) {
				Cookies.set("access_token", res.data.token);
				navigate("/productTypes");
			}
		}
	};

	return (
		<div
			className="box"
		>
			<h2>
				Register
			</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-wrapper">
					<label htmlFor="name">Name</label>
					<input
						type="name"
						id="name"
						value={name}
						onChange={handleNameChange}
						className={nameError ? "inputError" : ""}
					/>
					{nameError && <p className="error">{nameError}</p>}
				</div>
				<div className="form-wrapper">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={handleEmailChange}
						className={emailError ? "inputError" : ""}
					/>
					{emailError && <p className="error">{emailError}</p>}
				</div>
				<div className="form-wrapper">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={handlePasswordChange}
						className={passwordError ? "inputError" : ""}
					/>
					{passwordError && <p className="error">{passwordError}</p>}
				</div>
				<button
					style={{
						display: "inline-block",
					}}
					type="submit"
				>
					Submit
				</button>
				<br></br>
				<Link to="/login">Back to login form</Link>
			</form>
		</div>
	);
}

export default SignupForm;
