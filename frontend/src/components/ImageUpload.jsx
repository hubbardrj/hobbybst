import React, { useState, useRef, useCallback } from 'react'
import { 
    Box, 
    Button, 
    Divider,
    Slider, 
    Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import LabeledOutline from './LabeledOutline';
import Cropper from 'react-easy-crop';
import clsx from 'clsx';
import getCroppedImg from '../utils/cropImage';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: 400
    },
    container: {
        height: 350
    },
    preview: {
        maxWidth:'100%',
        maxHeight:'100%',
    },
    hidden: {
        display:"none"
    },
    imageControls: {
        "& label": {
            marginRight:'5px'
        }
        
    },
    cropperControls: {
        padding: 16,
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    sliderContainer: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        padding: '0 5px',
      },
    sliderLabel: {
        padding: '0 10px',
        [theme.breakpoints.down('xs')]: {
            minWidth: 65,
        },
    },
    slider: {
        padding: '22px 0px',
        marginLeft: 16,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            margin: '0 16px',
        },
    }
  }));
  
const ImageUpload = ({value, setImageUrl, ...props}) => {
    const inputEl = useRef(null);
    const [showPicker, setShowPicker] = useState(true);
    const [cropperEnabled, setCropperEnabled] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, []);

    const classes = useStyles();

    const showCroppedImage = useCallback(async () => {
        try {
            console.log('being crop');
          const croppedImage = await getCroppedImg(
            value,
            croppedAreaPixels,
            rotation
          )
          console.log('end crop');
          setImageUrl(croppedImage);
          setCropperEnabled(false);
        } catch (e) {
          console.error(e)
        }
      }, [croppedAreaPixels, rotation, value, setImageUrl]);

    const onImageChange = useCallback((event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
            setShowPicker(false);
        }
     },[setImageUrl]);

    const toggleCropper = () => {
        setCropperEnabled(!cropperEnabled);
    }
    const toggleHover = (val) => {
        setShowPicker(val);
    }
    const removeImage = () => {
        setImageUrl(null);
    }
    return (
        <Box
            className={classes.root}
            display="flex"
            justifyContent="center"
            alignItems="center"
            >
            <LabeledOutline label={props.label} className={classes.root}>
            <Box>
                <Box
                    className={classes.container}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                    onMouseEnter={()=>toggleHover(true)}
                    onMouseLeave={()=>toggleHover(false)}>
                    
                    <img 
                        src={value} 
                        className={clsx([classes.preview], {[classes.hidden]: cropperEnabled})} 
                        alt=''
                    />
                    { cropperEnabled && <Cropper
                        image={value}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onRotationChange={setRotation}
                        onZoomChange={setZoom}
                    />}
                    <Button
                        className={clsx("btn-choose", {[classes.hidden]: (value && !showPicker) || cropperEnabled})}
                        component="label" 
                        color="primary"
                        variant="contained"
                        style={{position:"absolute"}}
                    >
                        { value ? 'Change Photo' : 'Choose Photo' }
                        <input
                        id="btn-upload"
                        name="btn-upload"
                        accept="image/*"
                        type="file"
                        onChange={(e)=>onImageChange(e)}
                        hidden
                        ref={inputEl} />
                    </Button>
                </Box>
                <Divider />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                    p={1}
                    className={clsx([classes.imageControls], {[classes.hidden]: !value || cropperEnabled})}
                    >
                    <Button
                        variant="outlined"
                        component="label"
                        onClick={toggleCropper}
                    >
                        Edit Photo
                    </Button>
                    <Button
                        variant="outlined"
                        component="label" 
                        onClick={removeImage}
                    >
                        Remove Photo
                    </Button>
                </Box>
                <Box
                    display="flex"
                    flex="1"
                    justifyContent="center"
                    alignItems="stretch"
                    position="relative"
                    p={1}
                    className={clsx([classes.cropperControls], {[classes.hidden]: !cropperEnabled})}
                    >
                        <div className={classes.sliderContainer}>
                            <Typography
                                variant="overline"
                                classes={{ root: classes.sliderLabel }}
                            >
                                Zoom
                            </Typography>
                            <Slider
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => setZoom(zoom)}
                            />
                        </div>
                        <div className={classes.sliderContainer}>
                            <Typography
                                variant="overline"
                                classes={{ root: classes.sliderLabel }}
                            >
                                Rotation
                            </Typography>
                            <Slider
                                value={rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={(e, rotation) => setRotation(rotation)}
                            />
                        </div>
                        <Button
                            onClick={showCroppedImage}
                            variant="contained"
                            color="primary"
                            classes={{ root: classes.cropButton }}
                        >
                            Save
                    </Button>
                </Box>
            </Box>
        </LabeledOutline>
        </Box>
    )
}
export default React.memo(ImageUpload);