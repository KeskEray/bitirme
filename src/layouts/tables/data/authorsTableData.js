import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Mükellef", accessor: "author", width: "45%", align: "left" },
      { Header: "Vergi Dairesi Adı", accessor: "function", align: "left" },
      { Header: "Durum", accessor: "status", align: "center" },
      { Header: "Eklenme Tarihi", accessor: "employed", align: "center" },
      { Header: "Düzenle", accessor: "action", align: "center" },
    ],

    rows: [{}],
  };
}
