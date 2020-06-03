import React, {
  useState, useEffect,
} from 'react';
import Button from '/imports/ui/components/button/component';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { styles } from './styles';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';

import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';
// import VideoService from '../video-provider/service';
import VideoService from '../service';
// import ViewServices from '../../video-preview/service';

// const CAMERA_PROFILES = Meteor.settings.public.kurento.cameraProfiles;
function ToggleVideoButton({ isSharingVideo }) {
  // const isSharingVideo = props.isSharingVideo;
  // const handleCloseVideo = props.handleCloseVideo;
  // const handleJoinVideo = props.handleJoinVideo;


  const [Cams, setCams] = useState(null);
  useEffect(() => {
    console.error('use effect component load');
    async function getCams() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.table(videoDevices);
      setCams(videoDevices);
    }
    getCams();
  }, []);


  return (
    <Dropdown>
      <DropdownTrigger tabIndex={0} accessKey={null}>
        <Button
          label="Toggle Camera"
          className={cx(styles.button, styles.btn)}
          onClick={null}
          hideLabel
          aria-label="Toggle Webcams"
          color="primary"
          icon="refresh"
          ghost={!isSharingVideo}
          size="lg"
          circle
          disabled={false}
        />
      </DropdownTrigger>

      {
        Cams === null ? (
          <DropdownContent placement="top left">
            <DropdownListItem
              icon="presentation"
              label="Loading..."
              description="desc"
              onClick={() => console.error('cheers it is clicked')}
            />
          </DropdownContent>
        ) : (
          <DropdownContent placement="top left">
            {Cams.map(cam => (
              <DropdownListItem
                icon="presentation"
                label={cam.label}
                key={cam.deviceId}
                value={cam.deviceId}
                description="desc"
                onClick={() => {
                  VideoService.exitVideo();
                  // ViewServices.changeWebcam(cam.deviceId)
                  // VideoService.joinVideo();


                  console.error('handle click completed');
                }}
              />
            ))}
          </DropdownContent>
        )


      }

    </Dropdown>
  );
}

ToggleVideoButton.protoTypes = {
  isSharingVideo: PropTypes.bool.isRequired,
  handleCloseVideo: PropTypes.func.isRequired,
  handleJoinVideo: PropTypes.func.isRequired,
};
export default ToggleVideoButton;
