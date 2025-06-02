import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function Arsiv() {
  const [rows, setRows] = useState([]);
  const [tumFaturalar, setTumFaturalar] = useState([]);
  const [mukellefler, setMukellefler] = useState([]);
  const [secilenVergiNo, setSecilenVergiNo] = useState("");
  const [malHizmetSearch, setMalHizmetSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const faturaSnapshot = await getDocs(collection(db, "invoices"));
      const faturaData = faturaSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTumFaturalar(faturaData);

      const mukellefSnapshot = await getDocs(collection(db, "mukellefler"));
      const aktifMukellefler = mukellefSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((m) => m.aktif);
      setMukellefler(aktifMukellefler);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = tumFaturalar;

    if (secilenVergiNo) {
      filtered = filtered.filter((f) => f.vknTckn === secilenVergiNo);
    }

    if (malHizmetSearch) {
      filtered = filtered.filter((f) =>
        f.malHizmet?.toLowerCase().includes(malHizmetSearch.toLowerCase())
      );
    }

    const newRows = filtered.map((fatura) => ({
      belgeNo: fatura.belgeNo,
      malHizmet: fatura.malHizmet || "-",
      tarih: fatura.tarih || "-",
      unvan: fatura.unvan || `${fatura.ad || ""} ${fatura.soyad || ""}`,
      toplam: `${fatura.toplam} ${fatura.paraBirimi || ""}`,
      not: fatura.not || "-",
    }));

    setRows(newRows);
  }, [secilenVergiNo, malHizmetSearch, tumFaturalar]);

  const columns = [
    { Header: "Belge No", accessor: "belgeNo", align: "left" },
    { Header: "Mal/Hizmet", accessor: "malHizmet", align: "left" },
    { Header: "Tarih", accessor: "tarih", align: "center" },
    { Header: "Unvan / Ad Soyad", accessor: "unvan", align: "left" },
    { Header: "Toplam", accessor: "toplam", align: "center" },
    { Header: "Not", accessor: "not", align: "left" },
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
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
              >
                <MDTypography variant="h6" color="white">
                  E-Arşiv - Mükellefe Ait Faturalar
                </MDTypography>
              </MDBox>

              <MDBox display="flex" gap={2} p={2}>
                <TextField
                  select
                  fullWidth
                  label="Mükellef Seçin"
                  value={secilenVergiNo}
                  onChange={(e) => setSecilenVergiNo(e.target.value)}
                >
                  {mukellefler.map((m) => (
                    <MenuItem key={m.id} value={m.vergiNo}>
                      {m.unvan} - {m.vergiNo}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Mal/Hizmet Ara"
                  value={malHizmetSearch}
                  onChange={(e) => setMalHizmetSearch(e.target.value)}
                />
              </MDBox>

              <MDBox pt={3}>
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
    </DashboardLayout>
  );
}

export default Arsiv;
