import { User } from "@/models/user";
import api from "@/network/axiosInstance";

interface SignUpValues {
    username:string,
    email:string,
    password:string,
    verificationCode:string,
}

export async function sinUp(credentials:SignUpValues) {
    const response = await api.post<User>("/users/signup", credentials);
    return response.data;
}

export async function requestEmailVerificationCode(email:string) {
    await api.post("/users/verification-code",{email});
}

interface LoginValues {
    username:string,
    password:string,
}

export async function login(credentials:LoginValues) {
    const response = await api.post<User>("/users/login", credentials);
    return response.data;
}

export async function getAuthenticatedUser() {
    const response = await api.get<User>("/users/me");
    return response.data;
}

export async function logout() {
    await api.post("/users/logout");
}

export async function getUserByUsername(username:string) {
    const response = await api.get<User>("/users/profile/"+username);
    return response.data;
}

interface UpdateUserValues {
    username?:string,
    displayName?:string,
    about?:string,
    profileImage?:File,
}

export async function updateUser(input:UpdateUserValues) {
    const formData = new FormData();
    Object.entries(input).forEach(([key,value]) => {
        if(value !== undefined) formData.append(key,value); 
    });
    const response = await api.patch<User>("/users/me", formData);
    return response.data;
}