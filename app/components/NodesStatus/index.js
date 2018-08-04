/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getNodesStatus } from '../../reduxContent/wallet/selectors';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';

import { getNodesError } from '../../utils/general';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${ms(-1)} ${ms(3)};
  background-color: ${({ theme: { colors } }) =>
    colors.error1 };
  color: ${({ theme: { colors } }) =>
    colors.white };
  font-size: ${ms(-0.5)};
`;

const WarningIcon = styled(TezosIcon)`
  font-size: ${ms(0.5)};
  margin-right: ${ms(-1.5)};
`;

type Props = {
  nodesStatus: object
};

function NodesStatus(props: Props) {
  const { nodesStatus } = props;
  const nodesErrorMessage = getNodesError(nodesStatus.toJS());
  
  return nodesErrorMessage
    ?
    (
      <Container>
        <WarningIcon color="white" iconName="warning" />
        <span>
          { nodesErrorMessage }
        </span>
      </Container>
    )
    : null;
}

function mapStateToProps(state) {
  return {
    nodesStatus: getNodesStatus(state)
  };
}

export default connect(mapStateToProps)(NodesStatus);
