import { injectable, inject } from "tsyringe";
import LaunchApp from "./welcome.screen.ts";
import Login from "./auth/login.ts";
import ProfileCreation from "./onboarding/profile.creation.ts";

@injectable()
export default class App {
  constructor(
    @inject(LaunchApp) public welcomeScreen: LaunchApp,
    @inject(Login) public login: Login,
    @inject(ProfileCreation) public profileCreation: ProfileCreation
  ) {}
}
