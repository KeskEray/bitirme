import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import LogoutIcon from "@mui/icons-material/Logout";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import homeDecor1 from "assets/images/home-decor-1.jpg";

function Overview() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
      } else {
        navigate("/authentication/sign-in");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/authentication/sign-in");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <MDBox
        position="relative"
        mb={5}
        borderRadius="xl"
        p={3}
        sx={{
          backgroundImage: `url(${homeDecor1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <MDBox mt={6} mb={3} display="flex" justifyContent="center">
          <Card sx={{ width: 400, p: 4, borderRadius: 3, boxShadow: 6 }}>
            <MDTypography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
              Kullanıcı Bilgileri
            </MDTypography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-posta"
                  variant="outlined"
                  value={email}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Şifre"
                  variant="outlined"
                  type="password"
                  value={password}
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={handleSignOut}
                >
                  Profilden Çık
                </Button>
              </Grid>
            </Grid>
          </Card>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Overview;
