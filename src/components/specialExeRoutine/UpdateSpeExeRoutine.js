import { useLazyQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
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
import { useEffect, useState } from "react";
import {
  CREATE_EXE_ROUTINE,
  SUB_TYPE_NAME,
  UPDATE_SPECIAL_EXE_ROUTINE,
  USER_ID,
} from "../../gql/specialExeRoutine";
import RichTextEditor from "react-rte";
import { GET_IMAGE_UPLOAD_URL, DELETE_IMAGE } from "../../gql/misc";
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

const UpdateSpeExeRoutine = ({ handleClose, routineAlert, value }) => {
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sub, setSub] = useState(null);
  const [loadSub, resultSub] = useLazyQuery(SUB_TYPE_NAME);
  const [user, setUser] = useState([]);
  const [loadUser, resultUser] = useLazyQuery(USER_ID);
  const [oldImageName, setOldImageName] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isImageChange, setIsImageChange] = useState(false);
  const [textValue, setTextValue] = useState(RichTextEditor.createEmptyValue());
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (resultUser.data) {
      setUser(resultUser.data.users);
    }
  }, [resultUser]);

  useEffect(() => {
    console.log("value work");
    if (value) {
      setValues(value);
      setTextValue(
        RichTextEditor.createValueFromString(value.description, "html")
      );
      setImagePreview(value.thumbnail_image_url);
      let image_url = value.thumbnail_image_url;
      setOldImageName(
        image_url.substring(image_url.lastIndexOf("/") + 1, image_url.lenght)
      );
    }
  }, [value]);

  useEffect(() => {
    loadSub();
  }, [loadSub]);

  useEffect(() => {
    if (resultSub.data) {
      setSub(resultSub.data.video_sub_type);
    }
  }, [resultSub]);

  // if(values){
  //   values.day_1 = "min khant";
  //   console.log("updateValues", values.day_1);
  // }

  const handleClosClearData = () => {
    console.log("error");
    setValues({});
    setErrors({});
    handleClose();
  };

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

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  const [updateRoutine] = useMutation(UPDATE_SPECIAL_EXE_ROUTINE, {
    onError: (error) => {
      console.log("error:", error);
      setLoading(false);
    },
    onCompleted: (data) => {
      setValues({});
      setErrors({});
      setLoading(false);
      routineAlert("Routine has been updated");
      handleUpdateClose();
    },
  });

  useEffect(() => {
    setValues(value);
  }, [value]);

  const handleUpdateClose = () => {
    setValues({});
    setErrors({});
    handleClose();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleCreate = () => {
    setLoading(true);
    setErrors({});

    let isErrorExit = false;
    let errorObject = {};

    if (!values.exercise_routine_name) {
      errorObject.exercise_routine_name = "Routine Name is required";
      isErrorExit = true;
    }
    if (!values.day_1) {
      errorObject.day_1 = "Day 1 is required";
      isErrorExit = true;
    }
    if (!values.day_2) {
      errorObject.day_2 = "Day 2 is required";
      isErrorExit = true;
    }
    if (!values.day_3) {
      errorObject.day_3 = "Day 3 is required";
      isErrorExit = true;
    }
    if (!values.day_4) {
      errorObject.day_4 = "Day 4 is required";
      isErrorExit = true;
    }
    if (!values.day_5) {
      errorObject.day_5 = "Day 5 is required";
      isErrorExit = true;
    }
    if (!values.day_6) {
      errorObject.day_6 = "Day 6 is required";
      isErrorExit = true;
    }
    if (!values.day_7) {
      errorObject.day_7 = "Day 7 is required";
      isErrorExit = true;
    }

    if (isErrorExit) {
      setErrors(errorObject);
      setLoading(false);
      return;
    }
    try {
      if (isImageChange) {
        imageService.uploadImage(imageFileUrl, imageFile);
        deleteImage({ variables: { image_name: oldImageName } });
      }
      console.log(values);
      updateRoutine({ variables: { ...values } });
    } catch (e) {
      console.log("error:", e.message);
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

  if (!values) {
    console.log("no values, loading");
    return "no values";
  }

  if (!value) {
    console.log("no data,  loading");
    return "no data";
  }
  console.log(values);

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
          Update Special Exercise Routine
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
              id="special_exe_routine_name"
              label="special_exe_routine_name"
              value={values.special_exe_routine_name}
              onChange={handleChange("special_exe_routine_name")}
              error={errors.special_exe_routine_name ? true : false}
              helperText={errors.special_exe_routine_name}
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
                value={values.day_1}
                label="day_1"
                onChange={handleChange("day_1")}
                error={errors.day_1 ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => {
                      if (sub.id === values.day_1) {
                        console.log("default values");
                      }
                      //  console.log(sub.id);
                      return (
                        <MenuItem key={sub.id} value={sub.id}>
                          {sub.sub_type_name}
                        </MenuItem>
                      );
                    })
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
                value={values.day_2}
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
                value={values.day_3}
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
                value={values.day_4}
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
                value={values.day_5}
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
                value={values.day_6}
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
                value={values.day_7}
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
            {/* User */}
            <FormControl variant="outlined">
              <InputLabel id="User ID">User Name</InputLabel>
              <Select
                labelId="User Name"
                label="User Name"
                onChange={handleChange("user_name")}
                error={errors.user_name ? true : false}
              >
                {Array.isArray(user)
                  ? user.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.username}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.user && (
                <FormHelperText error>{errors.user}</FormHelperText>
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
            Update
          </LoadingButton>
        </Box>
      </Card>
    </div>
  );
};

export default UpdateSpeExeRoutine;
