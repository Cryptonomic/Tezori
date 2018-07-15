// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { goBack as goBackToWallet } from 'react-router-redux';
import styled, { withTheme } from 'styled-components';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { ms } from '../../styles/helpers';
import { H2, H4 } from '../../components/Heading/';
import BackCaret from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Check from 'material-ui/svg-icons/navigation/check';
import AddNodeModal from '../../components/AddNodeModal/';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';


import { syncWallet } from '../../reduxContent/wallet/thunks';
import {
  setSelected,
  removeNode
} from '../../reduxContent/nodes/thunks';

import {
  getConseilSelectedNode,
  getConseilNodes,
  getTezosSelectedNode,
  getTezosNodes,
} from '../../reduxContent/nodes/selectors';

type Props = {
  conseilSelectedNode: string,
  conseilNodes: array,
  tezosSelectedNode: string,
  tezosNodes: array,
  syncWallet: Function,
  setSelected: Function,
  removeNode: Function,
  goBack: Function,
  theme: Object
};

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  width: 80%;
  margin: 3rem auto 0;
  padding: ${ms(3)} ${ms(4)};
`;

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 3rem;
`;

const Content = styled.div`
  background-color: ${({theme: { colors }}) => colors.white };
  padding: ${ms(3)} ${ms(3)};
  margin: ${ms(3)} auto 0 auto;
`;

const RowForParts = styled(Row)`
  margin: 0 -${ms(1)};
  display: flex;
  flex-direction: column;
`;

const Part = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  padding: 0 ${ms(1)};
  margin-top: ${ ms(2)};
`;

const AddCustomNode = styled(Row)`
  margin: 0 -24px -16px;
  padding: 5px 24px;
  background-color: #f7f9fb;
  color: ${({theme: { colors }}) => colors.primary };
  cursor: pointer;
`;

const SelectOption = styled(Row)`
  margin: 0 -24px;
  padding: 10px 0px;
`;

const OptionStatus = styled(Row)`
  flex-direction: column;
  align-items: center;
  width: 24px;
`;

const OptionLabel = styled(Row)`
  flex-direction: column;
  align-items: flex-start;
  color: ${({isActive, theme: { colors }}) =>
  isActive ? colors.blue1 : colors.primary };
`;

const NodeName = styled.div`
  font-size: 16px;
  line-height:16px;
  letter-spacing: 0.7;
`;

const NodeUrl = styled.div`
  font-size: 12px;
  line-height:16px;
  letter-spacing: 0.5;
`;

const NodeUrlSpan = styled(NodeUrl)`
  font-size: 12px;
  line-height:16px;
  letter-spacing: 0.5;
  display: inline;
