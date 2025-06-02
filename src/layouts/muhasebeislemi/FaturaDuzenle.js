import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Typography, Grid, Card, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import addNotification from "../notifications/addNotification";

const FaturaDuzenle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    vknTckn: "",
    ulke: "",
    vergiDairesi: "",
    adres: "",
    unvan: "",
    tarih: "",
    duzenlemeTarihi: "",
    paraBirimi: "",
    malHizmet: "",
    miktar: "",
    birim: "",
    birimFiyat: "",
    kdv: "",
    not: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const duzenlenecekFatura = JSON.parse(localStorage.getItem("duzenlenecekFatura"));
    if (duzenlenecekFatura) {
      setIsEditMode(true);
      setFormData(duzenlenecekFatura);
    }
  }, []);

  const [matrah, setMatrah] = useState(0);
  const [hesaplananKdv, setHesaplananKdv] = useState(0);
  const [vergiDahilToplam, setVergiDahilToplam] = useState(0);

  const birimler = [
    "Gün",
    "Ay",
    "Yıl",
    "Saat",
    "Dakika",
    "Saniye",
    "Adet",
    "Paket",
    "Kutu",
    "mg",
    "g",
    "kg",
    "lt",
    "ton",
    "m",
    "cm",
  ];
  const kdvOranlari = [0, 1, 8, 18];
  const ulkeler = ["Türkiye", "Almanya", "ABD", "Fransa", "İngiltere"];
  const paraBirimleri = ["TRY", "USD", "EUR", "GBP"];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const miktar = parseFloat(formData.miktar) || 0;
    const birimFiyat = parseFloat(formData.birimFiyat) || 0;
    const kdv = parseFloat(formData.kdv) || 0;

    const hesapMatrah = miktar * birimFiyat;
    const hesapKdv = hesapMatrah * (kdv / 100);
    const toplam = hesapMatrah + hesapKdv;

    setMatrah(hesapMatrah);
    setHesaplananKdv(hesapKdv);
    setVergiDahilToplam(toplam);
  }, [formData.miktar, formData.birimFiyat, formData.kdv]);

  const handleSubmit = async () => {
    const yeniFatura = {
      ...formData,
      belgeNo: isEditMode ? formData.belgeNo || `BELGE-${Date.now()}` : `BELGE-${Date.now()}`,
      matrah: matrah.toFixed(2),
      kdv: hesaplananKdv.toFixed(2),
      toplam: vergiDahilToplam.toFixed(2),
    };

    try {
      if (isEditMode && formData.id) {
        await updateDoc(doc(db, "invoices", formData.id), yeniFatura);

        const user = auth.currentUser;
        if (user) {
          await addNotification(user.displayName || user.email, "info", "Fatura güncellendi");
        }
      }

      localStorage.removeItem("duzenlenecekFatura");
      navigate("/billing");
    } catch (error) {
      console.error("Fatura güncellenemedi:", error);
      await addNotification("HATA", "error", "Fatura güncelleme işlemi başarısız oldu");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card style={{ padding: "2rem" }}>
              <Typography variant="h5" mb={2}>
                {isEditMode ? "Faturayı Düzenle" : "Yeni Fatura Oluştur"}
              </Typography>

              <Typography variant="h6" mt={2}>
                Alıcı Bilgileri
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="ad"
                    label="Ad"
                    value={formData.ad}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="soyad"
                    label="Soyad"
                    value={formData.soyad}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="vknTckn"
                    label="VKN/TCKN"
                    value={formData.vknTckn}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    name="ulke"
                    label="Ülke"
                    value={formData.ulke}
                    onChange={handleChange}
                  >
                    {ulkeler.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="vergiDairesi"
                    label="Vergi Dairesi"
                    value={formData.vergiDairesi}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="adres"
                    label="Adres"
                    value={formData.adres}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="unvan"
                    label="Unvan"
                    value={formData.unvan}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name="tarih"
                    label="Tarih"
                    type="date"
                    value={formData.tarih}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    name="paraBirimi"
                    label="Para Birimi"
                    value={formData.paraBirimi}
                    onChange={handleChange}
                  >
                    {paraBirimleri.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="h6" mt={4}>
                Mal/Hizmet Bilgileri
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Mal/Hizmet"
                    name="malHizmet"
                    value={formData.malHizmet}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Miktar"
                    name="miktar"
                    value={formData.miktar}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Birim"
                    name="birim"
                    value={formData.birim}
                    onChange={handleChange}
                  >
                    {birimler.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Birim Fiyatı"
                    name="birimFiyat"
                    value={formData.birimFiyat}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="KDV"
                    name="kdv"
                    value={formData.kdv}
                    onChange={handleChange}
                  >
                    {kdvOranlari.map((k) => (
                      <MenuItem key={k} value={k}>
                        %{k}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="h6" mt={4}>
                Not
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="not"
                value={formData.not}
                onChange={handleChange}
              />

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" mt={2}>
                Toplamlar Paneli
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Mal/Hizmet Toplam Tutarı: {matrah.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Hesaplanan KDV: {hesaplananKdv.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    Vergiler Dahil Toplam Tutar: {vergiDahilToplam.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                    {isEditMode ? "Faturayı Güncelle" : "Fatura Oluştur"}
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default FaturaDuzenle;
