import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import addNotification from "../notifications/addNotification";

function Tables() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [unvan, setUnvan] = useState("");
  const [vergiNo, setVergiNo] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [rows, setRows] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = (docId = null, data = {}) => {
    setEditId(docId);
    setUnvan(data.unvan || "");
    setVergiNo(data.vergiNo || "");
    setEmail(data.email || "");
    setTelefon(data.telefon || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setUnvan("");
    setVergiNo("");
    setEmail("");
    setTelefon("");
  };

  const handleAddOrUpdateMükellef = async () => {
    const tcVergiNoRegex = /^\d{10,11}$/;
    const telefonRegex = /^\d{10,11}$/;

    if (!tcVergiNoRegex.test(vergiNo)) {
      alert("Vergi No / TC No yalnızca 10 veya 11 haneli sayı olmalıdır.");
      return;
    }

    if (!telefonRegex.test(telefon)) {
      alert("Telefon numarası yalnızca 10 veya 11 haneli sayı olmalıdır.");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "mukellefler", editId), {
          unvan,
          vergiNo,
          email,
          telefon,
        });
      } else {
        await addDoc(collection(db, "mukellefler"), {
          unvan,
          vergiNo,
          email,
          telefon,
          tarih: new Date().toLocaleDateString("tr-TR"),
          aktif: true,
        });

        const user = auth.currentUser;
        if (user) {
          await addNotification(user.displayName || user.email, "success", "mükellef ekledi");
        }
      }
      handleClose();
      fetchRows();
    } catch (error) {
      console.error("Mükellef işleminde hata:", error);
    }
  };

  const toggleAktifDurumu = async (id, mevcutDurum, unvan) => {
    try {
      await updateDoc(doc(db, "mukellefler", id), { aktif: !mevcutDurum });
      const user = auth.currentUser;
      if (user) {
        await addNotification(
          user.displayName || user.email,
          "info",
          `${unvan} ${!mevcutDurum ? "mükellefi aktifleştirildi" : "mükellefi pasifleştirildi"}`
        );
      }
      fetchRows();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  const deleteMükellef = async (id, unvan) => {
    try {
      await deleteDoc(doc(db, "mukellefler", id));
      const user = auth.currentUser;
      if (user) {
        await addNotification(
          user.displayName || user.email,
          "error",
          `${unvan} mükellefi silindi`
        );
      }
      fetchRows();
    } catch (error) {
      console.error("Mükellef silinemedi:", error);
    }
  };

  const fetchRows = async () => {
    const snapshot = await getDocs(collection(db, "mukellefler"));
    const dataDocs = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    setDocuments(dataDocs);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      doc.unvan?.toLowerCase().includes(lowerSearch) ||
      doc.vergiNo?.includes(lowerSearch) ||
      doc.email?.toLowerCase().includes(lowerSearch) ||
      doc.telefon?.includes(lowerSearch)
    );
  });

  useEffect(() => {
    const newRows = filteredDocuments.map((data) => ({
      author: (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
          <MDAvatar src="/default.jpg" name={data.unvan} size="sm" />
          <MDBox ml={2} lineHeight={1}>
            <MDTypography display="block" variant="button" fontWeight="medium">
              {data.unvan}
            </MDTypography>
            <MDTypography variant="caption">{data.email}</MDTypography>
          </MDBox>
        </MDBox>
      ),
      function: (
        <MDTypography variant="caption" fontWeight="medium" color="text">
          {data.vergiNo}
        </MDTypography>
      ),
      status: (
        <MDBadge
          badgeContent={data.aktif ? "aktif" : "pasif"}
          color={data.aktif ? "success" : "error"}
          variant="gradient"
          size="sm"
          onClick={() => toggleAktifDurumu(data.id, data.aktif, data.unvan)}
          style={{ cursor: "pointer" }}
        />
      ),
      employed: data.tarih,
      action: (
        <MDBox display="flex" justifyContent="center" alignItems="center" gap={1}>
          <MDTypography
            variant="caption"
            color="info"
            fontWeight="medium"
            sx={{ cursor: "pointer" }}
            onClick={() => handleOpen(data.id, data)}
          >
            Düzenle
          </MDTypography>
          <IconButton color="error" onClick={() => deleteMükellef(data.id, data.unvan)}>
            <Icon>delete</Icon>
          </IconButton>
          <IconButton
            color="info"
            onClick={() => {
              localStorage.setItem("arsivVergiNo", data.vergiNo);
              window.location.href = "/arsiv";
            }}
          >
            <Icon>visibility</Icon>
          </IconButton>
        </MDBox>
      ),
    }));
    setRows(newRows);
  }, [filteredDocuments]);

  const columns = [
    { Header: "Mükellef", accessor: "author", width: "45%", align: "left" },
    { Header: "TCK/VERGİ NO", accessor: "function", align: "left" },
    { Header: "Durum", accessor: "status", align: "center" },
    { Header: "Eklenme Tarihi", accessor: "employed", align: "center" },
    { Header: "Düzenle", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Mükellef Tablosu
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="İsim, Vergi No, E-posta, Telefon ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <MDBox display="flex" justifyContent="flex-end" mb={2}>
                  <MDButton variant="gradient" color="dark" onClick={() => handleOpen()}>
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    &nbsp;Mükellef Ekle
                  </MDButton>
                </MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Mükellef Ekleme/Düzenleme Dialogu */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editId ? "Mükellefi Düzenle" : "Mükellef Ekle"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Ünvan / Ad Soyad"
            fullWidth
            variant="outlined"
            value={unvan}
            onChange={(e) => setUnvan(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Vergi No / TC No"
            fullWidth
            variant="outlined"
            value={vergiNo}
            onChange={(e) => setVergiNo(e.target.value)}
          />
          <TextField
            margin="dense"
            label="E-Posta"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            variant="outlined"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button variant="contained" onClick={handleAddOrUpdateMükellef}>
            {editId ? "Güncelle" : "Mükellefi Ekle"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Tables;
