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

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import Footer from "components/Footer";
import DataTable from "components/Tables/DataTable";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import apiUrlV1 from "utils/axiosInstance";
import { toast } from "react-toastify";
import ProductCell from "./components/ProductCell";
import Status from "./components/Status";

function Passengers(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(true);
  const token = localStorage.getItem("accessToken");
  const columns = [
    { Header: "Car", accessor: "car" },
    { Header: "Pick up", accessor: "from" },
    { Header: "Drop off", accessor: "to" },
    { Header: "Leaving", accessor: "leaving" },
    { Header: "status", accessor: "status", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];
  const [schedules, setSchedules] = useState<any[]>([]);

  const handleDenyBtn = (id: any) => {
    apiUrlV1
      .patch(`/booking/cancel/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data?.data[1];
        setShouldFetchData(true);
        fetchData();
        if (data) {
          toast.success("Request remove successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Error while denying request", {
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
      })
      .catch((error) => {
        console.error("Error while denying request:", error.response);
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
  const fetchData = async () => {
    try {
      apiUrlV1
        .get(`/booking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data?.data.results;
          console.log(data);
          setSchedules(data);
        })
        .catch((error) => {
          console.error("Error while denying request:", error.response);
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
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (schedules.length === 0 || shouldFetchData) {
      fetchData();
      setShouldFetchData(false); 
    }
  }, [schedules, shouldFetchData]);

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

  const rows = schedules.map((schedule) => ({
    car: (
      <ProductCell
        image={schedule.schedule.vehicle.vehicleType.icon}
        name={`${schedule.schedule.vehicle.vehicleType.name}, ${schedule.schedule.vehicle.plateNumber}`}
      />
    ),
    from: schedule.schedule.from,
    to: schedule.schedule.to,
    leaving: ` ${days[new Date(schedule.schedule.date).getUTCDay()]} ${
      months[new Date(schedule.schedule.date).getUTCMonth()]
    } ${new Date(schedule.schedule.date).getUTCDate()} | ${formatTime(
      new Date(schedule.schedule.date)
    )}`,
    status: Status(schedule.status),
    action: (
      <MDBox display="flex" flexDirection={{ xs: "column", sm: "row" }}>
        <MDBox ml={{ xs: 0, sm: 1 }} mt={{ xs: 1, sm: 0 }}>
          <MDButton
            variant="gradient"
            color="error"
            sx={{ height: "100%" }}
            onClick={(e) => {
              e.preventDefault();
              handleDenyBtn(schedule.id);
            }}
          >
            Remove
          </MDButton>
        </MDBox>
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox>
        {!isLoading ? (
          <DataTable
            table={{ columns: columns, rows: rows }}
            entriesPerPage={false}
            showTotalEntries={false}
            isSorted={true}
            canSearch
          />
        ) : (
          <MDBox sx={{ position: "relative", mx: "auto", width: 100, p: 45 }}>
            <CircularProgress />
          </MDBox>
        )}
      </MDBox>
      <MDBox
        sx={{
          position: "relative",
          mt: 3,
        }}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default Passengers;