`;

class SettingsPage extends Component<Props> {
  props: Props;

  state = {
    type: '',
    isModalOpen: false
  };

  handleConseilChange = (newValue) => this.props.setSelected(newValue, CONSEIL);
  handleTezosChange = (newValue) => this.props.setSelected(newValue, TEZOS);
  openAddNodeModal = (type) => this.setState({ type, isModalOpen: true });
  closeAddNodeModal = () => this.setState({ type: '', isModalOpen: false });
  
  renderNodes( nodes, selectedNode ) {
    const { theme } = this.props;
    return nodes.map( ( node, index ) => {
      const name = node.get('name');
      const url = node.get('url');
      const selected = selectedNode === name;
      const option = (
        <SelectOption>
          <OptionStatus>
            {
              selected
                ?
                (
                  <Check
                    style={{
                      fill: theme.colors.blue1,
                      height: ms(1.5),
                      width: ms(1.5)
                    }}
                  />
                )
                : null
            }
          </OptionStatus>
          <OptionLabel isActive={ selected }>
            <NodeName>{ name }</NodeName>
            <NodeUrl>{ url }</NodeUrl>
          </OptionLabel>
        </SelectOption>
      );
      return (
        <MenuItem
          style={{ marginTop: index === 0 ? '-16px ' : 0}}
          key={index}
          url={ url }
          value={ name }
          primaryText={option}
        />
      );
    });
  };

  render() {
    const {
      syncWallet,
      goBack,
      theme,
      conseilSelectedNode,
      conseilNodes,
      tezosSelectedNode,
      tezosNodes
    } = this.props;

    const { type, isModalOpen } = this.state;

    return (
      <Container>
        <BackToWallet onClick={() => {
          goBack();
          syncWallet();
        }}
        >
          <BackCaret
            style={{
              fill: '#4486f0',
              height: '28px',
              width: '28px',
              marginRight: '5px',
              marginLeft: '-9px'
            }}
          />
          <span>Back to Wallet</span>
        </BackToWallet>
        <H2>Wallet Settings</H2>
        <Content>
          <H4>Choose a Different Node</H4>
          <RowForParts>
            <Part>
              <SelectField
                floatingLabelText="Conseil Nodes"
                value={conseilSelectedNode}
                onChange={(event, index, newValue) => {
                  if( newValue !== 'add-more' ) {
                    this.handleConseilChange(newValue);
                    return true;
                  }
                  this.openAddNodeModal(CONSEIL);
                }}
                style={{ width: '100%', maxWidth: '100%', color: 'blue1' }}
                iconStyle={{ fill: 'black'  }}
                selectionRenderer={(value, context) => {
                  return (
                    <div>
                     <span>{value} </span>
                     <NodeUrlSpan>({context.props.url})</NodeUrlSpan>
                    </div>
                  );
                }}
                labelStyle={{ color: theme.colors.primary }}
              >
                { this.renderNodes(conseilNodes, conseilSelectedNode) }
                <MenuItem
                  style={{ margin: '0' }}
                  value="add-more"
                  primaryText={
                    <AddCustomNode >
                      <AddCircle
                        style={{
                          fill: '#7B91C0',
                          height: ms(1),
                          width: ms(1),
                          marginRight: '10px'
                        }}
                      />
                      Add a Custom Node
                    </AddCustomNode>
                  }
                />
              </SelectField>
            </Part>
            <Part>
              <SelectField
                floatingLabelText="Tezos Nodes"
                value={tezosSelectedNode}
                onChange={(event, index, newValue) => {
                  if( newValue !== 'add-more' ) {
                    this.handleTezosChange(newValue);
                    return true;
                  }
                  this.openAddNodeModal(TEZOS);
                }}
                style={{ width: '100%', maxWidth: '100%', color: 'blue1' }}
                labelStyle={{ color: theme.colors.primary }}
                iconStyle={{ fill: 'black'  }}
                selectionRenderer={(value, context) => {
                  return (
                    <div>
                     <span>{value} </span>
                     <NodeUrlSpan>({ context.props.url })</NodeUrlSpan>
                    </div>
                  );
                }}
              >
                { this.renderNodes(tezosNodes, tezosSelectedNode) }
                <MenuItem
                  style={{ margin: '0px' }}
                  value="add-more"
                  primaryText={
                    <AddCustomNode >
                      <AddCircle
                        style={{
                          fill: '#7B91C0',
                          height: ms(1),
                          width: ms(1),
                          marginRight: '10px'
                        }}
                      />
                      Add a Custom Node
                    </AddCustomNode>
                  }
                />
              </SelectField>
            </Part>
          </RowForParts>
        </Content>

        <AddNodeModal
          isModalOpen={ isModalOpen }
          type={ type }
          closeAddNodeModal={ this.closeAddNodeModal }
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    conseilSelectedNode: getConseilSelectedNode(state),
    conseilNodes: getConseilNodes(state),
    tezosSelectedNode: getTezosSelectedNode(state),
    tezosNodes: getTezosNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      syncWallet,
      setSelected,
      removeNode,
      goBack: () => dispatch => dispatch(goBackToWallet())
    },
    dispatch
  );
}

export default compose(
  withTheme,
  connect(mapStateToProps, mapDispatchToProps)
)(SettingsPage);
