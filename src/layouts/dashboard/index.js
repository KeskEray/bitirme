import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Dashboard() {
  const [faturaSayisi, setFaturaSayisi] = useState(0);

  useEffect(() => {
    const fetchFaturaCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "invoices"));
        setFaturaSayisi(snapshot.size);
      } catch (error) {
        console.error("Fatura sayısı alınamadı:", error);
      }
    };

    fetchFaturaCount();
  }, []);

  const cards = [
    {
      title: faturaSayisi.toString(),
      subtitle: "Oluşturulan Faturalar",
      button: "Muhasebe İşlemleri",
      link: "/billing",
      color: "#377096",
    },
    {
      title: "Fatura Oluştur",
      subtitle: "Yeni fatura ekle",
      button: "Fatura Oluştur",
      link: "/fatura-olustur",
      color: "#119668",
    },
    {
      title: "Bildirimler",
      subtitle: "Yeni bildirimleri görüntüle",
      button: "Bildirimler",
      link: "/notifications",
      color: "#c5165a",
    },
    {
      title: "Mükellef Yönetimi",
      subtitle: "Mükellefleri düzenle",
      button: "Mükelleflere Git",
      link: "/tables",
      color: "#631d71",
    },
    {
      title: "E-Arşiv",
      subtitle: "Fatura Arşivi",
      button: "E-Arşive Git",
      link: "/arsiv",
      color: "#943623",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={8} px={2}>
        <Grid container spacing={2}>
          {cards.map((card, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                sx={{
                  backgroundColor: card.color,
                  color: "#fff",
                  padding: 8,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ color: "#fff", fontSize: "2rem" }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2">{card.subtitle}</Typography>
                </div>
                <Button
                  component={Link}
                  to={card.link}
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#fff",
                    color: card.color,
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {card.button}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
