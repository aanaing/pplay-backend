import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import imageService from "../../services/image";
import { GET_IMAGE_UPLOAD_URL, DELETE_IMAGE } from "../../gql/misc";
import { Box } from "@mui/system";
import {
  UPDATE_VIDEOS,
  SUB_TYPE_NAME,
  UPDATE_VIDEOS_ZUMBA,
} from "../../gql/video";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  FormControl,
  Menu,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";

const UpdateVideo = ({ handleClose, videoAlert, video }) => {
  const fileTypes = ["video/webm", "video/mkv", "video/mp4"];
  const thumbnailfileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
  ];

  const [isImageChange, setIsImageChange] = useState(false);
  const [oldImageName, setOldImageName] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    main_type: "",
    package_type: "",
    promotion: "",
    target_period: "",
    thumbnail_image_url: "",
    video_package_name: "",
    video_url_a: "",
    video_url_b: "",
    duration: "",
    sub_name: "",
  });
  const [errors, setErrors] = useState({
    main_type: "",
    package_type: "",
    promotion: "",
    target_period: "",
    thumbnail_image_url: "",
    video_package_name: "",
    video_url_a: "",
    video_url_b: "",
    duration: "",
    sub_name: "",
  });

  const [sub, setSub] = useState("");
  const [loadSub, resutSub] = useLazyQuery(SUB_TYPE_NAME);
  const [showSubInput, setShowSubInput] = useState(false);
  useEffect(() => {
    loadSub();
  }, [loadSub]);

  useEffect(() => {
    if (resutSub.data) {
      if(video.main_type === "ZUMBA"){
        setShowSubInput(true);
      }else{
        setShowSubInput(false);
      }
      setSub(resutSub.data.video_sub_type);
    }
  }, [resutSub]);

  // ------------- for input box -----------
  const handleChange = (prop) => (event) => {
    if (event.target.value === "ZUMBA") {
      setShowSubInput(true);
    }
    if (event.target.value === "HOME" || event.target.value === "GYM") {
      {
        setShowSubInput(false);
      }
    }
    setValues({ ...values, [prop]: event.target.value });
  };

  // -------------------- for image change----------
  const [getImageUrl] = useMutation(GET_IMAGE_UPLOAD_URL, {
    onError: (error) => {
      console.log("error : ", error);
    },
    onCompleted: (result) => {
      setImageFileUrl(result.getImageUploadUrl.imageUploadUrl);
      setIsImageChange(true);
      setValues({
        ...values,
        video_url_a: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
        video_url_b: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
        thumbnail_image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}`,
      });
    },
  });

  const [deleteImage] = useMutation(DELETE_IMAGE, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
  });

  // -------------------- for create and update --------------

  const [updateVideos] = useMutation(UPDATE_VIDEOS, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({
        main_type: "",
        package_type: "",
        promotion: "",
        target_period: "",
        thumbnail_image_url: "",
        video_package_name: "",
        video_url_a: "",
        video_url_b: "",
        duration: "",
        sub_name: "",
      });
      setErrors({
        main_type: "",
        package_type: "",
        promotion: "",
        target_period: "",
        thumbnail_image_url: "",
        video_package_name: "",
        video_url_a: "",
        video_url_b: "",
        duration: "",
        sub_name: "",
      });
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      videoAlert("New Video have been created.");
      handleClose();
    },
  });

  const [updateVideosZumba] = useMutation(UPDATE_VIDEOS_ZUMBA, {
    onError: (error) => {
      console.log("error : ", error);
      setLoading(false);
    },
    onCompleted: () => {
      setValues({
        main_type: "",
        package_type: "",
        promotion: "",
        target_period: "",
        thumbnail_image_url: "",
        video_package_name: "",
        video_url_a: "",
        video_url_b: "",
        duration: "",
        sub_name: "",
      });
      setErrors({
        main_type: "",
        package_type: "",
        promotion: "",
        target_period: "",
        thumbnail_image_url: "",
        video_package_name: "",
        video_url_a: "",
        video_url_b: "",
        duration: "",
        sub_name: "",
      });
      setImageFile("");
      setImagePreview("");
      setLoading(false);
      videoAlert("New Video have been created.");
      handleClose();
    },
  });

  useEffect(() => {
    if (video.main_type !== undefined) {
      setValues({
        main_type: video.main_type,
        package_type: video.user_subscription_level.id,
        promotion: video.promotion,
        target_period: video.target_period,
        thumbnail_image_url: video.thumbnail_image_url,
        video_package_name: video.video_package_name,
        video_url_a: video.video_url_a,
        video_url_b: video.video_url_b,
        duration: video.duration,
        sub_name: video.video_sub_type ? video.video_sub_type.id : "-",
      });
      setImagePreview(video.thumbnail_image_url);
    }

    setOldImageName();
    // image_url.substring(image_url.lastIndexOf("/") + 1, image_url.lenght);
  }, [
    video.main_type,
    video.package_type,
    video.promotion,
    video.target_period,
    video.thumbnail_image_url,
    video.video_package_name,
    video.video_url_a,
    video.video_url_b,
    video.duration,
    video.sub_name,
  ]);

  //console.log(values);

  const thumbnailImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let thumbImg = e.target.files[0];
      if (!thumbnailfileTypes.includes(thumbImg.type)) {
        setErrors({
          ...errors,
          thumbnail_image_url:
            "Please select images. (PNG, JPG, JPEG, GIF, ...)",
        });
        return;
      }
      if (thumbImg.size > 10485760) {
        setErrors({
          ...errors,
          thumbnail_image_url: "Image file size must be smaller than 10MB.",
        });
        return;
      }
      setImageFile(thumbImg);
      setImagePreview(URL.createObjectURL(thumbImg));
      getImageUrl();
    }
  };

  const videoChangeA = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let videofile = e.target.files[0];

      if (!fileTypes.includes(videofile.type)) {
        setErrors({
          ...errors,
          video_url_a: "Please select video. (mp4,mkv,...)",
        });
        return;
      }
      if (videofile.size > 1048576000) {
        setErrors({
          ...errors,
          video_url_a: "Video file size must be smaller than 100MB.",
        });
        return;
      }
      setImageFile(videofile);
      //setImagePreview(URL.createObjectURL(videofile));
      getImageUrl();
    }
  };
  const videoChangeB = async (e) => {
    if (e.target.files && e.target.files[0]) {
      let videofile = e.target.files[0];

      if (!fileTypes.includes(videofile.type)) {
        setErrors({
          ...errors,
          video_url_b: "Please select video. (mp4,mkv,...)",
        });
        return;
      }
      if (videofile.size > 1048576000) {
        setErrors({
          ...errors,
          video_url_b: "Video file size must be smaller than 100MB.",
        });
        return;
      }
      setImageFile(videofile);
      //setImagePreview(URL.createObjectURL(videofile));
      getImageUrl();
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setErrors({
      main_type: "",
      package_type: "",
      promotion: "",
      target_period: "",
      thumbnail_image_url: "",
      video_package_name: "",
      video_url_a: "",
      video_url_b: "",
      duration: "",
      sub_name: "",
    });
    let isErrorExit = false;
    let errorObject = {};

    // if (!values.video_url_a || !imageFile) {
    //   errorObject.video_url_a = "Video A field is required.";
    //   isErrorExit = true;
    // }
    // if (!values.video_url_b || !imageFile) {
    //   errorObject.video_url_b = "Video B field is required.";
    //   isErrorExit = true;
    // }
    // if (!values.thumbnail_image_url || !imageFile) {
    //   errorObject.thumbnail_image_url = "Video Image field is required.";
    //   isErrorExit = true;
    // }
    if (!values.video_package_name) {
      errorObject.video_package_name = "Video Title field is required.";
      isErrorExit = true;
    }
    if (!values.main_type) {
      errorObject.main_type = "Main Type field is required.";
      isErrorExit = true;
    }
    if (!values.duration) {
      errorObject.duraion = "duration field is required.";
      isErrorExit = true;
    }
    if (!values.sub_name && !showSubInput) {
      errorObject.sub_name = "sub name field is required.";
      isErrorExit = true;
    }
    if (!values.package_type) {
      errorObject.package_type = "package_type field is required.";
      isErrorExit = true;
    }
    // if (!values.promotion) {
    //   errorObject.promotion = "promotion field is required.";
    //   isErrorExit = true;
    // }
    if (!values.target_period) {
      errorObject.target_period = "target_period field is required.";
      isErrorExit = true;
    }
    if (isErrorExit) {
      setErrors({ ...errorObject });
      setLoading(false);
      console.log(errorObject);
      return;
    }
    try {
      if (isImageChange) {
        await imageService.uploadImage(imageFileUrl, imageFile);
        deleteImage({ variables: { image_name: oldImageName } });
      }
      if (values.main_type === "ZUMBA") {
        values.sub_name = null;
        setValues(values);
        // console.log("update video 1", values);
      }

        updateVideos({ variables: { ...values, id: video.id } });

    } catch (error) {
      console.log("error : ", error);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          color: "black",
          maxWidth: "lg",
          bgcolor: "#cecece",
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          py: 2,
          mx: 13,
        }}
      >
        <Typography variant="h5" component="h2" color="black" sx={{ mx: 4 }}>
          Update Video
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          color="error"
          sx={{ mx: 4 }}
        >
          Close
        </Button>
      </Box>
      <Card
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          color: "white",
          bgcolor: "white",
          maxWidth: "lg",
          mx: 13,
          borderRadius: 0,
          height: 600,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            my: 2,
            mx: 3,
            ml: 5,
          }}
        >
          <CardMedia
            component="img"
            image={imagePreview}
            alt="Video image"
            sx={{
              flex: 1,
              bgcolor: "#cecece",
              maxHeight: 280,
              objectFit: "contain",
              width: 300,
              mt: 4,
              boxShadow: 10,
              borderRadius: 2,
              border: 1,
            }}
          />
        </Box>

        <CardContent sx={{ mx: 1.5, my: 2, maxWidth: 500 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="video_url_a"
              label="Upload Video A"
              type="file"
              InputLabelProps={{ shrink: "shrink" }}
              sx={{ my: 2 }}
              onChange={videoChangeA}
              error={errors.video_url_a ? true : false}
              helperText={errors.video_url_a}
              accept="video/webm, video/mkv, video/mp4"
            />
            <TextField
              id="video_url_b"
              label="Upload Video B"
              type="file"
              InputLabelProps={{ shrink: "shrink" }}
              sx={{ my: 2 }}
              onChange={videoChangeB}
              error={errors.video_url_b ? true : false}
              helperText={errors.video_url_b}
              accept="video/webm, video/mkv, video/mp4"
            />
            <TextField
              id="thumbnail_image_url"
              label="image_url"
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
              InputLabelProps={{ shrink: "shrink" }}
              sx={{ my: 2 }}
              //value={values.thumbnail_image_url}
              onChange={thumbnailImageChange}
              error={errors.thumbnail_image_url ? true : false}
              helperText={errors.thumbnail_image_url}
            />
            <TextField
              id="video_package_name"
              label="Video Package Name"
              sx={{ my: 2 }}
              value={values.video_package_name}
              onChange={handleChange("video_package_name")}
              error={errors.video_package_name ? true : false}
              helperText={errors.video_package_name}
            />

            <FormControl sx={{ my: 2 }} variant="outlined">
              <InputLabel id="main_type">Main Type</InputLabel>
              <Select
                labelId="main_type"
                value={values.main_type}
                label="Main Type"
                onChange={handleChange("main_type")}
                error={errors.main_type ? true : false}
              >
                <MenuItem value="HOME">HOME</MenuItem>
                <MenuItem value="GYM">GYM</MenuItem>
                <MenuItem value="ZUMBA">ZUMBA</MenuItem>
              </Select>
              {errors.main_type && (
                <FormHelperText error>{errors.main_type}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <LoadingButton
            variant="contained"
            //color="inherit"
            size="large"
            sx={{ maxWidth: 100, mt: "1rem" }}
            loading={loading}
            onClick={handleCreate}
          >
            Update
          </LoadingButton>
        </CardContent>
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mx: 2,

              my: 4,
              minWidth: 320,
            }}
          >
            <FormControl sx={{ my: 2 }} variant="outlined">
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
              id="target_period"
              label="target_period"
              sx={{ my: 2 }}
              value={values.target_period}
              onChange={handleChange("target_period")}
              error={errors.target_period ? true : false}
              helperText={errors.target_period}
            />
            <TextField
              id="duration"
              label="duration"
              sx={{ my: 2 }}
              value={values.duration}
              onChange={handleChange("duration")}
              error={errors.duration ? true : false}
              helperText={errors.duration}
            />
            <FormControl variant="outlined" sx={{ my: 2 }}>
              <InputLabel id="promotion">Promotion</InputLabel>
              <Select
                labelId="promotion"
                value={values.promotion}
                label="Promotion"
                onChange={handleChange("promotion")}
                error={errors.promotion ? true : false}
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
              {errors.promotion && (
                <FormHelperText error>{errors.promotion}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              variant="outlined"
              sx={{ my: 2 }}
              disabled={showSubInput}
            >
              <InputLabel id="sub_type">Sub type</InputLabel>
              <Select
                labelId="sub_type"
                value={values.sub_name}
                label="sub_type"
                onChange={handleChange("sub_name")}
                error={errors.sub_name ? true : false}
              >
                {Array.isArray(sub)
                  ? sub.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>
                        {sub.sub_type_name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
              {errors.sub_name && (
                <FormHelperText error>{errors.sub_name}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </div>
      </Card>
    </div>
  );
};
export default UpdateVideo;
