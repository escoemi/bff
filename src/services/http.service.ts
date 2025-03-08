import dotenv from 'dotenv';
dotenv.config();

export interface HttpWrapperOptions extends RequestInit {
    baseUrl?: string;
}


export const fetchJson = async <T = any>(
    endpoint: string,
    options: HttpWrapperOptions = {}
): Promise<T> => {
    const baseUrl = options.baseUrl || process.env.MAGENTO_URL || '';
    const url = `${baseUrl}${endpoint}`;
    const authorization = `Bearer ${process.env.TOKEN}`
    console.log(url)
    console.log(options)
    const response = await fetch(url, {
        ...options,
        headers: { ...options.headers, 'Authorization': authorization }
        
    });
    if (!response.ok) {
        let errorMsg = 'HTTP request failed';
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
        } catch {
        }
        throw new Error(errorMsg);
    }
    
    return await response.json();
};

// By some reason Magent API doesn't complete the certificate correctly to fix it requires 
// change in the backend that I think it's not in the scope of this course, hence adding
// a dangerous work around.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"