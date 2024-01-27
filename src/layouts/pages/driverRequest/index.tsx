/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Footer from "components/Footer";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import DataTable from "components/Tables/DataTable";
import MDButton from "components/MDButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RootStateDrvierDocs, RootStateSchedules } from "redux/store";
import { CircularProgress } from "@mui/material";

// React-toastify
import "react-toastify/dist/ReactToastify.css";
import formatDate from "utils/DateFormat";
import { setDocs } from "redux/features/DriverDocs/DocsSlice";
import getDriverDocs from "Api/getDriverDocs";
import Status from "./component/Status";
import getSchedules from "Api/getSchedules";
import { setSchedules } from "redux/features/schedules/schedulesSlice";

function DriverRequest(): JSX.Element {
  const columns = [
    { Header: "Request Id", accessor: "id", align: "center" },
    { Header: "Driver", accessor: "type" },
    { Header: "Status", accessor: "status" },
    { Header: "Created At", accessor: "CreatedAt", align: "center" },
    { Header: "Action", accessor: "action" },
  ];

  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const driverdocs = useSelector((state: RootStateDrvierDocs) => state.driverdocs.results);
  const schedules = useSelector((state: RootStateSchedules) => state.schedules.results);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const requests = await getDriverDocs();
  //       dispatch(setDocs(requests));

  //       const tripData = await getSchedules();
  //       dispatch(setSchedules(tripData));
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (driverdocs.length === 0 || schedules.length === 0) {
  //     fetchData();
  //   } else {
  //     setIsLoading(false);
  //   }
  // }, [dispatch, driverdocs.length, schedules.length, setIsLoading]);

  const rows = driverdocs.map((doc) => {
    return {
      id: doc.id,
      status: Status(doc.isVerified),
      CreatedAt: formatDate(doc.createdAt),
      action: (
        <MDButton
          variant="contained"
          color="dark"
          size="small"
          onClick={() => navigator(`/driver-request/${doc.id}`)}
        >
          More
        </MDButton>
      ),
    };
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        py={3}
        sx={{
          overflow: "visible",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9} mx={"auto"}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ overflow: "visible" }}>
                    {!isLoading ? (
                      <MDBox p={3}>
                        <MDBox mt={8} mb={2}>
                          <MDBox mb={1} ml={2}>
                            <MDTypography variant="h5" fontWeight="medium">
                              My trip schedules
                            </MDTypography>
                          </MDBox>
                          <DataTable
                            table={{ columns, rows }}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            isSorted={true}
                          />
                        </MDBox>
                      </MDBox>
                    ) : (
                      <MDBox sx={{ position: "relative", mx: "auto", width: 100, p: 13.5 }}>
                        <CircularProgress />
                      </MDBox>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DriverRequest;
