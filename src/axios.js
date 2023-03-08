import React, { useEffect } from "react";
import axios from "axios";
import history from "./history";
import Cookies from "js-cookie";

const instance = axios.create({
	baseURL: process.env.REACT_APP_BASE_URL,
});
const errorHandler = (response) => {
	console.log("axiosError" + response.status);
	if (response.status === 401) {
		Cookies.remove("access_token");
		window.location.href = "/";
	} else {
		return Promise.reject(response.data.errors);
	}
	return Promise.reject({ ...response.status });
};

const successHandler = (response) => {
	return response;
};

instance.interceptors.response.use(
	(response) => successHandler(response),
	(error) => errorHandler(error.response)
);

export default instance;
