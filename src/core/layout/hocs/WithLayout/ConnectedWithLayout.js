import { connect } from 'react-redux';
import { getCalculatedLayout } from '../../selectors';
import WithLayout from './WithLayout';

const mapStateToProps = (state, props) => {
  return {
    layout: getCalculatedLayout(state, props),
  }
}

export default (Component) => connect(
  mapStateToProps,
)(WithLayout(Component));