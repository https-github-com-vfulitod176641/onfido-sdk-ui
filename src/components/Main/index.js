import { h, Component } from 'preact'
import classNames from 'classnames'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StepsRoot } from '../Steps'
import theme from '../Theme/style.css'
import { unboundActions } from '../../core'
import { initializeI18n } from '../../locales'
import CaptureJourney from './CaptureJourney'

class Main extends Component {

  state = {
    isFullScreen: false,
  }

  useFullScreen = isFullScreen => this.setState({ isFullScreen })

  handleComplete = () => {
    const faceCapture = this.props.captures.face[0]
    const variant = faceCapture && faceCapture.variant
    const data = variant ? {face: {variant}} : {}
    this.props.options.events.emit('complete', data)
  }

  render() {
    const { options, ...props } = this.props
    const moreProps = {
      allowCrossDeviceFlow: !options.mobileFlow,
      i18n: initializeI18n(options.language),
      useFullScreen: this.useFullScreen,
      trackScreen: () => {} /* @todo */
    }

    return (
      <StepsRoot
        name="steps"
        wrapStep={ container => (
          <div className={classNames(theme.step, {[theme.fullScreenStep]: false /* @todo */ })}>
            <div className={classNames(theme.content, {
              [theme.fullScreenContentWrapper]: false /* @todo */
            })}>
              {container}
            </div>
            <div className={theme.footer} />
          </div>
        )}
      >
        <CaptureJourney {...options} {...props} {...moreProps} />
      </StepsRoot>
    )
  }
}

function mapStateToProps(state) {
  return {...state.globals, captures: state.captures}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(unboundActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)