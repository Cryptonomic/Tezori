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
import Close from '@material-ui/icons/Close';
import { ms } from '../../styles/helpers';
import { H2 } from '../../components/Heading/';
import AddNodeModal from '../../components/AddNodeModal/';
import AddPathModal from '../../components/AddPathModal/';
import { TEZOS, CONSEIL } from '../../constants/NodesTypes';
import CustomSelect from '../../components/CustomSelect/';
import LanguageSelector from '../../components/LanguageSelector/';
import { wrapComponent } from '../../utils/i18n';

import {
  syncWallet,
  goHomeAndClearState
} from '../../reduxContent/wallet/thunks';
import {
  removePath,
  setSelected,
  removeNode,
  setLocale,
  setPath
} from '../../reduxContent/settings/thunks';

import {
  getConseilSelectedNode,
  getConseilNodes,
  getTezosSelectedNode,
  getTezosNodes,
  getSelectedPath,
  getPathsList,
  getLocale
} from '../../reduxContent/settings/selectors';

type Props = {
  conseilSelectedNode: string,
  conseilNodes: array,
  tezosSelectedNode: string,
  tezosNodes: array,
  selectedPath: string,
  pathsList: array,
  syncWallet: () => {},
  setSelected: () => {},
  setPath: () => {},
  removeNode: () => {},
  removePath: () => {},
  goBack: () => {},
  theme: object,
  t: () => {},
  locale: string,
  setLocale: () => {},
  goHomeAndClearState: () => {}
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
  margin-bottom: 2.5rem;
`;

const Content = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  padding: 50px 47px 63px 55px;
  margin-top: 35px;
`;

const Content6 = styled(Content)`
  margin-top: 6px;
`;

const ContentTitle = styled.div`
  font-size: 24px;
  font-weight: 300;
  line-height: 34px;
  color: ${({ theme: { colors } }) => colors.primary};
  letter-spacing: 1px;
  margin-bottom: 32px;
`;

const RowForParts = styled(Row)`
  justify-content: space-between;
`;

const Part = styled.div`
  width: 48%;
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

const SelectRenderWrapper = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RemoveIconWrapper = styled.span`
  margin-right: 30px;
  margin-left: auto;
`;

const RemoveIcon = styled(Close)`
  color: #d3d3d3;
  &:hover {
    color: ${({ theme: { colors } }) => colors.accent};
  }
`;

class SettingsPage extends Component<Props> {
  props: Props;

  state = {
    type: '',
    isNodeModalOpen: false,
    isPathModalOpen: false,
    isPathChanged: false
  };

  selectedItem = {
    value: null,
    url: null
  };

  removePath = async (event, label) => {
    event.stopPropagation();
    const { removePath, selectedPath, pathsList } = this.props;
    const labelToRemove = pathsList.find(path => path.get('label') === label);
    if (labelToRemove) {
      await removePath(label);
      if (label === selectedPath) {
        if (pathsList.size > 2) {
          const parser = JSON.parse(localStorage.settings);
          const listLength = parser.pathsList.length;
          const labelToAdd = parser.pathsList[listLength - 1].label;
          this.handlePathChange(labelToAdd);
        } else {
          await this.handlePathChange('Default');
        }
      }
    }
  };

  removeNodeOption = async (event, name) => {
    event.stopPropagation();
    const { removeNode, tezosNodes, conseilNodes } = this.props;
    const conseilNodeToRemove = conseilNodes.find(
      node => node.get('name') === name
    );
    const tezosNodeToRemove = tezosNodes.find(
      node => node.get('name') === name
    );
    const localStorageSettings = JSON.parse(localStorage.settings);
    if (conseilNodeToRemove) {
      await removeNode(name);
      if (name === localStorageSettings.conseilSelectedNode) {
        await this.handleConseilChange('Cryptonomic-Conseil');
      }
    }
    if (tezosNodeToRemove) {
      await removeNode(name);
      if (name === localStorageSettings.tezosSelectedNode) {
        await this.handleTezosChange('Cryptonomic-Nautilus');
      }
    }
  };

  handleConseilChange = newValue => this.props.setSelected(newValue, CONSEIL);

  handleTezosChange = newValue => this.props.setSelected(newValue, TEZOS);

  handlePathChange = newValue => this.props.setPath(newValue);

  openAddNodeModal = type => this.setState({ type, isNodeModalOpen: true });

  closeAddNodeModal = () => this.setState({ type: '', isNodeModalOpen: false });

  openAddPathModal = () => this.setState({ isPathModalOpen: true });

  closeAddPathModal = () => this.setState({ isPathModalOpen: false });

  onChangedDerivationPath = () => this.setState({ isPathChanged: true });

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

  getPath = (pathsList, selectedPath) => {
    let path = '';
    const foundPath = pathsList.find(path => {
      const label = path.get('label');
      return label === selectedPath;
    });
    if (foundPath) {
      path = foundPath.get('derivation');
    }
    return path;
  };

  renderNodes = (nodes, selectedNode) => {
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
          {name !== 'Cryptonomic-Conseil' && name !== 'Cryptonomic-Nautilus' && (
            <RemoveIconWrapper
              onClick={event => this.removeNodeOption(event, name)}
            >
              <RemoveIcon />
            </RemoveIconWrapper>
          )}
        </ItemWrapper>
      );
    });
  };

  renderPaths = (paths, selectedPath) => {
    const { theme } = this.props;
    return paths.map((path, index) => {
      const label = path.get('label');
      const derivation = path.get('derivation');
      const selected = selectedPath === label;
      const option = (
        <SelectOption>
          {selected && (
            <OptionStatus>
              <Check
                style={{
                  fill: theme.colors.blue1,
                  height: ms(1.5),
                  width: ms(1.5)
                }}
              />
            </OptionStatus>
          )}
          <OptionLabel isActive={selected}>
            <NodeName>{label}</NodeName>
            <NodeUrl>{derivation}</NodeUrl>{' '}
          </OptionLabel>
        </SelectOption>
      );
      return (
        <ItemWrapper key={index} url={derivation} value={label}>
          {option}
          {label !== 'Default' && (
            <RemoveIconWrapper onClick={event => this.removePath(event, label)}>
              <RemoveIcon />
            </RemoveIconWrapper>
          )}
        </ItemWrapper>
      );
    });
  };

  render() {
    const {
      syncWallet,
      goBack,
      conseilSelectedNode,
      conseilNodes,
      tezosSelectedNode,
      tezosNodes,
      selectedPath,
      pathsList,
      locale,
      setLocale,
      goHomeAndClearState,
      t
    } = this.props;

    const {
      type,
      isNodeModalOpen,
      isPathModalOpen,
      isPathChanged
    } = this.state;

    return (
      <Container>
        <BackToWallet
          onClick={() => {
            if (isPathChanged) {
              goHomeAndClearState();
            } else {
              goBack();
              syncWallet();
            }
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
          <span>
            {isPathChanged
              ? t('containers.homeSettings.back_to_login')
              : t('containers.homeSettings.back_to_wallet')}
          </span>
        </BackToWallet>
        <H2>{t('containers.homeSettings.general_settings')}</H2>

        <Content6>
          <ContentTitle>
            {t('containers.homeSettings.select_display_language')}
          </ContentTitle>
          <RowForParts>
            <Part>
              <LanguageSelector locale={locale} setLocale={setLocale} />
            </Part>
          </RowForParts>
        </Content6>

        <Content>
          <ContentTitle>
            {t('containers.homeSettings.choose_different_node')}
          </ContentTitle>
          <RowForParts>
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
                    <SelectRenderWrapper>
                      <span>{value} </span>
                      <NodeUrlSpan>({url})</NodeUrlSpan>
                    </SelectRenderWrapper>
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
                    <SelectRenderWrapper>
                      <span>{value} </span>
                      <NodeUrlSpan>({url})</NodeUrlSpan>
                    </SelectRenderWrapper>
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
          isNodeModalOpen={isNodeModalOpen}
          type={type}
          closeAddNodeModal={this.closeAddNodeModal}
        />

        <H2 style={{ marginTop: '30px' }}>
          {t('containers.homeSettings.hardware_settings')}
        </H2>

        <Content6>
          <ContentTitle>
            {t('containers.homeSettings.choose_derivation_path')}
          </ContentTitle>
          <RowForParts>
            <Part>
              <CustomSelect
                label="Derivation Path"
                value={selectedPath}
                onChange={event => {
                  const newValue = event.target.value;
                  if (newValue === 'add-more') {
                    this.openAddPathModal();
                    return true;
                  }
                  if (newValue !== selectedPath) {
                    this.onChangedDerivationPath();
                    this.handlePathChange(newValue);
                    return true;
                  }
                  return true;
                }}
                renderValue={value => {
                  const path = this.getPath(pathsList, selectedPath);
                  return (
                    <SelectRenderWrapper>
                      <span>{value} </span>
                      <NodeUrlSpan>({path})</NodeUrlSpan>
                    </SelectRenderWrapper>
                  );
                }}
              >
                {this.renderPaths(pathsList, selectedPath)}
                <ItemWrapper value="add-more" type="addmore">
                  <AddCircle
                    style={{
                      fill: '#7B91C0',
                      height: ms(1),
                      width: ms(1),
                      marginRight: '10px'
                    }}
                  />
                  {t('containers.homeSettings.add_derivation_path')}
                </ItemWrapper>
              </CustomSelect>
            </Part>
          </RowForParts>
        </Content6>

        <AddPathModal
          isPathModalOpen={isPathModalOpen}
          closeAddPathModal={this.closeAddPathModal}
          onChangedPath={this.onChangedDerivationPath}
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
    selectedPath: getSelectedPath(state),
    pathsList: getPathsList(state),
    locale: getLocale(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      syncWallet,
      setSelected,
      removeNode,
      setLocale,
      setPath,
      removePath,
      goBack: () => dispatch => dispatch(goBackToWallet()),
      goHomeAndClearState
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
