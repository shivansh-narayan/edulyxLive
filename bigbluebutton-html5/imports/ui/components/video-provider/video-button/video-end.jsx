import React, { memo, Fragment } from 'react';
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
  isDisabled: PropTypes.bool.isRequired,
  handleCloseVideo: PropTypes.func.isRequired,
};

const ToggleVideoButton = ({
  intl,
  isSharingVideo,
  isDisabled,
  handleCloseVideo,

}) => {
  const sharingVideoLabel = isSharingVideo
    ? intl.formatMessage(intlMessages.leaveVideo) : intl.formatMessage(intlMessages.joinVideo);

  const disabledLabel = isDisabled
    ? intl.formatMessage(intlMessages.videoLocked) : sharingVideoLabel;


  return (
    <Fragment>
      {isSharingVideo ? (
        <Button
          label={disabledLabel}
          className={cx(styles.button, isSharingVideo || styles.btn)}
          onClick={handleCloseVideo}
          hideLabel
          aria-label={intl.formatMessage(intlMessages.videoButtonDesc)}
          color={isSharingVideo ? 'primary' : 'default'}
          icon="close"
          ghost={!isSharingVideo}
          size="lg"
          circle
          disabled={isDisabled}
        />
      ) : null}
    </Fragment>

  );
};

ToggleVideoButton.propTypes = propTypes;
export default injectIntl(memo(ToggleVideoButton));
