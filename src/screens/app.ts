import { autoInjectable } from "tsyringe";
import LaunchApp from "./welcome.screen";
import Login from "./auth/login";

@autoInjectable()
export default class App {
  welcomeScreen: LaunchApp;
  login: Login;

  constructor(welcomeScreen: LaunchApp, login: Login) {
    this.welcomeScreen = welcomeScreen;
    this.login = login;
  }
}
