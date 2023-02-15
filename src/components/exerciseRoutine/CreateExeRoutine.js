import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import RichTextEditor from "react-rte";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  CardMedia,
} from "@mui/material";
import { Box } from "@mui/system";
import { validateSDL } from "graphql/validation/validate";
import { useState, useEffect } from "react";
import { CREATE_EXE_ROUTINE, SUB_TYPE_NAME } from "../../gql/exeRoutine";
import image from "../../services/image";
import { GET_IMAGE_UPLOAD_URL } from "../../gql/misc";
import imageService from "../../services/image";

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

const CreateExeRoutine = ({ handleClose, routineAlert }) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [sub, setSub] = useState([]);
  const [loadSub, resultSub] = useLazyQuery(SUB_TYPE_NAME);

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());

  useEffect(() => {
    loadSub();
  }, [loadSub]);

  useEffect(() => {
    if (resultSub.data) {
      setSub(resultSub.data.video_sub_type);
    }
  }, [resultSub]);

  // for image

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
        thumbnail_image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const imageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
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
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    delete errors[prop];
    setErrors(errors);
  };

  const [createRoutine] = useMutation(CREATE_EXE_ROUTINE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
      console.log("wrong");
    },
    onCompleted: () => {
      console.log("right");
      setValues({});
      setErrors({});
      setImagePreview("");
      setLoading(false);
      routineAlert("New Routine has been added");
      handleClose();
    },
  });

  const handleClosClearData = () => {
    console.log("error");
    setValues({});
    setErrors({});
    handleClose();
  };

  const handleCreate = () => {
    setLoading(true);
    setErrors({});
    let isErrorExit = false;
    let errorObject = {};

    if (!values.exercise_routine_name) {
      errorObject.exercise_routine_name = "Routine name is required";
      isErrorExit = true;
    }
    if (!values.thumbnail_image_url || !imageFile) {
      errorObject.thumbnail_image_url = "Image field is required.";
      isErrorExit = true;
    }
    if (!values.routine_category) {
      errorObject.routine_category = "Routine Category is required";
      isErrorExit = true;
    }
    if (!values.description) {
      errorObject.description = "Description is required";
      isErrorExit = true;
    }
    if (!values.day_1) {
      errorObject.day_1 = "day 1 is required";
      isErrorExit = true;
    }
    if (!values.day_2) {
      errorObject.day_2 = "day 2 is required";
      isErrorExit = true;
    }
    if (!values.day_3) {
      errorObject.day_3 = "day 3 is required";
      isErrorExit = true;
    }
    if (!values.day_4) {
      errorObject.day_4 = "day 4 is required";
      isErrorExit = true;
    }
    if (!values.day_5) {
      errorObject.day_5 = "day 5 is required";
      isErrorExit = true;
    }
    if (!values.day_6) {
      errorObject.day_6 = "day 6 is required";
      isErrorExit = true;
    }
    if (!values.day_7) {
      errorObject.day_7 = "day 7 is required";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors(errorObject);
      setLoading(false);
      return;
    }
    try {
      //      await imageService.uploadImage(imageFileUrl, imageFile);
      imageService.uploadImage(imageFileUrl, imageFile);

      createRoutine({ variables: { ...values } });
    } catch (error) {
      console.log("error bbbbbbbbbbbbbbb : ", error);
    }
  };
  // for Description
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
  console.log(errors);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "black",
          bgcolor: "#cecece",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          py: 2,
        }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Create Routine
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
        <CardContent className="grid--2--cols">
          {/* image */}
          <Box className="grid-img">
            <CardMedia
              sx={{
                flex: 1,
                bgcolor: "#cecece",
                objectFit: "contain",
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

          {/* list-items */}
          <div className="grid-item grid--2--cols">
            <TextField
              id="exercise_routine_name"
              label="exercise_routine_name"
              value={values.exercise_routine_name}
              onChange={handleChange("exercise_routine_name")}
              error={errors.exercise_routine_name ? true : false}
              helperText={errors.exercise_routine_name}
            />
            {/* routine_categroy */}
            <TextField
              id="routine_category"
              label="routine_category"
              value={values.routine_category}
              onChange={handleChange("routine_category")}
              error={errors.routine_category ? true : false}
              helperText={errors.routine_category}
            />

            {/* thumbnail_image_url */}
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

            {/* day_1 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_1</InputLabel>
              <Select
                labelId="day_1"
                label="day_1"
                onChange={handleChange("day_1")}
                error={errors.day_1 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_1 && (
                <FormHelperText error>{errors.day_1}</FormHelperText>
              )}
            </FormControl>
            {/* day_2 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_2</InputLabel>
              <Select
                labelId="day_2"
                label="day_2"
                onChange={handleChange("day_2")}
                error={errors.day_2 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_2 && (
                <FormHelperText error>{errors.day_2}</FormHelperText>
              )}
            </FormControl>
            {/* day_3 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_3</InputLabel>
              <Select
                labelId="day_3"
                label="day_3"
                onChange={handleChange("day_3")}
                error={errors.day_3 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_3 && (
                <FormHelperText error>{errors.day_3}</FormHelperText>
              )}
            </FormControl>
            {/* day4 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_4</InputLabel>
              <Select
                labelId="day_4"
                label="day_4"
                onChange={handleChange("day_4")}
                error={errors.day_4 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_4 && (
                <FormHelperText error>{errors.day_4}</FormHelperText>
              )}
            </FormControl>
            {/* day_5 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_5</InputLabel>
              <Select
                labelId="day_5"
                label="day_5"
                onChange={handleChange("day_5")}
                error={errors.day_5 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_5 && (
                <FormHelperText error>{errors.day_5}</FormHelperText>
              )}
            </FormControl>
            {/* day_6 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_6</InputLabel>
              <Select
                labelId="day_6"
                label="day_6"
                onChange={handleChange("day_6")}
                error={errors.day_6 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_6 && (
                <FormHelperText error>{errors.day_6}</FormHelperText>
              )}
            </FormControl>
            {/* day_7 */}
            <FormControl variant="outlined">
              <InputLabel id="sub_type">day_7</InputLabel>
              <Select
                labelId="day_7"
                label="day_7"
                onChange={handleChange("day_7")}
                error={errors.day_7 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.day_7 && (
                <FormHelperText error>{errors.day_7}</FormHelperText>
              )}
            </FormControl>
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
    </div>
  );
};

export default CreateExeRoutine;
