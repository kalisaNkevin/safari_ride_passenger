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

// ProductPage page components
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import getSchedules from "Api/getSchedules";
import { useDispatch, useSelector } from "react-redux";
import { ISchedule, setSchedules } from "redux/features/schedules/schedulesSlice";
import { RootStateSchedules } from "redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete, CircularProgress, Icon } from "@mui/material";

// Images
import MDButton from "components/MDButton";
import { toast } from "react-toastify";
import apiUrlV1 from "utils/axiosInstance";

// Import default schedule profile

function ViewSchedule(): JSX.Element {
  // Get id from url
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [getSchedule, setSchedule] = useState<ISchedule[]>([]);
  const dispatch = useDispatch();
  const schedules = useSelector((state: RootStateSchedules) => state.schedules.results);
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleBookBtn = () => {
    apiUrlV1
      .post(`/booking/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success("Ride Requested successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/requests");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error while Requesting a ride:", error.response);
        if ((error as any).response?.data?.message) {
          toast.error((error as any).response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleData = await getSchedules();
        dispatch(setSchedules(scheduleData));
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const filteredSchedule = schedules.find((schedule) => schedule.id === parseInt(id));

    // Check if the filtered schedule is already in state and if it matches the current id
    if (!filteredSchedule || filteredSchedule.id !== parseInt(id)) {
      fetchData();
    } else {
      setSchedule([filteredSchedule]);

      setIsLoading(false);
    }
  }, [dispatch, id, schedules]);

  function formatTime(date: any) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={{ overflow: "visible" }}>
          {!isLoading ? (
            <MDBox p={3}>
              <MDBox mb={3}>
                <MDTypography variant="h5" fontWeight="medium">
                  Trip details
                </MDTypography>
              </MDBox>

              <Grid container spacing={3}>
                <Grid item xs={12} lg={5} xl={4}>
                  <MDBox
                    component="img"
                    src={getSchedule[0].vehicle.vehicleType.icon}
                    alt="Product Image"
                    shadow="lg"
                    borderRadius="lg"
                    width="100%"
                    sx={{ width: 500, height: 450 }}
                  />
                </Grid>
                <Grid item xs={12} lg={6} sx={{ mx: "auto" }}>
                  <MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="h3" fontWeight="bold">
                        {getSchedule[0].from.split(",")[0]}, {getSchedule[0].to.split(",")[0]}
                      </MDTypography>
                    </MDBox>
                    <MDTypography variant="h4" color="text">
                      <Icon>star</Icon>
                      <Icon>star</Icon>
                      <Icon>star</Icon>
                      <Icon>star</Icon>
                      <Icon>star_half</Icon>
                    </MDTypography>
                    <MDBox mt={1}>
                      <MDTypography variant="h6" fontWeight="medium">
                        Price
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={1}>
                      <MDTypography variant="h5" fontWeight="medium">
                        ${getSchedule[0].fareAmount}
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={0.5} mb={0.5} ml={0.5}>
                      <MDTypography variant="button" fontWeight="regular" color="text">
                        {" "}
                        {`${months[new Date(getSchedule[0].date).getUTCMonth()]} ${new Date(
                          getSchedule[0].date
                        ).getUTCDate()}, ${new Date(
                          getSchedule[0].date
                        ).getUTCFullYear()} | ${formatTime(new Date(getSchedule[0].date))}`}
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={3} mb={0.5} ml={0.5}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Pickup:{" "}
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="regular" color="text">
                        {getSchedule[0].from}
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={0.5} mb={0.5} ml={0.5}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Dropoff:{" "}
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="regular" color="text">
                        {getSchedule[0].to}
                      </MDTypography>
                    </MDBox>
                    <MDBox mt={0.5} mb={0.5} ml={0.5}>
                      <MDTypography variant="button" fontWeight="bold" color="text">
                        Seats:{" "}
                      </MDTypography>
                      <MDTypography variant="button" fontWeight="regular" color="text">
                        {getSchedule[0].sits}
                      </MDTypography>
                    </MDBox>
                    {getSchedule[0].description != null ? (
                      <>
                        <MDBox mt={3} mb={1} ml={0.5}>
                          <MDTypography variant="button" fontWeight="bold" color="text">
                            Description
                          </MDTypography>
                        </MDBox>
                        <MDBox component="ul" m={0} pl={4} mb={2}>
                          <MDBox component="li" color="text" fontSize="1.25rem" lineHeight={1}>
                            <MDTypography
                              variant="body2"
                              color="text"
                              fontWeight="regular"
                              verticalAlign="middle"
                            >
                              {getSchedule[0].description}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                      </>
                    ) : (
                      ""
                    )}
                    <MDBox mt={3}>
                      <Grid item xs={12} lg={5} container>
                        <MDButton variant="gradient" color="info" fullWidth onClick={handleBookBtn}>
                          Book a ride
                        </MDButton>
                      </Grid>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          ) : (
            <MDBox sx={{ position: "relative", mx: "auto", width: 100, p: 45 }}>
              <CircularProgress />
            </MDBox>
          )}
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ViewSchedule;
