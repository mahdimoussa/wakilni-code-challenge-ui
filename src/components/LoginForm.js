import axios from "../axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
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

	const handleSubmit = async (event) => {
		event.preventDefault();

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

		if (email !== "" && password !== "") {
			let body = { email, password };
			const res = await axios.post("auth/login", body);
			if (res.data.success) {
				Cookies.set("access_token", res.data.token);
				navigate("/productTypes");
			} else {
				setPasswordError(res.data.error);
			}
		}
	};

	return (
		<div className="box">
			<h2>
				Welcome Again!
			</h2>
			<form onSubmit={handleSubmit}>
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
				<button>
					Sign In
				</button>
				<br></br>
				<Link to="/register">Create an account</Link>
			</form>
		</div>
	);
}

export default LoginForm;
