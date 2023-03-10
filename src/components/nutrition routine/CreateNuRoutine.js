import RichTextEditor from "react-rte";
import { useState } from "react";
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
  CREATE_EACH_DAY,
  CREATE_NUROUTINE,
  CREATE_NODAYS,
} from "../../gql/nuRoutine";
import { GET_IMAGE_UPLOAD_URL } from "../../gql/misc";
import { useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";

const CreateNuRoutine = ({ handleClose }) => {
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
  const pdfFileTypes=['pdf','pdf/A','pdf/V','pdf/x','pdf/UA']
  const pdfType='application/pdf'

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState({ message: "", isError: false });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [pdfFile,setPdfFile]=useState(null);
  const [pdfFileUrl,setPdfFileUrl]=useState(null);
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  /*---------------------------*/

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [getPdfUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
    onError: (error) => {
      console.log("imge errors", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
    onCompleted: (result) => {
      setPdfFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setValues({
        ...values,
        pdf_file_url: `https://axra.sgp1.digitaloceanspaces.com/Powerplay/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const [getImageUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
    onError: (error) => {
      console.log("imge errors", error);
      setShowAlert({ message: "Error on server", isError: true });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
    onCompleted: (result) => {
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setValues({
        ...values,
        thumbnail_image_url: `https://axra.sgp1.digitaloceanspaces.com/PowerPlay/${result.getImageUploadUrl.imageName}`,
      });
    },
  });


  //get data from db
  const [createNuRoutine] = useMutation(CREATE_NODAYS, {
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

      setTextValue(RichTextEditor.createEmptyValue());

      setImageFile("");
      setPdfFile('');
      setImagePreview("");
      setLoading(false);
      setShowAlert({
        message: "Nurtrition Routine have been created.",
        isError: false,
      });
      setTimeout(() => {
        setShowAlert({ message: "", isError: false });
      }, 1000);
    },
  });

  const imageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      //console.log(e.target.files);
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

  const pdfChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      //console.log(e.target.files);
      let img = e.target.files[0];
      if (!pdfFileTypes.includes(img.type)) {
        setErrors({
          ...errors,
          
        });
        return;
      }
      if (img.size > 10485760) {
        setErrors({
          ...errors,
         pdf_file_url: "Pdf file size must be smaller than 10MB.",
        });
        return;
      }
      setPdfFile(img);      
      getPdfUrl({variables:{contentType:pdfType}});
    }
  };

  //for create routine
  const handleCreate = async () => {
    setLoading(true);
    setErrors({});
    let isErrorExit = false;
    let errorObject = {};
    if (!values.nutrition_routine_name) {
      errorObject.nutrition_routine_name = "Routine name is required";
      isErrorExit = true;
    }
    if (!values.thumbnail_image_url || !imageFile) {
      errorObject.thumbnail_image_url = "Image field is required.";
      isErrorExit = true;
    }

    if (!values.package_type) {
      errorObject.package_type = "package_type is required";
      isErrorExit = true;
    }
    if (!values.duration_of_routine_in_days) {
      errorObject.duration_of_routine_in_days =
        "duration_of_routine_in_days is required";
      isErrorExit = true;
    }
    if (!values.description) {
      errorObject.description = "description is required";
      isErrorExit = true;
    }
    if (!values.pdf_file_url) {
      errorObject.pdf_file_url = "pdf_file_url is required";
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
      await imageService.uploadImage(imageFileUrl, imageFile);
      await imageService.uploadImage(pdfFileUrl, pdfFile);
      createNuRoutine({ variables: { ...values } });
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleClosClearData = () => {
    setValues({});
    setErrors({});
    handleClose();
  };

  const onChange = (value) => {
    setTextValue(value);
    setValues({ ...values, description: value.toString("html") });
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
        }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Create Nutrition Routine
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

      <Card sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
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
            <div className="grid--2--cols grid-item">
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

              <TextField
                id="nutrition_routine_name"
                label="nutrition routine name"
                //value={values.nutrition_routine_name}
                onChange={handleChange("nutrition_routine_name")}
                error={errors.nutrition_routine_name ? true : false}
                helperText={errors.nutrition_routine_name}
              />

              <TextField
                id="duration_of_routine_in_days"
                label="duration_of_routine_in_days"
                //value={values.duration_of_routine_in_days}
                onChange={handleChange("duration_of_routine_in_days")}
                error={errors.duration_of_routine_in_days ? true : false}
                helperText={errors.duration_of_routine_in_days}
              />

              <FormControl>
                <InputLabel id="vegetarian">Vegetarian</InputLabel>
                <Select
                  labelId="vegetarian"
                  // value={values.package_type}
                  label="vegetarian"
                  defaultValue=''
                  onChange={handleChange("vegetarian")}
                  error={errors.vegetarian ? true : false}
                >
                  <MenuItem value=''>Value</MenuItem>
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
                //value={values.routine_category}
                onChange={handleChange("routine_category")}
                error={errors.routine_category ? true : false}
                helperText={errors.routine_category}
              />
              <FormControl>
                <InputLabel id="main_type">Package Type</InputLabel>
                <Select
                  labelId="main_type"
                  // value={values.package_type}
                  label="Package Type"
                  defaultValue=''
                  onChange={handleChange("package_type")}
                  error={errors.package_type ? true : false}
                >
                  <MenuItem value='' disabled>package_type</MenuItem>
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
                accept="application/pdf"
                InputLabelProps={{ shrink: true }}
                //value={values.thumbnail_image_url}
                onChange={pdfChange}
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
            onClick={handleCreate}
          >
            Create
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
export default CreateNuRoutine;
