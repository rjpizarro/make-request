import { mapProps } from 'recompose';
import _omit from 'lodash/omit';

export default keys => mapProps(props => _omit(props, keys))
