import axios from 'axios';

// axios.defaults.baseURL = "http://localhost:8082/api/v1";
const token = JSON.parse(localStorage.getItem('token'));

const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};
// export const get = async (url) => axios.get(url, config);

export const get = async (url) => axios.get(url);

export const create = async (data) => axios.post(data.path, data);

export const update = async (data) => axios.put(data.path, data);

export const getById = async (url) => axios.get(url);

export const getByIdandType = async (data) => axios.post(data.path, { type: data.type });
//to do: need to try with axio
export const createWithUpload = async (data) => fetch(data.path, data);

export const updateWithUpload = async (data) => fetch(data.path, data);
