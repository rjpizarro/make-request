import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, setPropTypes, withProps } from 'recompose';
import {
    serviceIsLoading,
    getIsLoadingData,
} from '../selectors';

// hocs
import _omitProps from './_omitProps';

const mapStateToProps = (state, props) => {
    const isLoading = {
        serviceIsLoading: serviceIsLoading(state),
        ...getIsLoadingData(state),
    };

    return {
        [props.getLoadingProp]: isLoading[props.getLoadingProp]
    }
};

export default (getLoadingProp = 'serviceIsLoading') =>
    compose(
        withProps( props => ({
            getLoadingProp: getLoadingProp,
        })),
        connect(mapStateToProps),
        _omitProps(['getLoadingProp']),
    )