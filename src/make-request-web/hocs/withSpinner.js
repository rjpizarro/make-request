import React from 'react';
import {
    branch,
    compose,
    renderComponent,
} from 'recompose';

import Spinner from 'react-spinkit';

const Loader = () => (<Spinner name="folding-cube" fadeIn="half" />);
const isLoading = (props) => props.serviceIsLoading;

// hocs
import withServiceIsLoading from '../../common/hocs/withServiceIsLoading';

export default (SpinnerComponent = Loader) =>
    compose(
        withServiceIsLoading(),
        branch(
          isLoading,
          renderComponent(SpinnerComponent)
        ),
    );