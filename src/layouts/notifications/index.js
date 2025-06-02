import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(collection(db, "notifications"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(data);
        setFilteredNotifications(data);
      } catch (err) {
        console.error("Bildirimler alınamadı:", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleFilter = () => {
    if (!selectedDate) return;
    const filtered = notifications.filter((notif) => {
      const notifDate = new Date(notif.date.seconds * 1000);
      const formatted = notifDate.toISOString().split("T")[0];
      return formatted === selectedDate;
    });
    setFilteredNotifications(filtered);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Bildirimler</MDTypography>
              </MDBox>
              <MDBox pt={3} px={3} display="flex" gap={2} alignItems="center">
                <MDInput
                  type="date"
                  label="Tarih Seçin"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <MDButton color="info" onClick={handleFilter}>
                  Filtrele
                </MDButton>
              </MDBox>
              <MDBox pt={2} px={2}>
                {filteredNotifications.map((notif) => (
                  <MDAlert key={notif.id} color={notif.type} dismissible>
                    <strong>{notif.username}</strong> –{" "}
                    {new Date(notif.date?.seconds * 1000).toLocaleString("tr-TR")} tarihinde{" "}
                    {notif.message}.
                  </MDAlert>
                ))}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
