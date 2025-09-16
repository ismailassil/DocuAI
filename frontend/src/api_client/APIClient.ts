import axios, { AxiosInstance } from "axios";

export class APIClient {
	private client: AxiosInstance;
	private accessToken!: string;

	constructor(baseURL: string) {
		this.client = axios.create({
			baseURL,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
			withCredentials: true,
		});

		this.setupInterceptors();
	}

	public setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
	}

	private setupInterceptors() {
		this.client.interceptors.request.use((config) => {
			if (this.accessToken) {
				config.headers.Authorization = `Bearer ${this.accessToken}`;
			}

			return config;
		});

		this.client.interceptors.response.use(
			(response) => response,
			// (error) => {
			// 	// Resend another request to refresh the accessToken
			// },
		);
	}
}

const api = new APIClient("http://localhost:8008");
export default api;
