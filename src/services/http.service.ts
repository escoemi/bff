import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
dotenv.config();

export interface HttpWrapperOptions {
    baseUrl?: string;
    headers?: Record<string, string>;
    method?: string;
    body?: any;
}

export const fetchJson = async <T = any>(
    endpoint: string,
    options: HttpWrapperOptions = {}
): Promise<T> => {
    const baseUrl = options.baseUrl || process.env.MAGENTO_URL || '';
    const url = `${baseUrl}${endpoint}`;
    const authorization = `Bearer ${process.env.TOKEN}`;

    const agent = new https.Agent({ rejectUnauthorized: false });
    const { baseUrl: _baseUrl, ...rest } = options;

    const headers: Record<string, string> = { ...rest.headers, 'Authorization': authorization };

    if (rest.body && rest.method && rest.method.toUpperCase() !== 'GET' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const axiosConfig: AxiosRequestConfig & { httpsAgent?: any } = {
        url,
        method: rest.method || 'GET',
        headers,
        httpsAgent: agent,
    };

    if (rest.body) {
        axiosConfig.data = rest.body;
    }
    try {
        const response = await axios(axiosConfig);
        return response.data as T;
    } catch (error: any) {
        // console.log(error);
        let errorMsg = 'HTTP request failed';
        if (error.response) {
            try {
                const errorData = error.response.data;
                errorMsg = errorData.error || errorMsg;
            } catch { }
        }
        throw new Error(errorMsg);
    }
};


// By some reason Magent API doesn't complete the certificate correctly to fix it requires 
// change in the backend that I think it's not in the scope of this course, hence adding
// a dangerous work around.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"
