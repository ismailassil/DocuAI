import axios, { AxiosInstance } from "axios";

export class APIClient {
	public client: AxiosInstance;
	private accessToken: string = "";
	private baseURL: string;

	constructor(baseURL: string) {
		this.baseURL = baseURL;
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

	public clearAccessToken() {
		this.accessToken = "";
	}

	private setupInterceptors() {
		this.client.interceptors.request.use(
			(config) => {
				if (
					this.accessToken &&
					this.accessToken.length !== 0 &&
					!config.headers.Authorization
				) {
					config.headers.Authorization = `Bearer ${this.accessToken}`;
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		this.client.interceptors.response.use(
			(response) => response,
			async (error) => {
				// Resend another request to refresh the accessToken
				const prevRequest = error?.config;
				if (error?.response.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const { token } = await this.refresh();
					prevRequest.headers.Authorization = `Bearer ${token}`;
					return this.client(prevRequest);
				}
				return Promise.reject(error);
			},
		);
	}

	public async refresh() {
		try {
			const res = await axios.post(
				this.baseURL + "/auth/refresh-token",
				{},
				{ withCredentials: true },
			);
			console.log(res.data);
			return { token: res.data.token, userData: res.data.data };
		} catch (error) {
			console.log("Refresh Token", error);
			this.clearAccessToken();
			throw error;
		}
	}
}
