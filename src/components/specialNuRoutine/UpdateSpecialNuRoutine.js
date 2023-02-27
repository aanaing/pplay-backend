import RichTextEditor from "react-rte";
import { useState, useEffect } from "react";
import imageService from "../../services/image";
import {
  Button,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  TextField,
  FormHelperText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Alert,
  
  TextareaAutosize,
  CardContent,
} from "@mui/material";
import {
  CREATE_NODAYS,
  UPDATE_NODAYS,
  USER_ID,
} from "../../gql/specialNuRoutine";
import { GET_IMAGE_UPLOAD_URL, DELETE_IMAGE } from "../../gql/misc";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";

<<<<<<< HEAD
const UpdateNuRoutine = ({handleClose,routineAlert,value}) => {
  
=======
const UpdateSpeNuRoutine = ({ routineAlert, handleClose, value }) => {
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  const [values, setValues] = useState({});

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false }); 
  const [errors, setErrors] = useState({});

  const [imagePreview, setImagePreview] = useState(null);
  const [oldImageName, setOldImageName] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isImageChange, setIsImageChange] = useState(false);

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  const [loadUser, resultUser] = useLazyQuery(USER_ID);
  const [user, setUser] = useState({});

  //get user datas
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (resultUser.data) {
      setUser(resultUser.data.users);
    }
  }, [resultUser]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  const [getImageUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
    onError: () => {
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
    onCompleted: (result) => {
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setIsImageChange(true);
      setValues({
        ...values,
        thumbnail_image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const [updateRoutine] = useMutation(UPDATE_NODAYS, {
    onError: (error) => {
      console.log("error : ", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({});
      setErrors({});
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      routineAlert("Routine have been updated.", false);
      handleClose();
    },
  });

<<<<<<< HEAD

=======
  useEffect(() => {
    if (value) {
      setValues({ ...value, user: value.fk_user_id });
      setTextValue(
        RichTextEditor.createValueFromString(value.description, "html")
      );
      setImagePreview(value.thumbnail_image_url);
      let image_url = value.thumbnail_image_url;
      // setOldImageName(
      //   image_url.substring(image_url.lastIndexOf("/") + 1, image_url.lenght)
      // );
    }
  }, [value]);
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc

  const imageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (!fileTypes.includes(img.type)) {
        setErrors({
          ...errors,
          thumbnail_image_url:
            "Please select image. (PNG, JPG, JPEG, GIF, ...)",
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
          thumbnail_image_url: "Image file size must be smaller than 10MB.",
        });
        return;
      }
      setImageFile(img);
      setImagePreview(URL.createObjectURL(img));
      getImageUrl();
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrors({
      name: "",
      price: "",
      description: "",
      value_image_url: "",
      category: "",
      brand: "",
      discount: "",
      review: "",
      barcode: "",
    });
    let isErrorExit = false;
    let errorObject = {};
    if (!values.package_type) {
      errorObject.package_type = "Package type is required";
      isErrorExit = true;
    }
    if (!values.user_name) {
      errorObject.user_name = "username is required";
      isErrorExit = true;
    }

    if (!values.vegetarian) {
      errorObject.vegetarian = "vegetarian is required";
      isErrorExit = true;
    }

    if (isErrorExit) {
      setErrors({ ...errorObject });
      console.log(errorObject);
      setLoading(false);
      return;
    }

    try {
      if (isImageChange) {
        await imageService.uploadImage(imageFileUrl, imageFile);
        deleteImage({ variables: { image_name: oldImageName } });
      }

      updateRoutine({ variables: { ...values, id: value.id } });
    } catch (error) {
      console.log("error : ", error);
    }
  };

 
  useEffect(() => {
    if (value) {          
      setValues(value);
      console.log('update value',values)
      setTextValue(
        RichTextEditor.createValueFromString(value.description, "html")
      );
      setImagePreview(value.thumbnail_image_url);
      let image = value.thumbnail_image_url;
      // setOldImageName(
      //   image.substring(image.lastIndexOf("/") + 1, image.lenght)
      // );
    }
  }, [value]);
  
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };
  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, description: value.toString("html") });
  };
  const handleClosClearData = () => {
    setValues({});
    setErrors({});
    handleClose();
  };

   if (!value) {
   return "no value";
  }
  if (!resultUser) {
    return;
  }
<<<<<<< HEAD
  if (!values) {
        return "no values";
  }

console.log('Values are',values)
=======
  console.log(values);
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "black",
          // width: "94.5vw",
          bgcolor: "#cecece",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          py: 2,
          gridColumn: 1 / -1,
        }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Update Special Nutrition Routine
        </Typography>
        <Button
          onClick={handleClosClearData}
          variant="contained"
          color="error"
          sx={{ mx: 4 }}
        >
          Close
        </Button>
      </Box>

      <Card>
        <CardContent>
          <div className="grid--2--cols">
            {/* image */}
            <Box>
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
                }}
                component="img"
                height="300"
                image={imagePreview}
                alt="notification image"
                className="grid_img"
              />
            </Box>

            {/* list items */}
            <div className="grid-item grid--2--cols">
<<<<<<< HEAD
            {/* thumbnail_image_url */}
=======
              {/* thumbnail_image_url */}
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              <TextField
                id="thumbnail_image_url"
                label="image_url"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                InputLabelProps={{ shrink: true }}
                //value={values.thumbnail_image_url}
                onChange={imageChange}
                error={errors.thumbnail_image_url ? true : false}
                helperText={errors.thumbnail_image_url}
              />
<<<<<<< HEAD

            {/* nutrition_routine_name */}
