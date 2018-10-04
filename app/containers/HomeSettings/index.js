// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { goBack as goBackToWallet } from 'react-router-redux';
import styled, { withTheme } from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
import AddCircle from '@material-ui/icons/AddCircle';
import Check from '@material-ui/icons/Check';
import { ms } from '../../styles/helpers';
import { H2 } from '../../components/Heading/';
import AddNodeModal from '../../components/AddNodeModal/';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';
import CustomSelect from '../../components/CustomSelect/';
import LanguageSelector from '../../components/LanguageSelector/';
import { wrapComponent } from '../../utils/i18n';

import { syncWallet } from '../../reduxContent/wallet/thunks';
import {
  setSelected,
  removeNode,
  setLocale
} from '../../reduxContent/settings/thunks';

import {
  getConseilSelectedNode,
  getConseilNodes,
  getTezosSelectedNode,
  getTezosNodes,
  getLocale
} from '../../reduxContent/settings/selectors';

type Props = {
  conseilSelectedNode: string,
  conseilNodes: array,
  tezosSelectedNode: string,
  tezosNodes: array,
  syncWallet: () => {},
  setSelected: () => {},
  goBack: () => {},
  theme: object,
  t: () => {},
  locale: string,
  setLocale: () => {}
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
  background-color: ${({ theme: { colors } }) => colors.white};
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
  margin-top: ${ms(2)};
`;

const SelectOption = styled(Row)`
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
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.blue1 : colors.primary};
  margin-left: 5px;
`;

const NodeName = styled.div`
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.7;
`;

const NodeUrl = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5;
`;

const NodeUrlSpan = styled(NodeUrl)`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.5;
  display: inline;
`;

const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary};
    }
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    background-color: ${({ type, theme: { colors } }) =>
      type === 'addmore' ? colors.gray1 : colors.white};
  }
`;

class SettingsPage extends Component<Props> {
  props: Props;

  state = {
    type: '',
    isModalOpen: false
  };

  selectedItem = {
    value: null,
    url: null
  };

  handleConseilChange = newValue => this.props.setSelected(newValue, CONSEIL);

  handleTezosChange = newValue => this.props.setSelected(newValue, TEZOS);

  openAddNodeModal = type => this.setState({ type, isModalOpen: true });

  closeAddNodeModal = () => this.setState({ type: '', isModalOpen: false });

  getNodeUrl = (nodes, selectedNode) => {
    let url = '';
    const findedNode = nodes.find(node => {
      const name = node.get('name');
      return name === selectedNode;
    });
    if (findedNode) {
      url = findedNode.get('url');
    }
    return url;
  };

  renderNodes(nodes, selectedNode) {
    const { theme } = this.props;
    return nodes.map((node, index) => {
      const name = node.get('name');
      const url = node.get('url');
      const selected = selectedNode === name;
      const option = (
        <SelectOption>
          <OptionStatus>
            {selected ? (
              <Check
                style={{
                  fill: theme.colors.blue1,
                  height: ms(1.5),
                  width: ms(1.5)
                }}
              />
            ) : null}
          </OptionStatus>
          <OptionLabel isActive={selected}>
            <NodeName>{name}</NodeName>
            <NodeUrl>{url}</NodeUrl>
          </OptionLabel>
        </SelectOption>
      );
      return (
        <ItemWrapper key={index} url={url} value={name}>
          {option}
        </ItemWrapper>
      );
    });
  }

  render() {
    const {
      syncWallet,
      goBack,
      conseilSelectedNode,
      conseilNodes,
      tezosSelectedNode,
      tezosNodes,
      t,
      locale,
      setLocale
    } = this.props;

    const { type, isModalOpen } = this.state;

    return (
      <Container>
        <BackToWallet
          onClick={() => {
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
          <span>{t('containers.homeSettings.back_to_wallet')}</span>
        </BackToWallet>
        <H2>{t('containers.homeSettings.wallet_settings')}</H2>
        <Content>
          <RowForParts>
            <Part>
              <LanguageSelector locale={locale} setLocale={setLocale} />
            </Part>
            <Part>
              <CustomSelect
                label="Conseil Nodes"
                value={conseilSelectedNode}
                onChange={event => {
                  const newValue = event.target.value;
                  if (newValue !== 'add-more') {
                    this.handleConseilChange(newValue);
                    return true;
                  }
                  this.openAddNodeModal(CONSEIL);
                }}
                renderValue={value => {
                  const url = this.getNodeUrl(conseilNodes, value);
                  return (
                    <div>
                      <span>{value} </span>
                      <NodeUrlSpan>({url})</NodeUrlSpan>
                    </div>
                  );
                }}
              >
                {this.renderNodes(conseilNodes, conseilSelectedNode)}
                <ItemWrapper value="add-more" type="addmore">
                  <AddCircle
                    style={{
                      fill: '#7B91C0',
                      height: ms(1),
                      width: ms(1),
                      marginRight: '10px'
                    }}
                  />
                  {t('containers.homeSettings.add_custom_node')}
                </ItemWrapper>
              </CustomSelect>
            </Part>
            <Part>
              <CustomSelect
                label="Tezos Nodes"
                value={tezosSelectedNode}
                onChange={event => {
                  const newValue = event.target.value;
                  if (newValue !== 'add-more') {
                    this.handleTezosChange(newValue);
                    return true;
                  }
                  this.openAddNodeModal(TEZOS);
                }}
                renderValue={value => {
                  const url = this.getNodeUrl(tezosNodes, value);
                  return (
                    <div>
                      <span>{value} </span>
                      <NodeUrlSpan>({url})</NodeUrlSpan>
                    </div>
                  );
                }}
              >
                {this.renderNodes(tezosNodes, tezosSelectedNode)}
                <ItemWrapper value="add-more" type="addmore">
                  <AddCircle
                    style={{
                      fill: '#7B91C0',
                      height: ms(1),
                      width: ms(1),
                      marginRight: '10px'
                    }}
                  />
                  {t('containers.homeSettings.add_custom_node')}
                </ItemWrapper>
              </CustomSelect>
            </Part>
          </RowForParts>
        </Content>

        <AddNodeModal
          isModalOpen={isModalOpen}
          type={type}
          closeAddNodeModal={this.closeAddNodeModal}
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
    tezosNodes: getTezosNodes(state),
    locale: getLocale(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      syncWallet,
      setSelected,
      removeNode,
      goBack: () => dispatch => dispatch(goBackToWallet()),
      setLocale
    },
    dispatch
  );
}

export default compose(
  wrapComponent,
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SettingsPage);
