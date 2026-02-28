import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enLogin from "./locales/en/login.json";
import hiLogin from "./locales/hi/login.json";
import guLogin from "./locales/gu/login.json";
import mrLogin from "./locales/mr/login.json";

import enDashboard from "./locales/en/dashboard.json";
import hiDashboard from "./locales/hi/dashboard.json";
import guDashboard from "./locales/gu/dashboard.json";
import mrDashboard from "./locales/mr/dashboard.json";

import enElectricity from "./locales/en/electricity.json";
import hiElectricity from "./locales/hi/electricity.json";
import guElectricity from "./locales/gu/electricity.json";
import mrElectricity from "./locales/mr/electricity.json";

import enMunicipality from "./locales/en/municipality.json";
import hiMunicipality from "./locales/hi/municipality.json";
import guMunicipality from "./locales/gu/municipality.json";
import mrMunicipality from "./locales/mr/municipality.json";

import enGas from "./locales/en/gas.json";
import hiGas from "./locales/hi/gas.json";
import guGas from "./locales/gu/gas.json";
import mrGas from "./locales/mr/gas.json";

import enWater from "./locales/en/water.json";
import hiWater from "./locales/hi/water.json";
import guWater from "./locales/gu/water.json";
import mrWater from "./locales/mr/water.json";

import enWelcome from "./locales/en/welcome.json";
import hiWelcome from "./locales/hi/welcome.json";
import guWelcome from "./locales/gu/welcome.json";
import mrWelcome from "./locales/mr/welcome.json";

import enCommon from "./locales/en/common.json";
import hiCommon from "./locales/hi/common.json";
import guCommon from "./locales/gu/common.json";
import mrCommon from "./locales/mr/common.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        login: enLogin,
        dashboard: enDashboard,
        electricity: enElectricity,
        welcome: enWelcome,
        common: enCommon,
        municipality: enMunicipality,
        gas: enGas,
        water: enWater
      },
      hi: {
        login: hiLogin,
        dashboard: hiDashboard,
        electricity: hiElectricity,
        welcome: hiWelcome,
        common: hiCommon,
        municipality: hiMunicipality,
        gas: hiGas,
        water: hiWater
      },
      gu: {
        login: guLogin,
        dashboard: guDashboard,
        electricity: guElectricity,
        welcome: guWelcome,
        common: guCommon,
        municipality: guMunicipality,
        gas: guGas,
        water: guWater
      },
      mr: {
        login: mrLogin,
        dashboard: mrDashboard,
        electricity: mrElectricity,
        welcome: mrWelcome,
        common: mrCommon,
        municipality: mrMunicipality,
        gas: mrGas,
        water: mrWater
      }
    },

    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",

    ns: [
      "login",
      "dashboard",
      "electricity",
      "welcome",
      "common",
      "municipality",
      "gas",
      "water"
    ],
    defaultNS: "login",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;