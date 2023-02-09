import {
  Card,
  CardMedia,
  ListItem,
  ListItemText,
  Typography,
  Link,
  Breadcrumbs,
  Button,
  CardActionArea,
  Modal,
  Alert,
  autocompleteClasses,
  CardContent,
  CardActions,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  ROUTINEBYID,
  DELETE_NUROUTINE,
  CREATE_EACH_DAY,
} from "../../gql/nuRoutine";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateNuRoutine from "../../components/nutrition routine/UpdateNuRoutine";
import RemoveNuRoutine from "../../components/nutrition routine/RemoveNuRoutine";
import UpdateDayRoutine from "../../components/nutrition routine/UpdateDayRoutine";
import { LoadingButton } from "@mui/lab";
import { DELETE_IMAGE } from "../../gql/misc";

const styleP = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  width: 300,
  backgroundColor: "#cecece",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  height: "100vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const NuRoutineId = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [removeRoutine, setRemoveRoutine] = useState({});
  const [removeOpen, setRemoveOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateRoutine, setUpdateRoutine] = useState({});
  const [updateDayOpen, setUpdateDayOpen] = useState(false);
  const [updateDay, setUpdateDay] = useState(null);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({});

  const [loadRoutine, result] = useLazyQuery(ROUTINEBYID);

  useEffect(() => {
    loadRoutine({ variables: { id: id } });
  }, [loadRoutine]);

  useEffect(() => {
    if (result.data) {
      setValues(result.data.nutrition_routine_by_pk);
    }
  }, [result]);

  const [deleteRoutine] = useMutation(DELETE_NUROUTINE, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      navigate("/nuroutine");
      // setShowAlert({
      //   message: "Videos table video have been removed.",
      //   isError: false,
      // });
      // setTimeout(() => {
      //   setShowAlert({ message: "", isError: false });
      // }, 3000);
    },
  });
  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
    },
  });
  const handleRemoveOpen = (values) => {
    setRemoveRoutine(values);
    result.refetch();
    setRemoveOpen(true);
  };
  const handleRemoveClose = () => setRemoveOpen(false);
  const handleUpdateOpen = (values) => {
    setUpdateRoutine(values);
    setUpdateOpen(true);
  };
  //console.log(updateRoutine);
  const handleUpdateClose = () => {
    result.refetch();
    setUpdateOpen(false);
  };

  const handleUpdateDayOpen1 = (values) => {
    setUpdateDay(values);
    setUpdateDayOpen(true);
  };

  const handleUpdateDayClose1 = () => {
    result.refetch();
    setUpdateDayOpen(false);
  };

  const handleRemove = () => {
    if (!removeRoutine) {
      return;
    }
    let image_url = removeRoutine.thumbnail_image_url;
    let image_name = image_url.substring(
      image_url.lastIndexOf("/") + 1,
      image_url.lenght
    );
    deleteRoutine({
      variables: { id: removeRoutine.id },
    });
    deleteImage({ variables: { image_name: image_name } });
    result.refetch();
  };

  const routineAlert = (message, isError = false) => {
    setShowAlert({ message: message, isError: isError });
    setTimeout(() => {
      setShowAlert({ message: "", isError: false });
    }, 3000);
  };

  console.log(updateDay);

  return (
    // <>
    //   <div role="presentation" className="align">
    //     <Breadcrumbs
    //       aria-label="breadcrumb"
    //       fontWeight="bold"
    //       fontSize="1.2rem"
    //     >
    //       <Link to="/" className="dashboard">
    //         Dashboard
    //       </Link>
    //       <Link to="/exeroutine" className="user">
    //         Nutrition Routine
    //       </Link>
    //       <span>{id}</span>
    //     </Breadcrumbs>
    //   </div>
    //   <Typography variant="h5" component="h2" sx={{ m: 3, color: "black" }}>
    //     Nutrition Routine Details
    //   </Typography>
    //   <Card>
    //     <CardContent>
    //       <div className="grid--2--cols">
    //         <Box className="grid-img">
    //           <CardMedia
    //             sx={{
    //               flex: 1,
    //               bgcolor: "#cecece",
    //               maxHeight: 300,
    //               objectFit: "contain",
    //               width: 300,
    //               mt: 4,
    //               boxShadow: 5,
    //               borderRadius: 2,
    //               borderColor: "white",
    //             }}
    //             component="img"
    //             height="300"
    //             // image={values.thumbnail_image_url}
    //             alt="notification image"
    //             className="grid_img"
    //           />
    //         </Box>

    //         <div className="grid-item">
    //           <ListItem>
    //             <ListItemText
    //               primary="Nutrition Routine Name"
    //               secondary={values.nutrition_routine_name}
    //             />
    //           </ListItem>
    //           <ListItem>
    //             <ListItemText
    //               primary="duration of routine"
    //               secondary={values.duration_of_routine_in_days}
    //             />
    //           </ListItem>
    //           <ListItem>
    //             <ListItemText primary="Target" secondary={values.target} />
    //           </ListItem>
    //           <ListItem>
    //             <ListItemText
    //               primary="Vegetarian"
    //               secondary={values.vegetarian == "true" ? "Yes" : "No"}
    //             />
    //           </ListItem>
    //           <ListItem>
    //             <ListItemText
    //               primary="pdf_file_url"
    //               secondary={values.pdf_file_url}
    //             />
    //           </ListItem>

    //           <ListItem>
    //             <ListItemText
    //               primary="Package Type"
    //               secondary={
    //                 values.user_subscription_level
    //                   ? values.user_subscription_level.subscription_type
    //                   : "-"
    //               }
    //             />
    //           </ListItem>
    //         </div>
    //       </div>
    //     </CardContent>
    //     {/* description */}
    //     <Box sx={{ mx: 5, my: 5 }}>
    //       <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //         Description
    //       </Typography>
    //       <Box
    //         sx={{
    //           p: 2,
    //           bgcolor: "#f7f7f5",
    //           borderRadius: 2,
    //         }}
    //       >
    //         <div dangerouslySetInnerHTML={{ __html: values.description }}></div>
    //       </Box>
    //     </Box>
    //     <Box className="btn-align">
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         onClick={() => handleUpdateOpen(values)}
    //         sx={{ mr: "2rem" }}
    //       >
    //         Edit
    //       </Button>
    //     </Box>
    //   </Card>
    //   <Box className="grid-item">
    //     {/* day-1 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_1
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_1 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button
    //           style={{ fontWeight: "bold" }}
    //           onClick={() => handleUpdateDayOpen1(values)}
    //         >
    //           Edit
    //         </Button>
    //       </CardActions>
    //     </Card>

    //     {/* day_2 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_2
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_2 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button
    //           style={{ fontWeight: "bold" }}
    //           onClick={() => handleUpdateDayOpen1(values)}
    //         >
    //           Edit
    //         </Button>
    //       </CardActions>
    //     </Card>
    //     {/* day-3 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_3
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_3 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_4 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_4
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_4 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_5 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           day_5
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_5 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_6 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_6
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_6 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_7 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_7
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_7 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_8 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_8
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_8 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_9 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           day_9
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_9 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_10 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_10
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_10 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_11 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_11
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_11 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_12 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_12
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_12 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_13 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_13
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_13 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_14 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_14
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_14 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_15 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_15
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_15 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_16 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_16
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_16 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_17 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_17
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_17 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_18 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_18
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_18 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_19 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_19
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_19 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_20 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_20
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_20 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_21 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_21
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_21 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_22 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_22
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_22 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_23 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_23
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_23 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_24 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_24
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_24 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_25 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_25
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_25 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_26 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_26
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_26 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_27 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_27
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_27 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_28 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_28
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_28 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_29 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_29
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_29 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     {/* day_30 */}
    //     <Card>
    //       <CardContent>
    //         <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
    //           Day_30
    //         </Typography>
    //         <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
    //           <div dangerouslySetInnerHTML={{ __html: values.day_30 }}></div>
    //         </Box>
    //       </CardContent>
    //       <CardActions>
    //         <Button style={{ fontWeight: "bold" }}>Edit</Button>
    //       </CardActions>
    //     </Card>
    //     <Box className="create-btn">
    //       <Button
    //         sx={{ width: 200 }}
    //         variant="contained"
    //         color="error"
    //         size="large"
    //         onClick={() => handleRemoveOpen(values)}
    //       >
    //         Remove
    //       </Button>
    //     </Box>
    //   </Box>
    //   {/* Remove Routine */}
    //   <Modal
    //     keepMounted
    //     open={removeOpen}
    //     onClose={handleRemoveClose}
    //     aria-labelledby="keep-mounted-modal-title"
    //     aria-describedby="keep-mounted-modal-description"
    //   >
    //     <Box style={styleP} sx={{ px: 4, py: 4, borderColor: "black" }}>
    //       <RemoveNuRoutine />
    //       <Box sx={{ textAlign: "right", mt: 2 }}>
    //         <Button color="primary" onClick={handleRemoveClose}>
    //           Cancel
    //         </Button>
    //         <Button color="error" onClick={handleRemove}>
    //           Confirm
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Modal>
    //   {/* Update routine */}
    //   <Modal
    //     keepMounted
    //     open={updateOpen}
    //     onClose={handleUpdateClose}
    //     aria-labelledby="keep-mounted-modal-title"
    //     aria-describedby="keep-mounted-modal-description"
    //   >
    //     <Box style={style}>
    //       <UpdateNuRoutine
    //         routineAlert={routineAlert}
    //         handleClose={handleUpdateClose}
    //         value={updateRoutine}
    //       />
    //     </Box>
    //   </Modal>
    //   {/* update day */}
    //   <Modal
    //     keepMounted
    //     open={updateDayOpen}
    //     onClose={handleUpdateDayClose1}
    //     aria-labelledby="keep-mounted-modal-title"
    //     aria-describedby="keep-mounted-modal-description"
    //   >
    //     <Box style={style}>
    //       <UpdateDayRoutine
    //         routineAlert={routineAlert}
    //         handleClose={handleUpdateDayClose1}
    //         value={updateDay}
    //       />
    //     </Box>
    //   </Modal>
    //   {showAlert.message && !showAlert.isError && (
    //     <Alert
    //       sx={{ position: "fixed", bottom: "1em", right: "1em" }}
    //       severity="success"
    //     >
    //       {showAlert.message}
    //     </Alert>
    //   )}
    //   {showAlert.message && showAlert.isError && (
    //     <Alert
    //       sx={{ position: "fixed", bottom: "1em", right: "1em" }}
    //       severity="error"
    //     >
    //       {showAlert.message}
    //     </Alert>
    //   )}
    // </>
    <h1>hellos</h1>
  );
};
export default NuRoutineId;
