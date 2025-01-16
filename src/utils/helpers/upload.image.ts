import { selectors } from "../../../config/environment";
import path from "path";
import fs from "fs";

export default class ImageUploadHelper {
  private readonly selectors = selectors;

  private readonly elements = {
    uploadPhotoButton: () =>
      $(this.selectors.onboardingSelectors.uploadPhotoButton),
    imagePlaceholder: () =>
      $(this.selectors.onboardingSelectors.profilePicturePlaceHolder),
    selectFirstPicture: () =>
      $(this.selectors.onboardingSelectors.selectFirstPicture),
  };

  private readonly VALID_IMAGE_PATH = "src/test-data/assets/proautopic.jpg";
  private readonly INVALID_IMAGE_PATH =
    "src/test-data/assets/invalidimage.heic";
  private readonly LARGE_IMAGE_PATH = "src/test-data/assets/large-image.jpg";

  public async uploadValidProfileImage() {
    try {
      const imagePath = path.resolve(process.cwd(), this.VALID_IMAGE_PATH);

      if (driver.isAndroid) {
        const fileContent = fs.readFileSync(imagePath, { encoding: "base64" });
        const remotePath = `/sdcard/Pictures/${path.basename(imagePath)}`;
        await driver.pushFile(remotePath, fileContent);
        console.log(`File pushed to Android device at: ${remotePath}`);
        await browser.pause(5000);
        const uploadButton = this.elements.uploadPhotoButton();
        await uploadButton.waitForDisplayed({ timeout: 5000 });
        await uploadButton.click();
        console.log("Clicked the upload photo button.");

        await this.elements.selectFirstPicture().click();
      } else {
        const remoteFilePath = await browser.uploadFile(imagePath);
        await this.elements.imagePlaceholder().setValue(remoteFilePath);
        console.log("Valid profile image uploaded successfully (iOS).");
      }
    } catch (error) {
      console.error("Failed to upload valid profile image:", error);
      throw error;
    }
  }

  public async uploadInvalidProfileImage() {
    try {
      const imagePath = path.resolve(process.cwd(), this.INVALID_IMAGE_PATH);

      console.log("Clicked the upload photo button.");

      if (driver.isAndroid) {
        const fileContent = fs.readFileSync(imagePath, { encoding: "base64" });
        const remotePath = `/sdcard/Pictures/${path.basename(imagePath)}`;
        await driver.pushFile(remotePath, fileContent);
        console.log(`File pushed to Android device at: ${remotePath}`);
        await browser.pause(5000);
        const uploadButton = this.elements.uploadPhotoButton();
        await uploadButton.waitForDisplayed({ timeout: 5000 });
        await uploadButton.click();
        console.log("Clicked the upload photo button.");

        await this.elements.selectFirstPicture().click();
      } else {
        const remoteFilePath = await browser.uploadFile(imagePath);
        await this.elements.imagePlaceholder().setValue(remoteFilePath);
        console.log("Invalid profile image uploaded successfully (iOS).");
      }
    } catch (error) {
      console.error("Failed to upload invalid profile image:", error);
      throw error;
    }
  }

  public async uploadLargeProfileImage() {
    try {
      const imagePath = path.resolve(process.cwd(), this.LARGE_IMAGE_PATH);

      if (driver.isAndroid) {
        const fileContent = fs.readFileSync(imagePath, { encoding: "base64" });
        const remotePath = `/sdcard/Pictures/${path.basename(imagePath)}`;
        await driver.pushFile(remotePath, fileContent);
        console.log(`File pushed to Android device at: ${remotePath}`);
        await browser.pause(5000);
        const uploadButton = this.elements.uploadPhotoButton();
        await uploadButton.waitForDisplayed({ timeout: 5000 });
        await uploadButton.click();
        console.log("Clicked the upload photo button.");

        await this.elements.selectFirstPicture().click();
      } else {
        const remoteFilePath = await browser.uploadFile(imagePath);
        await this.elements.imagePlaceholder().setValue(remoteFilePath);
        console.log("Valid profile image uploaded successfully (iOS).");
      }
    } catch (error) {
      console.error("Failed to upload valid profile image:", error);
      throw error;
    }
  }
}
