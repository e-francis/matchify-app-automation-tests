import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { generateOnboardingData } from "../helpers/user.data";

dotenv.config();

const BASE_URL = process.env.BASE_URL;

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  location: string;
  interests: string[];
  sex: string;
  passcode: number;
  profilePicture: string;
}

interface APIResponse {
  message: string;
  profileId: string;
}

export let loginCredentials: { email: string; passcode: number } | null = null;

function convertToBase64(filePath: string): string {
  const absolutePath = path.resolve(filePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64Image = imageBuffer.toString("base64");
  const fileExtension = path.extname(filePath).slice(1);
  return `data:image/${fileExtension};base64,${base64Image}`;
}

export async function createUser(
  userData: UserData
): Promise<APIResponse | null> {
  try {
    const response = await axios.post(`${BASE_URL}/create-profile`, userData);
    console.log("User created successfully:", response.data);

    loginCredentials = {
      email: userData.email,
      passcode: userData.passcode,
    };

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

const { userData } = generateOnboardingData();

export const createNewUser: UserData = {
  firstName: userData.firstname,
  lastName: userData.lastname,
  email: userData.email,
  dob: userData.dob,
  location: userData.location,
  interests: ["music", "sports", "travel"],
  sex: userData.sex,
  passcode: parseInt(userData.pin),
  profilePicture: convertToBase64("src/test-data/assets/proautopic.jpg"),
};