=======
              {/* nutrition_routine_name */}
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              <TextField
                id="nutrition_routine_name"
                label="nutrition routine name"
                value={
                  values.nutrition_routine_name
                    ? values.nutrition_routine_name
                    : "-"
                }
                onChange={handleChange("nutrition_routine_name")}
                error={errors.nutrition_routine_name ? true : false}
                helperText={errors.nutrition_routine_name}
              />
              {/* duration_of_routine_in_days */}
              <TextField
                id="duration_of_routine_in_days"
                label="duration_of_routine_in_days"
                value={
                  values.duration_of_routine_in_days
                    ? values.duration_of_routine_in_days
                    : "-"
                }
                onChange={handleChange("duration_of_routine_in_days")}
                error={errors.duration_of_routine_in_days ? true : false}
                helperText={errors.duration_of_routine_in_days}
              />
<<<<<<< HEAD
                  {/* vegetarian */}
=======
              {/* vegetarian */}
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              <FormControl>
                <InputLabel id="vegetarian">Vegetarian</InputLabel>
                <Select
                  labelId="vegetarian"
<<<<<<< HEAD
                  value={values.vegetarian === 'true' ? "Yes" : "No"}
=======
                  value={values.vegetarian}
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
                  label="vegetarian"
                  defaultValue=""
                  onChange={handleChange("vegetarian")}
                  error={errors.vegetarian ? true : false}
                >
<<<<<<< HEAD
                  <MenuItem value='' disabled>Value</MenuItem>
=======
                  <MenuItem value="" disabled>
                    Value
                  </MenuItem>
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
                  <MenuItem value="0">False</MenuItem>
                  <MenuItem value="1">True</MenuItem>
                </Select>
                {errors.vegetarian && (
                  <FormHelperText error>{errors.vegetarian}</FormHelperText>
                )}
              </FormControl>
<<<<<<< HEAD

=======
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              {/* routine_category */}
              <TextField
                id="routine_category"
                label="routine_category"
                value={values.routine_category ? values.routine_category : "-"}
                onChange={handleChange("routine_category")}
                error={errors.routine_category ? true : false}
                helperText={errors.routine_category}
              />
              {/* package_type */}
              <FormControl>
                <InputLabel id="main_type">Package Type</InputLabel>
                <Select
<<<<<<< HEAD
                  labelId="main_type"
                  defaultValue=""
                  value={values.fk_user_subscription_level_id? values.fk_user_subscription_level_id:'-'}
=======
                  labelId="package_type"
                  value={values.fk_user_subscription_level_id}
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
                  label="Package Type"
                  defaultValue=""
                  onChange={handleChange("package_type")}
                  error={errors.package_type ? true : false}
                >
<<<<<<< HEAD
                
                  <MenuItem value='' disabled>Package Type</MenuItem>
                  <MenuItem value="0">Free</MenuItem>
=======
                  <MenuItem value="" disabled>
                    Value
                  </MenuItem>
                  <MenuItem value="0" selected>
                    Free
                  </MenuItem>
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
                  <MenuItem value="1">Basic</MenuItem>
                  <MenuItem value="2">Medium</MenuItem>
                  <MenuItem value="3">Premium</MenuItem>
                </Select>
                {errors.package_type && (
                  <FormHelperText error>{errors.package_type}</FormHelperText>
                )}
              </FormControl>
<<<<<<< HEAD

              {/* User Name */}
=======
              {/* user_name */}

>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              <FormControl>
                <InputLabel id="User ID">User Name</InputLabel>
                <Select
                  labelId="User Name"
                  label="User Name"
<<<<<<< HEAD
                  defaultValue="" 
                  value={values.fk_user_id}                 
                  onChange={handleChange("user_name")}
                  error={errors.user_name ? true : false}
                >
                <MenuItem value='' disabled>User Name</MenuItem>
                  {Array.isArray(user)
                    ? user.map((u) => (
                        <MenuItem key={u.id} value={u.id} >
=======
                  defaultValue=""
                  value={values.fk_user_id ? values.fk_user_id : "-"}
                  onChange={handleChange("user_name")}
                  error={errors.user_name ? true : false}
                >
                  <MenuItem value="" disabled>
                    Value
                  </MenuItem>
                  {Array.isArray(user)
                    ? user.map((u) => (
                        <MenuItem key={u.id} value={u.id} selected>
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
                          {u.username}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {errors.user_name && (
                  <FormHelperText error>{errors.user_name}</FormHelperText>
                )}
              </FormControl>
<<<<<<< HEAD

=======
>>>>>>> ad4e10d9714b9e52b7041fc4073f1b34abc6fdcc
              {/* pdf_file_url */}
              <TextField
                id="pdf_file_url"
                label="pdf_file_url"
                type="file"
                InputLabelProps={{ shrink: true }}
                //value={values.pdf_file_url}
                onChange={handleChange("pdf_file_url")}
                error={errors.pdf_file_url ? true : false}
                helperText={errors.pdf_file_url}
              />
              {/* description */}
              <Box className="description">
                <InputLabel style={{ marginBottom: 10, fontWeight: "bold" }}>
                  Description
                </InputLabel>
                <RichTextEditor
                  className="description-text"
                  //onChange={handleChange("description")}
                  onChange={onChange}
                  value={textValue}
                  toolbarConfig={toolbarConfig}
                />
                {errors.description && (
                  <FormHelperText error> {errors.description}</FormHelperText>
                )}
              </Box>
            </div>
          </div>
        </CardContent>

        <Box className="btn_end">
          <LoadingButton
            variant="contained"
            //color="warning"
            size="large"
            sx={{ height: 50, width: 100 }}
            loading={loading}
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </Box>
      </Card>

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
export default UpdateSpeNuRoutine;
