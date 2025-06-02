import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Arsiv from "layouts/arsiv/Arsiv";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import FaturaOlustur from "./layouts/muhasebeislemi/FaturaOlustur";
import FaturaDuzenle from "./layouts/muhasebeislemi/FaturaDuzenle";
import Icon from "@mui/material/Icon";
import React from "react";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import ProtectedRoute from "components/ProtectedRoute";

const routes = [
  {
    route: "/billing",
    component: (
      <ProtectedRoute>
        <Billing />
      </ProtectedRoute>
    ),
  },
  {
    route: "/fatura-olustur",
    component: (
      <ProtectedRoute>
        <FaturaOlustur />
      </ProtectedRoute>
    ),
  },
  {
    route: "/notifications",
    component: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    route: "/tables",
    component: (
      <ProtectedRoute>
        <Tables />
      </ProtectedRoute>
    ),
  },
  {
    route: "/",
    component: <SignIn />,
  },
  {
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Ana Sayfa",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Mükellef Yönetimi",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: (
      <ProtectedRoute>
        <Tables />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "E-Arşiv",
    key: "arsiv",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/arsiv",
    component: (
      <ProtectedRoute>
        <Arsiv />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Muhasebe İşlemleri",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: (
      <ProtectedRoute>
        <Billing />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Fatura Oluştur",
    key: "faturaoluştur",
    icon: <Icon fontSize="small">create fatura</Icon>,
    route: "/fatura-olustur",
    component: (
      <ProtectedRoute>
        <FaturaOlustur />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Bildirimler",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    type: "collapse",
    name: "Profil",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    route: "/fatura-duzenle/:id",
    component: (
      <ProtectedRoute>
        <FaturaDuzenle />
      </ProtectedRoute>
    ),
  },
];

export default routes;
