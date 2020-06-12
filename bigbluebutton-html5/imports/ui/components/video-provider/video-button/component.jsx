import React, { memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';

const intlMessages = defineMessages({
  joinVideo: {
    id: 'app.video.joinVideo',
    description: 'Join video button label',
  },
  leaveVideo: {
    id: 'app.video.leaveVideo',
    description: 'Leave video button label',
  },
  videoButtonDesc: {
    id: 'app.video.videoButtonDesc',
    description: 'video button description',
  },
  videoLocked: {
    id: 'app.video.videoLocked',
    description: 'video disabled label',
  },
  iOSWarning: {
    id: 'app.iOSWarning.label',
    description: 'message indicating to upgrade ios version',
  },
});

const propTypes = {
  intl: intlShape.isRequired,
  isSharingVideo: PropTypes.bool.isRequired,

  handleJoinVideo: PropTypes.func.isRequired,

};

const JoinVideoButton = ({
  intl,
  isSharingVideo,
  handleJoinVideo,
  notify,
  validIOSVersion,
}) => {
  const verifyIOS = () => {
    // handleCloseVideo();
    if (!validIOSVersion()) {
      return notify(
        intl.formatMessage(intlMessages.iOSWarning),
        'error',
        'warning',
      );
    }
    handleJoinVideo();
    return true;
  };


  return (
    <div>
      <Button

        className={cx(styles.button, isSharingVideo || styles.btn)}
        onClick={verifyIOS}
        hideLabel
        aria-label={isSharingVideo ? 'Swap Camera' : 'Start Video'}
        color="primary"
        icon={isSharingVideo ? 'refresh' : 'video'}
     // ghost={!isSharingVideo}
        size="lg"
        circle
      />
    </div>
  );
};

JoinVideoButton.propTypes = propTypes;
export default injectIntl(memo(JoinVideoButton));
