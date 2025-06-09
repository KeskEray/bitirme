import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Typography, Grid, Card, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import addNotification from "../notifications/addNotification";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { generateExcelBlob } from "../../utils/exportInvoice";

const FaturaOlustur = () => {
  const navigate = useNavigate();
  const [excelUrl, setExcelUrl] = useState(null);
  const [aktifMukellefler, setAktifMukellefler] = useState([]);
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
  const kdvOranlari = [0, 1, 10, 20];
  const ulkeler = ["Türkiye", "Almanya", "ABD", "Fransa", "İngiltere"];
  const paraBirimleri = ["TRY", "USD", "EUR", "GBP"];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchMukellefler = async () => {
      const snapshot = await getDocs(collection(db, "mukellefler"));
      const aktifler = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((m) => m.aktif);
      setAktifMukellefler(aktifler);
    };
    fetchMukellefler();
  }, []);

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
    const belgeNo = `BELGE-${Date.now()}`;
    const tcVergiNoRegex = /^\d{10,11}$/;
    if (!tcVergiNoRegex.test(formData.vknTckn)) {
      alert("VKN/TCKN yalnızca 10 veya 11 haneli sayı olmalıdır.");
      return;
    }
    const yeniFatura = {
      ...formData,
      belgeNo,
      matrah: matrah.toFixed(2),
      kdv: hesaplananKdv.toFixed(2),
      toplam: vergiDahilToplam.toFixed(2),
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "invoices"), yeniFatura);
      const blob = generateExcelBlob(yeniFatura);
      const url = URL.createObjectURL(blob);
      setExcelUrl(url);
      const user = auth.currentUser;
      if (user) {
        await addNotification(user.displayName || user.email, "success", "Fatura oluşturuldu");
      }
      navigate("/billing");
    } catch (error) {
      console.error("Fatura oluşturulurken hata oluştu:", error);
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
                Yeni Fatura Oluştur
              </Typography>

              <Typography variant="h6" mt={2}>
                Alıcı Bilgileri
              </Typography>
              <Grid container spacing={2}>
                {/* ✅ Mükellef Seçimi */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Kayıtlı Mükellef Seç"
                    onChange={(e) => {
                      const secilen = aktifMukellefler.find((m) => m.id === e.target.value);
                      if (secilen) {
                        const [ad, ...soyadParts] = secilen.unvan.split(" ");
                        setFormData((prev) => ({
                          ...prev,
                          ad,
                          soyad: soyadParts.join(" "),
                          vknTckn: secilen.vergiNo,
                        }));
                      }
                    }}
                  >
                    {aktifMukellefler.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.unvan} - {m.vergiNo}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Diğer Alıcı Bilgileri */}
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
                    Fatura Oluştur
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

export default FaturaOlustur;
