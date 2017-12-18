import React from 'react';
import { connect } from 'react-redux';
import { Translate } from 'react-redux-i18n';
import { Grid, Row, Col } from 'react-bootstrap';
import get from 'lodash/get';

// https://en.wikipedia.org/wiki/Video_file_format
/*
const videoExtensions = [
  'webm',
  'mkv',
  'flv',
  'vob',
  'ogv',
  'ogg',
  'drc',
  'gif',
  'gifv',
  'mng',
  'avi',
  'mov',
  'qt',
  'wmv',
  'yuv',
  'rm',
  'rmvb',
  'asf',
  'amv',
  'mp4',
  'm4p',
  'm4v',
  'mpg',
  'mp2',
  'mpeg',
  'mpe',
  'mpv',
  'mpg',
  'mpeg',
  'm2v',
  'm4v',
  'svi',
  '3gp',
  '3g2',
  'mxf',
  'roq',
  'nsv',
  'f4v',
  'f4p',
  'f4a',
  'f4b'
];
*/

const videoTypes = {
  mp4: 'video/mp4; codecs="avc1.4D401E, mp4a.40.2',
  m4v: 'video/mp4; codecs="avc1.4D401E, mp4a.40.2',
  webm: 'video/webm'
  // TODO: complete
};

export const VideoTypeGuesser = {
  guessVideoType: (src) => {
    const components = src.split('.');
    const extension = components[components.length - 1];
    return videoTypes[extension];
  }
};

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTextHigher: false
    };
  }

  componentWillReceiveProps() {
    const { debateData } = this.props.debate;
    const videoTxt = document.getElementById('video-txt');
    const video = document.getElementById('video-vid');
    if (debateData.videoUrl && videoTxt) {
      const textHeight = videoTxt.clientHeight;
      const videoHeight = video.clientHeight;
      if (textHeight > videoHeight + 5) this.setState({ isTextHigher: true });
    }
  }

  render() {
    const { debateData } = this.props.debate;
    const { locale } = this.props.i18n;
    const videoUrl = get(debateData, 'video.videoUrl', '');
    const posterUrl = get(debateData, 'video.posterUrl', '');
    const videoType = VideoTypeGuesser.guessVideoType(videoUrl);
    const posterProps = {};
    if (posterUrl) posterProps.poster = posterUrl;
    return (
      <section className="home-section video-section">
        <Grid fluid>
          <div className="max-container">
            <div className="title-section">
              <div className="title-hyphen">&nbsp;</div>
              <h1 className="dark-title-1">
                {debateData.video.titleEntries ? debateData.video.titleEntries[locale] : <Translate value="home.video" />}
              </h1>
            </div>
            <div className="content-section">
              <div className="content-margin">
                <Row>
                  {debateData.video.descriptionEntriesTop && (
                    <Col xs={12} md={6} className={this.state.isTextHigher ? 'col-bottom' : ''}>
                      <div className="text" id="video-txt">
                        {debateData.video.descriptionEntriesTop[locale]}
                      </div>
                    </Col>
                  )}
                  {videoUrl && (
                    <Col xs={12} md={6} className={this.state.isTextHigher ? 'col-bottom' : ''}>
                      <div className="video-container" id="video-vid">
                        {videoType ? (
                          /* eslint-disable jsx-a11y/media-has-caption */
                          <video controls preload="none" {...posterProps}>
                            <source src={videoUrl} type={videoType} />
                          </video>
                        ) : (
                          /* eslint-enable jsx-a11y/media-has-caption */
                          <iframe src={debateData.video.videoUrl} frameBorder="0" width="560" height="315" title="video" />
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          </div>
        </Grid>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  debate: state.debate,
  i18n: state.i18n
});

export default connect(mapStateToProps)(Video);