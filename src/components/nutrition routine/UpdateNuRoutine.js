import RichTextEditor from "react-rte";
import { useState, useEffect } from "react";
import imageService from "../../services/image";

import {
  Button,
  Typography,
  Box,
  Card,
  CardMedia,
  TextField,
  FormHelperText,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Alert,
  CardContent,
} from "@mui/material";
import { CREATE_NODAYS, UPDATE_NODAYS } from "../../gql/nuRoutine";
import { GET_IMAGE_UPLOAD_URL, DELETE_IMAGE } from "../../gql/misc";
import { useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";

const UpdateNuRoutine = (props) => {
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

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });
  const [values, setValues] = useState({
    description: "",
    routine_category: "",
    pdf_file_url: "",
    vegetarian: "",
    package_type: "",
    thumbnail_image_url: "",
    duration_of_routine_in_days: "",
  });
  const [errors, setErrors] = useState({
    description: "",
    routine_category: "",
    pdf_file_url: "",
    vegetarian: "",
    package_type: "",
    thumbnail_image_url: "",
    duration_of_routine_in_days: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [oldImageName, setOldImageName] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isImageChange, setIsImageChange] = useState(false);
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

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
      setValues({
        description: "",
        routine_category: "",
        pdf_file_url: "",
        vegetarian: "",
        package_type: "",
        thumbnail_image_url: "",
        duration_of_routine_in_days: "",
      });
      setErrors({
        description: "",
        routine_category: "",
        pdf_file_url: "",
        vegetarian: "",
        package_type: "",
        thumbnail_image_url: "",
        duration_of_routine_in_days: "",
      });
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      props.routineAlert("Routine have been updated.", false);
      props.handleClose();
    },
  });

  useEffect(() => {
    if (props.value) {
      let val = props.value;
      console.log(props.value);
      setValues(props.value);
      setTextValue(
        RichTextEditor.createValueFromString(val.description, "html")
      );
      console.log(val.thumbnail_image_url);
      setImagePreview(val.thumbnail_image_url);
      let image_url = val.thumbnail_image_url;
      //   setOldImageName(
      //   val.image_url.substring(image_url.lastIndexOf("/") + 1, image_url.lenght)
      //  );
      console.log(image_url);
    }
  }, [props.value]);

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
      errorObject.package_type = "Package Type is required";
      isErrorExit = true;
    }
    if (!values.vegetarian) {
      errorObject.vegetarian = "Vegetarian is required";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors(errorObject);
      setLoading(false);
      return;
    }

    try {
      if (isImageChange) {
        await imageService.uploadImage(imageFileUrl, imageFile);
        deleteImage({ variables: { image_name: oldImageName } });
      }
      updateRoutine({ variables: { ...values, id: props.value.id } });
    } catch (error) {
      console.log("error : ", error);
    }
  };

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
    props.handleClose();
  };

  if (!values) {
    return;
  }
  if (!props.value) {
    return;
  }

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
          Update Nutrition Routine
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
            <div className="grid--2--cols grid-item ">
              <TextField
                id="thumbnail_image_url"
                label="image_url"
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                InputLabelProps={{ shrink: "shrink" }}
                //value={values.thumbnail_image_url}
                onChange={imageChange}
                error={errors.thumbnail_image_url ? true : false}
                helperText={errors.thumbnail_image_url}
              />

              <TextField
                id="nutrition_routine_name"
                label="nutrition routine name"
                value={values.nutrition_routine_name}
                onChange={handleChange("nutrition_routine_name")}
                error={errors.nutrition_routine_name ? true : false}
                helperText={errors.nutrition_routine_name}
              />

              <TextField
                id="duration_of_routine_in_days"
                label="duration_of_routine_in_days"
                value={values.duration_of_routine_in_days}
                onChange={handleChange("duration_of_routine_in_days")}
                error={errors.duration_of_routine_in_days ? true : false}
                helperText={errors.duration_of_routine_in_days}
              />

              <FormControl variant="outlined">
                <InputLabel id="vegetarian">Vegetarian</InputLabel>
                <Select
                  labelId="vegetarian"
                  // value={values.vegetarian === "true" ? "Yes" : "No"}
                  label="vegetarian"
                  onChange={handleChange("vegetarian")}
                  error={errors.vegetarian ? true : false}
                >
                  <MenuItem value="0">False</MenuItem>
                  <MenuItem value="1">True</MenuItem>
                </Select>
                {errors.vegetarian && (
                  <FormHelperText error>{errors.vegetarian}</FormHelperText>
                )}
              </FormControl>
              <TextField
                id="routine_category"
                label="routine_category"
                value={values.routine_category}
                onChange={handleChange("routine_category")}
                error={errors.routine_category ? true : false}
                helperText={errors.routine_category}
              />
              <FormControl variant="outlined">
                <InputLabel id="main_type">Package Type</InputLabel>
                <Select
                  labelId="main_type"
                  value={values.package_type}
                  label="Package Type"
                  onChange={handleChange("package_type")}
                  error={errors.package_type ? true : false}
                >
                  <MenuItem value="0">Free</MenuItem>
                  <MenuItem value="1">Basic</MenuItem>
                  <MenuItem value="2">Medium</MenuItem>
                  <MenuItem value="3">Premium</MenuItem>
                </Select>
                {errors.package_type && (
                  <FormHelperText error>{errors.package_type}</FormHelperText>
                )}
              </FormControl>
              <TextField
                id="pdf_file_url"
                label="pdf_file_url"
                type="file"
                InputLabelProps={{ shrink: "shrink" }}
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
export default UpdateNuRoutine;
