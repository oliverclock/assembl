import React from 'react';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

import Header from '../components/home/header';
import Objectives from '../components/home/objectives';
import Phases from '../components/home/phases';
import Video from '../components/home/video';
import Twitter from '../components/home/twitter';
import Chatbot from '../components/home/chatbot';
import Partners from '../components/home/partners';
import ScrollOnePageButton from '../components/common/scrollOnePageButton';
import MessagePage from '../components/common/messagePage';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      scrollOnePageButtonHidden: false
    };
    this.hideScrollOnePageButton = this.hideScrollOnePageButton.bind(this);
  }

  componentWillMount() {
    window.addEventListener('scroll', this.hideScrollOnePageButton);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.hideScrollOnePageButton);
  }

  hideScrollOnePageButton() {
    this.setState({
      scrollOnePageButtonHidden: true
    });
  }

  render() {
    const { debateData } = this.props.debate;
    const { locale } = this.props.i18n;
    if (!debateData.timeline || debateData.timeline.length === 0) {
      return <MessagePage title={I18n.t('home.assemblNotConfigured')} text={I18n.t('administration.noTimeline')} />;
    }

    return (
      <div className="home">
        <Header />
        <ScrollOnePageButton hidden={this.state.scrollOnePageButtonHidden} />
        {debateData.objectives && <Objectives />}
        {debateData.timeline && <Phases />}
        {debateData.video && <Video />}
        {debateData.twitter && <Twitter />}
        {debateData.chatbot && <Chatbot chatbot={debateData.chatbot} locale={locale} />}
        {debateData.partners && <Partners />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  debate: state.debate,
  i18n: state.i18n
});

export default connect(mapStateToProps)(Home);