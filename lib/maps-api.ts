import { Client } from '@googlemaps/google-maps-services-js';
import axios from 'axios';

export const axiosInstance = axios.create();
export const mapsApiClient = new Client({ axiosInstance });
