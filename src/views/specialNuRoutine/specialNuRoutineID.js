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
  SPE_ROUTINE_BY_ID,
  DELETE_SPE_NUROUTINE,
} from "../../gql/specialNuRoutine";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UpdateSpecialNuRoutine from "../../components/specialNuRoutine/UpdateSpecialNuRoutine";
import RemoveSpecialNuRoutine from "../../components/specialNuRoutine/RemoveSpecialNuRoutine";
import UpdateSpecialDayRoutine from "../../components/specialNuRoutine/UpdateSpecialDayRoutine";
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
const SpecialNuRoutineId = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [removeRoutine, setRemoveRoutine] = useState({});
  const [removeOpen, setRemoveOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateRoutine, setUpdateRoutine] = useState({});
  const [updateDayOpen, setUpdateDayOpen] = useState(false);

  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({});
  const [loadRoutine, result] = useLazyQuery(SPE_ROUTINE_BY_ID);
  const [days, setDays] = useState({});
  const [dayArr, setDayArr] = useState({});
  const [updateDay, setUpdateDay] = useState({});
  const [key, setKey] = useState({});

  useEffect(() => {
    if (values) {
      let obj = Object.assign({}, values);
      delete obj.created_at;
      delete obj.updated_at;
      delete obj.duration_of_routine_in_days;
      delete obj.routine_category;
      delete obj.nutrition_routine_name;
      delete obj.description;
      delete obj.pdf_file_url;
      delete obj.user_subscription_level;
      delete obj.vegetarian;
      delete obj.thumbnail_image_url;
      delete obj.id;
      delete obj.fk_user_subscription_level_id;
      delete obj.__typename;
      delete obj.fk_user_id;
      setDayArr(Object.keys(obj));
      // console.log("object", obj);
      setDays(obj);
    }
  }, [values]);

  useEffect(() => {
    loadRoutine({ variables: { id: id } });
  }, [loadRoutine]);

  useEffect(() => {
    if (result.data) {
      setValues(result.data.special_nutrition_routine_by_pk);
    }
  }, [result]);

  const [deleteSpeRoutine] = useMutation(DELETE_SPE_NUROUTINE, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 3000);
    },
    onCompleted: () => {
      navigate("/spe_nu_routine");
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

  const handleUpdateClose = () => {
    result.refetch();
    setUpdateOpen(false);
  };

  const handleEditOpen = (value, key) => {
    console.log(`value is ${value} and key is ${key}`);
    setUpdateDayOpen(true);
    setUpdateDay({ [key]: value });
    console.log("updateDay is ", updateDay);
    setKey(key);
  };

  const handleUpdateDayClose = () => {
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
    deleteSpeRoutine({
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
  if (!values) {
    return;
  }

  return (
    <>
      <div role="presentation" className="align">
        <Breadcrumbs
          aria-label="breadcrumb"
          fontWeight="bold"
          fontSize="1.2rem"
        >
          <Link to="/" className="dashboard">
            Dashboard
          </Link>
          <Link to="/spe_nu_routine" className="user">
            Special Nutrition Routine
          </Link>
          <span>{id}</span>
        </Breadcrumbs>
      </div>
      <Typography variant="h5" component="h2" sx={{ m: 3, color: "black" }}>
        Special Nutrition Routine Details
      </Typography>
      <Card>
        <CardContent>
          <div className="grid--2--cols">
            <Box className="grid-img">
              <CardMedia
                sx={{
                  flex: 1,
                  bgcolor: "#cecece",
                  maxHeight: 300,
                  objectFit: "contain",
                  width: 300,
                  mt: 4,
                  boxShadow: 5,
                  borderRadius: 2,
                  borderColor: "white",
                }}
                component="img"
                height="300"
                image={values.thumbnail_image_url}
                alt="notification image"
                className="grid_img"
              />
            </Box>

            <div className=" grid--2--cols grid-item">
              <ListItem>
                <ListItemText
                  primary="Nutrition Routine Name"
                  secondary={values.nutrition_routine_name}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="duration of routine"
                  secondary={values.duration_of_routine_in_days}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Routine Category"
                  secondary={values.routine_category}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Vegetarian"
                  secondary={values.vegetarian === "true" ? "Yes" : "No"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="pdf_file_url"
                  secondary={values.pdf_file_url}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Package Type"
                  secondary={
                    values.user_subscription_level
                      ? values.user_subscription_level.subscription_type
                      : "-"
                  }
                />
              </ListItem>
            </div>
          </div>
        </CardContent>
        {/* description */}
        <Box sx={{ mx: 5, my: 5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: "bold" }} color="text">
            Description
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f7f7f5",
              borderRadius: 2,
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: values.description }}></div>
          </Box>
        </Box>
        <Box className="btn-align">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateOpen(values)}
            sx={{ mr: "2rem" }}
          >
            Edit
          </Button>
        </Box>
      </Card>
      <Box className="grid--2--cols grid-item">
        {/* days */}
        {Array.isArray(dayArr) &&
          dayArr.map((m, index) => (
            <Card key={index}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold" }}
                  color="text"
                >
                  {m}
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f7f7f5", borderRadius: 2 }}>
                  <div dangerouslySetInnerHTML={{ __html: days[m] }}></div>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleEditOpen(days[m], m)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          ))}
      </Box>

      <Box className="btn-center">
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => handleRemoveOpen(values)}
        >
          Remove
        </Button>
      </Box>

      {/* Remove Routine */}
      <Modal
        keepMounted
        open={removeOpen}
        onClose={handleRemoveClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box style={styleP} sx={{ px: 4, py: 4, borderColor: "black" }}>
          <RemoveSpecialNuRoutine />
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
      {/* Update routine */}
      <Modal
        keepMounted
        open={updateOpen}
        onClose={handleUpdateClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box style={style}>
          <UpdateSpecialNuRoutine
            routineAlert={routineAlert}
            handleClose={handleUpdateClose}
            value={updateRoutine}
          />
        </Box>
      </Modal>
      {/* update day */}
      <Modal
        keepMounted
        open={updateDayOpen}
        onClose={handleUpdateDayClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box style={style}>
          <UpdateSpecialDayRoutine
            routineAlert={routineAlert}
            handleClose={handleUpdateDayClose}
            value={updateDay}
            values={days}
            k={key}
            id={values.id}
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
          severity="error"
        >
          {showAlert.message}
        </Alert>
      )}
    </>
  );
};
export default SpecialNuRoutineId;
