import React, { useEffect, useState } from "react"
import imageService from "../../services/image";
import { useMutation } from '@apollo/client'
import { GET_IMAGE_UPLOAD_URL, DELETE_IMAGE } from '../../gql/misc'
import { UPDATE_ADS } from '../../gql/ads'

import { Box, Card, CardContent, FormControl, TextField, CardMedia, Typography, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';

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
    "image/x-icon"
];

const UpdateAds = ({ handleClose, adsAlert, ad }) => {

    const [ loading, setLoading ] = useState(false)
    const [ values, setValues ] = useState({
        image_url: '', external_url: '', title: ''
    })
    const [ errors, setErrors ] = useState({
        image_url: '', external_url: '', title: ''
    })
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ imageFile, setImageFile ] = useState(null)
    const [ imageFileUrl, setImageFileUrl ] = useState(null)
    const [ isImageChange, setIsImageChange ] = useState(false)
    const [ oldImageName, setOldImageName ] = useState(null)

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [ getImageUrl ] = useMutation(GET_IMAGE_UPLOAD_URL, {
        onError: (error) => {
            console.log('error : ', error)
        },
        onCompleted: (result) => {
            setImageFileUrl(result.getImageUploadUrl.imageUploadUrl)
            setIsImageChange(true)
            setValues({ ...values, image_url: `https://axra.sgp1.digitaloceanspaces.com/VJun/${result.getImageUploadUrl.imageName}` })
        },
    })

    const [ deleteImage ] = useMutation(DELETE_IMAGE, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
    })

    const [ updateAds ] = useMutation(UPDATE_ADS, {
        onError: (error) => {
            console.log('error : ', error)
            setLoading(false)
        },
        onCompleted: () => {
            setValues({ image_url: '', external_url: '', title: ''})
            setErrors({ image_url: '', external_url: '', title: ''})
            setImageFile('')
            setImagePreview('')
            setLoading(false)
            adsAlert('The Ads have been updated.')
            handleClose()
        },
    })

    useEffect(() => {
        setValues({ external_url: ad.external_url, image_url: ad.image_url, title: ad.title })
        setImagePreview(ad.image_url)
        let image_url = ad.image_url
        setOldImageName(image_url.substring(image_url.lastIndexOf('/') + 1,image_url.lenght ))
    }, [ad.external_url, ad.image_url, ad.title])

    const imageChange = async (e) => {
        if(e.target.files && e.target.files[0]) {
            let img = e.target.files[0]
            if(!fileTypes.includes(img.type)) {
                setErrors({ ...errors, image_url: 'Please select image. (PNG, JPG, JPEG, GIF, ...)' })
                return
            }
            if(img.size > 10485760 ) {
                setErrors({ ...errors, image_url: 'Image file size must be smaller than 10MB.' })
                return
            }
            setImageFile(img)
            setImagePreview(URL.createObjectURL(img))
            getImageUrl()
        }
    }

    const handleCreate = async () => {
        setLoading(true)
        setErrors({ image_url: '', external_url: '', })
        let isErrorExit = false
        let errorObject = {}
        if(!values.image_url) {
            errorObject.image_url = 'Image field is required.'
            isErrorExit = true
        }
        if(!values.external_url) {
            errorObject.external_url = 'External URL field is required.'
            isErrorExit = true
        }
        if(isErrorExit) {
            setErrors({ ...errorObject })
            setLoading(false)
            return
        }
        try {
            if(isImageChange) {
                await imageService.uploadImage(imageFileUrl, imageFile)
                deleteImage({ variables: { image_name: oldImageName } })
            }
            updateAds({variables: { ...values, id: ad.id }})
        } catch (error) {
            console.log('error : ', error)
        }
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                <Typography variant='h4' component='h2' sx= {{ m: 3 }} >Update Ads</Typography>
                <Button onClick={handleClose} variant="outlined" sx={{ height: 50 }}>Close</Button>
            </Box>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', }}>
                <Box sx={{ display: 'inline-flex', flexDirection: 'column', flex: 1, my: 5, mx: 2 }}>
                    <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Product"
                        sx={{flex: 1, bgcolor: '#cecece', maxHeight: 300, objectFit: 'contain' }}
                    />
                    <Typography variant="span" component="div" >1024 * 1024 recommended</Typography>
                </Box>
                <CardContent sx={{flex: 3}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}} >
                        <FormControl sx={{ m: 2 }}>
                            <TextField id="image" placeholder="Upload image" InputLabelProps={{ shrink: true }} label="Upload Image"
                                onChange={imageChange}
                                error={errors.image_url? true: false}
                                helperText={errors.image_url}
                                type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml"
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="title" label="Title"
                                value={values.title}
                                onChange={handleChange('title')}
                                error={errors.title? true: false}
                                helperText={errors.title}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <TextField id="external_url" label="External URL"
                                value={values.external_url}
                                onChange={handleChange('external_url')}
                                error={errors.external_url? true: false}
                                helperText={errors.external_url}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 2 }} variant="outlined">
                            <LoadingButton
                                variant="contained"
                                loading={loading}
                                onClick={handleCreate}
                                sx={{ backgroundColor: '#4b26d1', alignSelf: 'end' }}
                            >
                                Update
                            </LoadingButton>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdateAds