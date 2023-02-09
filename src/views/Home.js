import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
  createContext,
} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert } from "@mui/material";

import Header from "../layout/Header";
import SideBar from "../layout/SideBar";
import CreateVideo from "../components/video/CreateVideo";
import UpdateVideo from "../components/video/UpdateVideo";

//const Dashboard = lazy(() => import("./Dashboard"));

const Users = lazy(() => import("./users/index"));
const User = lazy(() => import("./users/User"));
const Video = lazy(() => import("./Video/index"));
const ExeRoutine = lazy(() => import("./exerciseRoutine/index"));
const NuRoutine = lazy(() => import("./nutritionRoutine/index"));
const SpecialExeRoutine = lazy(() => import("./specialExeRoutine/index"));
const NuRoutineId = lazy(() => import("./nutritionRoutine/nutrition"));
const SpecialNuRoutine = lazy(() => import("./specialNuRoutine/index"));
const SpecialNuRoutineId = lazy(() =>
  import("./specialNuRoutine/specialNuRoutineID")
);

const drawerWidth = 340;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Admin = () => {
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const navigate = useNavigate();
  const AuthContext = createContext();
  const [auth, setAuth] = useState(null);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const homeAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const parsedLoggedUser = JSON.parse(loggedUser);
      setAuth(parsedLoggedUser);
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        //bgcolor: "#F8F7FC",
        //bgcolor: "#1e1e1e",
        background: "#F7F7F7",
        minHeight: "100vh",
      }}
    >
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawer} />
      <SideBar handleDrawerClose={handleDrawerClose} open={open} />
      <Main open={open}>
        <DrawerHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContext.Provider value={auth}>
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="/video" element={<Video />} />

              <Route path="/video/create" element={<CreateVideo />} />
              <Route path="/video/update/:id" element={<UpdateVideo />} />
              <Route path="/exeroutine" element={<ExeRoutine />} />
              <Route path="/nuroutine" element={<NuRoutine />} />
              <Route path="/nuroutine/:id" element={<NuRoutineId />} />
              <Route path="/spe_exe_routine" element={<SpecialExeRoutine />} />
              <Route path="/spe_nu_routine" element={<SpecialNuRoutine />} />
              <Route
                path="/spe_nu_routine/:id"
                element={<SpecialNuRoutineId />}
              />
            </Routes>
          </AuthContext.Provider>
        </Suspense>
      </Main>
      {showAlert.message && !showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="success"
        >
          {showAlert.message}
        </Alert>
      )}
      {showAlert.message && showAlert.isError && (
        <Alert
          sx={{ position: "fixed", bottom: "1em", right: "1em" }}
          severity="warning"
        >
          {showAlert.message}
        </Alert>
      )}
    </Box>
  );
};

export default Admin;
