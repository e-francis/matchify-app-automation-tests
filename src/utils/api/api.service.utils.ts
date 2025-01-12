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

function convertToBase64(filePath: string): string {
  const absolutePath = path.resolve(filePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64Image = imageBuffer.toString("base64");
  const fileExtension = path.extname(filePath).slice(1);
  return `data:image/${fileExtension};base64,${base64Image}`;
}

async function createUser(userData: UserData) {
  try {
    const response = await axios.post(`${BASE_URL}/create-profile`, userData);
    console.log("User created successfully:", response.data);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

const { userData } = generateOnboardingData();

const createNewUser: UserData = {
  firstName: userData.firstname,
  lastName: userData.lastname,
  email: userData.email,
  dob: "1900-01-01",
  location: "Bremen",
  interests: ["music", "sports", "travel"],
  sex: "male",
  passcode: parseInt(userData.pin),
  profilePicture: convertToBase64("src/test-data/assets/proautopic.jpg"),
};

createUser(createNewUser);
