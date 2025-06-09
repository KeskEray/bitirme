import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import Icon from "@mui/material/Icon";
import { MenuItem, Select, FormControl, InputLabel, Grid, Card, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import addNotification from "../notifications/addNotification";
import { generateExcelBlob } from "../../utils/exportInvoice";

function Billing() {
  const [faturaTipi, setFaturaTipi] = useState("Giden Faturalar");
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const [faturaVerileri, setFaturaVerileri] = useState([]);
  const [filteredVeriler, setFilteredVeriler] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchFaturalar = async () => {
      try {
        const snapshot = await getDocs(collection(db, "invoices"));
        const veriler = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFaturaVerileri(veriler);
        setFilteredVeriler(veriler);
      } catch (error) {
        console.error("Faturalar alınamadı:", error);
      }
    };

    fetchFaturalar();
  }, []);

  const handleFiltrele = () => {
    if (!selectedMonth) {
      setFilteredVeriler(faturaVerileri);
      setShowTable(true);
      return;
    }

    const filtered = faturaVerileri.filter((fatura) => {
      if (!fatura.tarih) return false;

      const dateObj = new Date(fatura.tarih);
      if (isNaN(dateObj.getTime())) return false;

      const faturaMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      return faturaMonth === selectedMonth;
    });

    setFilteredVeriler(filtered);
    setShowTable(true);
  };

  const deleteInvoice = async (invoiceId, username) => {
    try {
      await deleteDoc(doc(db, "invoices", invoiceId));
      await addNotification(username, "warning", "Fatura silindi");
      setFaturaVerileri((prev) => prev.filter((f) => f.id !== invoiceId));
      setFilteredVeriler((prev) => prev.filter((f) => f.id !== invoiceId));
    } catch (error) {
      console.error("Fatura silinemedi:", error);
      await addNotification(username, "error", "Fatura silme işlemi başarısız oldu");
    }
  };

  const handleEdit = (fatura) => {
    localStorage.setItem("duzenlenecekFatura", JSON.stringify(fatura));
    navigate(`/fatura-duzenle/${fatura.id}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={10} px={3}>
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#06b6d4", color: "white", padding: 2 }}>
              <Typography variant="body2">E-Faturalar</Typography>
              <Typography variant="h4">{faturaVerileri.length}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#22c55e", color: "white", padding: 2 }}>
              <Typography variant="body2">Giden E-Faturalar</Typography>
              <Typography variant="h4">{faturaVerileri.length}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: "#ec4899", color: "white", padding: 2 }}>
              <Typography variant="body2">Gelen E-Faturalar</Typography>
              <Typography variant="h4">0</Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="fatura-label">Fatura Tipi</InputLabel>
              <Select
                labelId="fatura-label"
                value={faturaTipi}
                label="Fatura Tipi"
                onChange={(e) => setFaturaTipi(e.target.value)}
                sx={{ height: 55, fontSize: "1rem" }}
              >
                <MenuItem value="Giden Faturalar">Giden Faturalar</MenuItem>
                <MenuItem value="Gelen Faturalar">Gelen Faturalar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Card sx={{ padding: 3, backgroundColor: "#f3f4f6" }} mb={6}>
          <Typography variant="h6" mb={2}>
            E-Fatura Filtreleme
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <MDInput
                type="month"
                fullWidth
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <MDButton color="error" fullWidth onClick={handleFiltrele}>
                Filtrele
              </MDButton>
            </Grid>
            <Grid item xs={12} md={2}>
              <MDButton
                variant="gradient"
                color="dark"
                fullWidth
                onClick={() => navigate("/fatura-olustur")}
              >
                <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                &nbsp; Fatura Oluştur
              </MDButton>
            </Grid>
          </Grid>
        </Card>

        {showTable && (
          <Card sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h6" mb={2}>
              E-Fatura Listesi
            </Typography>
            <Grid container spacing={1} sx={{ fontWeight: "bold", mb: 1 }}>
              <Grid item xs={2}>
                Tarih
              </Grid>
              <Grid item xs={2}>
                VKN/TCKN
              </Grid>
              <Grid item xs={2}>
                Unvan
              </Grid>
              <Grid item xs={1}>
                Belge No
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "center" }}>
                KDV Matrah
              </Grid>
              <Grid item xs={1}>
                KDV
              </Grid>
              <Grid item xs={1}>
                Toplam
              </Grid>
              <Grid item xs={11.8} sx={{ textAlign: "right", pr: 2, mt: -5 }}>
                İşlemler
              </Grid>
            </Grid>

            {filteredVeriler.map((item, index) => (
              <Grid container spacing={1} key={index} sx={{ mb: 1, alignItems: "center" }}>
                <Grid item xs={2}>
                  {item.tarih}
                </Grid>
                <Grid item xs={2}>
                  {item.vknTckn}
                </Grid>
                <Grid item xs={2}>
                  {item.unvan}
                </Grid>
                <Grid item xs={1}>
                  {item.belgeNo}
                </Grid>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                  {item.matrah}
                </Grid>
                <Grid item xs={1}>
                  {item.kdv}
                </Grid>
                <Grid item xs={1}>
                  {item.toplam}
                </Grid>
                <Grid
                  item
                  xs={11.8}
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: -13 }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => {
                      try {
                        const blob = generateExcelBlob(item);
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${item.belgeNo || "fatura"}.xlsx`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url); 
                      } catch (err) {
                        console.error("Excel dosyası oluşturulamadı:", err);
                        alert("Excel dosyası oluşturulurken bir hata oluştu.");
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => deleteInvoice(item.id, item.unvan)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleEdit(item)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Card>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Billing;
