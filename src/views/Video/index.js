import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import "../../style/App.css";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";

import {
  Box,
  Alert,
  Breadcrumbs,
  ListItemButton,
  ListItemText,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Modal,
  styled,
  TableCell,
  TableRow,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TablePagination,
  tableCellClasses,
  Avatar,
} from "@mui/material";

import { useLazyQuery } from "@apollo/client";
import {
  ALL_VIDEO_CATEGORY,
  ALL_VIDEOS,
  SUB_TYPE,
  DELETE_VIDEOS_PK,
  VIDEO_CATEGORY,
} from "../../gql/video";
import { DELETE_IMAGE } from "../../gql/misc";
import { useQuery, useMutation } from "@apollo/client";
import CreateVideo from "../../components/video/CreateVideo";
import UpdateVideo from "../../components/video/UpdateVideo";
import RemoveVideo from "../../components/video/RemoveVideo";

const style = {
  position: "absolute",
  top: "50%",
  left: "54%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  //bgcolor: "white",
  // border: "2px solid #000",
  // boxShadow: 24,
  p: 8,
};

const styleR = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: 300,
  backgroundColor: "#cecece",
};

const Index = () => {
  // Search button
  const [search, setSearch] = useState("");

  // filter
  const [homeOpen, setHomeOpen] = useState(false);
  const [gymOpen, setGymOpen] = useState(false);

  //video crud
  const [video, setVideo] = useState("");
  let [removeVideo, setRemoveVideo] = useState({});
  let [updateVideo, setUpdateVideo] = useState({});
  const [removeOpen, setRemoveOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [subType, setSubType] = useState("");

  // alert message
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });

  // get data from db
  const [loadVideo, result] = useLazyQuery(ALL_VIDEOS);
  const [loadCategory, resultCategory] = useLazyQuery(VIDEO_CATEGORY);
  const [loadHome, resutlHome] = useLazyQuery(ALL_VIDEO_CATEGORY);
  const [loadSubType, resultSubType] = useLazyQuery(SUB_TYPE);

  //for pagination
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offset, setOffset] = useState(0);

  //console.log(result);
  const data = [
    { label: "ALL" },
    { label: "CHEST" },
    { label: "BACK" },
    { label: "LEG" },
    { label: "TRICEPS" },
  ];
  const gym = [
    { label: "ALL" },
    { label: "CHEST" },
    { label: "BACK" },
    { label: "LEG" },
    { label: "TRICEPS" },
  ];

  //for pagination

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(rowsPerPage * newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // ----------- Start search and get all video ------------------
  const handleSearch = (e) => {
    setSearch(document.getElementById("search-by-title").value);
    //setSearch(e.target.value);
  };
  //console.log(result.data.video_list[0].video_sub_type);
  useEffect(() => {
    loadVideo({ variables: { search: `%${search}%` } });
  }, [loadVideo, search]);

  useEffect(() => {
    if (result.data) {
      setVideo(result.data.video_list);
    }
  }, [result]);
  console.log(video);

  useEffect(() => {
    if (resultCategory.data) {
      //console.log(resultCategory.data);
      setVideo(resultCategory.data.video_list);
    }
  }, [resultCategory]);

  useEffect(() => {
    if (resutlHome.data) {
      setVideo(resutlHome.data.video_list);
    }
  }, [resutlHome]);

  useEffect(() => {
    if (resultSubType.data) {
      setSubType(resultSubType.data.video_sub_type[0].id);
    }
  }, [resultSubType]);

  const homeCategory = (e) => {
    if (e.target.textContent === "ALL") {
      loadHome({ variables: { main: "HOME" } });
    } else {
      loadSubType({ variables: { sub_type: e.target.innerText } });
      loadCategory({ variables: { main_type: "HOME", sub_type: subType } });
    }
  };

  const gymCategory = (e) => {
    if (e.target.textContent === "ALL") {
      loadHome({ variables: { main: "GYM" } });
    } else {
      loadSubType({ variables: { sub_type: e.target.innerText } });
      loadCategory({ variables: { main_type: "GYM", sub_type: subType } });
    }
  };

  const zumbaCategory = () => {
    setHomeOpen(false);
    setGymOpen(false);
    loadHome({ variables: { main: "ZUMBA" } });
  };

  const homeType = (e) => {
    //loadHome({ variables: { main: "HOME" } });
    setHomeOpen(!homeOpen);
    setGymOpen(false);
  };

  // ----------- End search and get all video ------------------

  // ----------Start Delete video ------------------
  const [deleteVideoPk] = useMutation(DELETE_VIDEOS_PK, {
    onError: (error) => {
      console.log("error: ", error);
    },
    onCompleted: () => {
      setShowAlert({
        message: "Videos table video have been removed.",
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
    },
  });

  const handleRemoveOpen = (row) => {
    setRemoveVideo(row);
    setRemoveOpen(true);
  };
  const handleRemoveClose = () => {
    setRemoveOpen(false);
  };

  const handleRemove = () => {
    if (!removeVideo) {
      return;
    }

    let image_url = removeVideo.thumbnail_image_url;
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.length
    );

    deleteVideoPk({ variables: { id: removeVideo.id } });
    deleteImage({ variables: { image_name: image_name } });
    result.refetch();
    setRemoveOpen(false);
  };

  //----------------- Start Add Video -------------------
  const videoAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => {
    result.refetch();
    setCreateOpen(false);
  };
  //------------------ End Add Video --------------------

  //------------------Start Update Video -------------------

  const handleUpdateOpen = (row) => {
    setUpdateVideo(row);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    result.refetch();
    setUpdateOpen(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      //      backgroundColor: theme.palette.grey[700],
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.black,
      fontSize: 18,
      fontWeight: "bold",
      minWidth: 70,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
      //backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  //  console.log(video);

  if (!video) {
    return (
      <div>
        <em>Loading....</em>
      </div>
    );
  }
  console.log(video.user_subscription_level);
  return (
    <div>
      <div className="align">
        {/* dashboard */}
        <div>
          <Breadcrumbs
            aria-label="breadcrumb"
            fontWeight="bold"
            fontSize="1.2rem"
          >
            <Link to="/" className="dashboard">
              Dashboard
            </Link>
            <span>Video Package</span>
          </Breadcrumbs>
        </div>
        {/* search */}
        <div>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 350,
            }}
          >
            {/* Search Box */}

            <InputBase
              id="search-by-title"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search By Video Title"
              type="search"
            />

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="warning"
              id="search-by-title"
              sx={{ p: "10px" }}
              aria-label="directions"
              value={search}
              onClick={handleSearch}
            >
              <DirectionsIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
      <div className="exercise">
        <Box>
          <ListItemButton
            alignItems="flex-start"
            // onClick={() => {
            //   setHomeOpen(!homeOpen);
            //   setGymOpen(false);
            // }}
            onClick={homeType}
            sx={{
              alignItems: "center",
              textAlign: "center",
              bgcolor: "#4d4d4d",
              borderRadius: 2,
              height: 50,
              fontWeight: "bold",
              px: 3,
              pt: 2,
              pb: homeOpen ? 0 : 2.5,
              //"& svg": { opacity: 1 },
            }}
          >
            <ListItemText sx={{ color: "white" }} primary="HOME EXERCISE" />
            <KeyboardArrowDown
              sx={{
                mr: -1,
                opacity: 0,
                transform: homeOpen ? "rotate(-180deg)" : "rotate(0)",
                transition: "0.2s",
                color: "white",
              }}
            />
          </ListItemButton>
          {homeOpen &&
            data.map((item) => (
              <ListItemButton
                key={item.label}
                sx={{
                  color: "black",
                }}
                onClick={homeCategory}
              >
                <ListItemText
                  sx={{
                    color: "black",
                  }}
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: 1,
                  }}
                />
              </ListItemButton>
            ))}
        </Box>
        <Box>
          <ListItemButton
            onClick={() => {
              setGymOpen(!gymOpen);
              setHomeOpen(false);
            }}
            sx={{
              alignItems: "center",
              textAlign: "center",
              px: 3,
              height: 50,
              pt: 2,
              fontWeight: "bold",
              bgcolor: "#4d4d4d",
              borderRadius: 2,
              pb: gymOpen ? 0 : 2.5,
              "& svg": { opacity: 1 },
              // "&:hover, &:focus": { color: open ? "red" : "blue" },
            }}
          >
            <ListItemText sx={{ color: "white" }} primary="GYM EXERCISE" />
            <KeyboardArrowDown
              sx={{
                mr: -1,
                opacity: 0,
                transform: gymOpen ? "rotate(-180deg)" : "rotate(0)",
                transition: "0.2s",
                color: "white",
              }}
            />
          </ListItemButton>
          {gymOpen &&
            gym.map((item) => (
              <ListItemButton
                key={item.label}
                sx={{
                  color: "black",
                }}
                onClick={gymCategory}
              >
                <ListItemText
                  sx={{ color: "black" }}
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 15,
                    fontWeight: "medium",
                    lineHeight: 1,
                  }}
                />
              </ListItemButton>
            ))}
        </Box>
        <Box>
          <ListItemButton
            alignItems="flex-start"
            sx={{
              bgcolor: "#4d4d4d",
              width: 180,
              color: "white",
              fontWeight: "bold",
              borderRadius: 2,
              alignItems: "center",
              textAlign: "center",
            }}
            onClick={zumbaCategory}
          >
            <ListItemText sx={{ color: "white" }} primary="ZUMBA" />
          </ListItemButton>
        </Box>

        <Box>
          <Button
            variant="contained"
            sx={{
              width: 100,
              height: 45,
              p: 2,
              fontWeight: "bold",
            }}
            color="secondary"
            onClick={handleCreateOpen}
          >
            Add
          </Button>
        </Box>
      </div>
      <Box
        sx={{
          display: "flex",
          flexFlow: "wrap row",
          "& > :not(style)": {
            m: 1,
            width: "100%",
            minHeight: "25vh",
          },
          mt: "1rem",
        }}
      >
        <TableContainer sx={{ maxHeight: "60vh", Width: "10px" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>image</StyledTableCell>
                <StyledTableCell style={{ minWidth: 230 }}>
                  Video Package Name
                </StyledTableCell>
                <StyledTableCell>Video A</StyledTableCell>
                <StyledTableCell>Video B</StyledTableCell>
                <StyledTableCell>Main Type</StyledTableCell>
                <StyledTableCell>Sub Type</StyledTableCell>
                <StyledTableCell>Package Type</StyledTableCell>
                <StyledTableCell>Target period</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Promotion</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {video.length > 0 ? (
                video.map((row, index) => (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={index}
                  >
                    <StyledTableCell>{row.id.substring(0, 8)}</StyledTableCell>
                    <StyledTableCell>
                      <Avatar
                        alt="video"
                        src={row.thumbnail_image_url}
                        sx={{ width: 56, height: 56 }}
                      ></Avatar>
                    </StyledTableCell>
                    <StyledTableCell>{row.video_package_name}</StyledTableCell>
                    <StyledTableCell>
                      {row.video_url_a.substring(0, 20)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.video_url_b.substring(0, 20)}
                    </StyledTableCell>
                    <StyledTableCell>{row.main_type}</StyledTableCell>
                    <StyledTableCell>
                      {row.video_sub_type
                        ? row.video_sub_type.sub_type_name
                        : "-"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.user_subscription_level
                        ? row.user_subscription_level.subscription_type
                        : " - "}
                    </StyledTableCell>
                    <StyledTableCell>{row.target_period}</StyledTableCell>
                    <StyledTableCell>{row.duration}</StyledTableCell>
                    <StyledTableCell>
                      {row.promotion ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => handleRemoveOpen(row)}
                        size="small"
                        color="error"
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => handleUpdateOpen(row)}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                      {/* <Button
                        size="small"
                        variant="contained"
                        color="inherit"
                        // onClick={() => navigate(`/video/${row.id}`)}
                      >
                        Video Details
                      </Button> */}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <h3>No data</h3>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ color: "black" }}
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      {/* Remove Video */}
      <Modal
        keepMounted
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box style={styleR} sx={{ px: 4, py: 4, borderColor: "black" }}>
          <RemoveVideo />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button color="primary" onClick={handleRemoveClose}>
              Cancel
            </Button>
            <Button color="error" onClick={handleRemove}>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Add Video */}
      {createOpen && (
        <div>
          <Modal
            keepMounted
            open={createOpen}
            onClose={handleCreateClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-descripedby="keep-mounted-modal-description"
          >
            <Box style={style}>
              <CreateVideo
                videoAlert={videoAlert}
                handleClose={handleCreateClose}
              />
            </Box>
          </Modal>
        </div>
      )}

      {/* Update Video */}

      {updateOpen && (
        <div>
          <Modal
            keepMounted
            open={updateOpen}
            onClose={handleUpdateClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-descripedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
              <UpdateVideo
                videoAlert={videoAlert}
                handleClose={handleUpdateClose}
                video={updateVideo}
              />
            </Box>
          </Modal>
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
        </div>
      )}
    </div>
  );
};
export default Index;
