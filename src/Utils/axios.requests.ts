import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
require('dotenv').config();
/**
 * Test the BackEnd API
 */
const ax_instance = axios.create({
    baseURL: process.env.WC_BACKEND_URL,
    timeout: 20000
  });
  
async function axiosRequest(config: AxiosRequestConfig): Promise<AxiosResponse<any,any>> {
  return await ax_instance.request(config)
}

export {axiosRequest, AxiosRequestConfig, AxiosResponse};