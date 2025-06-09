import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) return alert("Lütfen e-posta adresinizi girin.");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Şifre yenileme bağlantısı e-posta adresinize gönderildi.");
      navigate("/authentication/sign-in");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={3}
          textAlign="center"
        >
          <MDTypography variant="h5" color="white">Şifreni mi unuttun?</MDTypography>
          <MDTypography variant="body2" color="white">E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.</MDTypography>
        </MDBox>
        <MDBox p={3}>
          <MDInput
            type="email"
            label="E-posta"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBox mt={3}>
            <MDButton color="info" fullWidth onClick={handleResetPassword}>
              Sıfırlama Bağlantısı Gönder
            </MDButton>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default ForgotPassword;
