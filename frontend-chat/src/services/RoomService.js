import { httpClient } from "../config/AxioxHelper"

export const createRoomApi = async (roomDetail)=>{
    const response = await httpClient.post(`/api/v1/rooms`,roomDetail);
    return response;
}

export const joinChatApi = async (roomId)=>{
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
    return response.data;
}

export const getMessages =async (roomId,size=50,page=0)=>{
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}& page=${page}`);
    return response.data;
}