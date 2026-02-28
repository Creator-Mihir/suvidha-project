import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enLogin from "./locales/en/login.json";
import hiLogin from "./locales/hi/login.json";
import enDashboard from "./locales/en/dashboard.json";
import hiDashboard from "./locales/hi/dashboard.json";
import enElectricity from "./locales/en/electricity.json";
import hiElectricity from "./locales/hi/electricity.json";
import guLogin from "./locales/gu/login.json";
import mrLogin from "./locales/mr/login.json";
import guDashboard from "./locales/gu/dashboard.json";
import mrDashboard from "./locales/mr/dashboard.json";
import enWelcome from "./locales/en/welcome.json";
import hiWelcome from "./locales/hi/welcome.json";
import guWelcome from "./locales/gu/welcome.json";
import mrWelcome from "./locales/mr/welcome.json";
import guElectricity from "./locales/gu/electricity.json";
import mrElectricity from "./locales/mr/electricity.json";
import enElectricitymenu from "./locales/en/electricitymenu.json";
import hiElectricitymenu from "./locales/hi/electricitymenu.json";
import mrElectricitymenu from "./locales/mr/electricitymenu.json";
import guElectricitymenu from "./locales/gu/electricitymenu.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
        en: {
            login: enLogin,
            dashboard: enDashboard,
            electricity: enElectricity,
            welcome: enWelcome,
            electricityMenu:enElectricitymenu
          },
          hi: {
            login: hiLogin,
            dashboard: hiDashboard,
            electricity: hiElectricity,
            welcome: hiWelcome,
            electricityMenu:hiElectricitymenu
          },
          gu: {
            login: guLogin,
            dashboard: guDashboard,
            electricity: guElectricity,
            welcome: guWelcome,
            electricityMenu:guElectricitymenu
          },
          mr: {
            login: mrLogin,
            dashboard: mrDashboard,
            electricity: mrElectricity,
            welcome: mrWelcome,
            electricityMenu: mrElectricitymenu
          }
    },

    lng: localStorage.getItem("lang") || "en",

    fallbackLng: "en",

    ns: ["login", "dashboard", "electricity","welcome","electricityMenu"],   // ✅ all namespaces here
    defaultNS: "login",           // ✅ default namespace

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;