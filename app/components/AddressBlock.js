// @flow
import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import { ms } from '../styles/helpers';
import TezosIcon from './TezosIcon/';
import Tooltip from './Tooltip/';
import { H3 } from './Heading/';
import Button from './Button/';
import TezosAmount from './TezosAmount/';
import ManagerAddressTooltip from './Tooltips/ManagerAddressTooltip/';
import { READY } from '../constants/StatusTypes';

import AddDelegateModal from './AddDelegateModal/';

const Container = styled.div`
  overflow: hidden;
`;

const Address = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-2)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, isReady, theme: { colors } }) => {
    const color = isActive
      ? colors.accent
      : colors.white;

    return isReady
      ? color
      : colors.disabled
  }};
  display: flex;
  flex-direction: column;
`;

const AddressFirstLine = styled.span`
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.secondary};
`;

const AddressSecondLine = styled.span`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
  font-weight: ${({theme: {typo}}) => typo.weights.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddressLabel = styled.div`
  padding: ${ms(-1)} ${ms(2)};
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  color: ${({ theme: { colors } }) => colors.primary};
  background: ${({ theme: { colors } }) => colors.gray1};
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AddressLabelIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
`;

const AccountTitle = styled(H3)`
  font-size: ${ms(1)};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  padding: 0 ${ms(-1)} 0 0;
  display: inline-block;
  border-right: 2px solid
    ${({ theme: { colors } }) => darken(0.05, colors.gray1)};
  @media (max-width: 1200px) {
    border-right: none;
  }
`;

const NoSmartAddressesContainer = styled.div`
  width: 100%;
  padding: ${ms(2)};
  background: ${({ theme: { colors } }) => colors.white};
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: ${ms(-1)};
  position: relative;
  margin-top: ${ms(1)};
`
const NoSmartAddressesTitle = styled.span`
  color: ${({ theme: { colors } }) => colors.gray3};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  font-size: ${ms(1)};
`

const NoSmartAddressesDescriptionList = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${ms(1)};
  list-style-type: none;
`

const NoSmartAddressesDescriptionItem = styled.li`
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: ${ms(-2)} 0;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.gray2};
`

const NoSmartAddressesIcon = styled(TezosIcon)`
  padding-top: ${ms(-10)};
  padding-right: ${ms(-2)};
`

const NoSmartAddressesButton = styled(Button)`
  border: 2px solid ${({ theme: { colors } }) => colors.gray3};
  padding: ${ms(-5)} ${ms(1)};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  width: 100%;
`

const Syncing = styled.div`
  display: ${({ isReady }) =>  isReady ? 'none' : 'flex'};
  align-items: center;
`

const Refresh = styled(RefreshIcon)`
  -webkit-animation:spin 0.5s linear infinite;
  -moz-animation:spin 0.5s linear infinite;
  animation:spin 0.5s linear infinite;

  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
`


type Props = {
  accountBlock: Object, // TODO: type this
  syncAccountOrIdentity: Function,
  selectedAccountHash: string,
  accountIndex: number,
  theme: Object
};

type State = {
  shouldHideSmartAddressesInfo: boolean
};

class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    shouldHideSmartAddressesInfo: false,
    isDelegateModalOpen: false
  };

  openDelegateModal = () =>  this.setState({ isDelegateModalOpen: true });
  closeDelegateModal = () =>  this.setState({ isDelegateModalOpen: false });

  goToAccount = (selectedAccountHash, selectedParentHash) => {
    const { history, syncAccountOrIdentity } = this.props;
    history.push(`/home/addresses/${selectedAccountHash}/${selectedParentHash}`);
    syncAccountOrIdentity(selectedAccountHash, selectedParentHash);
  };

  closeNoSmartAddresses = () => {
    this.setState({
      shouldHideSmartAddressesInfo: true
    })
  }

  renderNoSmartAddressesDescription = (arr) => {
    return(
      <NoSmartAddressesDescriptionList>
        {arr.map((item, index) => {
          return(
            <NoSmartAddressesDescriptionItem key={index}>
              <NoSmartAddressesIcon
                iconName="arrow-right"
                size={ms(0)}
                color="gray3"
              />
              <div>{item}</div>
            </NoSmartAddressesDescriptionItem>
          )
        })}
      </NoSmartAddressesDescriptionList>
    )
  }

  render() {
    const { isDelegateModalOpen } = this.state;
    const { accountBlock, selectedAccountHash, accountIndex, theme } = this.props;
    
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const balance = accountBlock.get('balance');
    const formatedBalance = balance.toFixed(6);
    const { shouldHideSmartAddressesInfo } = this.state;
    const isManagerActive = publicKeyHash === selectedAccountHash;
    const smartAddresses = accountBlock.get('accounts');
    const isManagerReady = accountBlock.get('status') === READY;
    const noSmartAddressesDescriptionContent = [
      'Delegating tez is not the same as sending tez. Only baking rights are transferred when setting a delegate. The delegate that you set cannot spend your tez.',
      'There is a fee for setting a delegate.',
      'It takes 7 cycles (19.91 days) for your tez to start contributing to baking.',
      'Delegation rewards will depend on your arrangement with the delegate.'
    ]

    return (
      <Container>
        <AddressLabel>
          <AccountTitle>{`Account ${accountIndex}`}</AccountTitle>
          <TezosAmount
            color={'primary'}
            size={ms(1)}
            amount={balance}
            format={2}
            showTooltip
          />
        </AddressLabel>
        <Address
          isActive={isManagerActive}
          isReady={ isManagerReady }
          onClick={() =>
            this.goToAccount(publicKeyHash, publicKeyHash)
          }
        >
          <AddressFirstLine isActive={isManagerActive} >
            <AddressesTitle>
              <AddressLabelIcon
                iconName="manager"
                size={ms(0)}
                color={isManagerActive ? 'white' : 'secondary'}
              />
              Manager Address
              <Tooltip position="bottom" content={ManagerAddressTooltip}>
                <Button buttonTheme="plain">
                  <HelpIcon
                    iconName="help"
                    size={ms(0)}
                    color={isManagerActive ? 'white' : 'secondary'}
                  />
                </Button>
              </Tooltip>
            </AddressesTitle>
          </AddressFirstLine>
          <AddressSecondLine isActive={isManagerActive}>
            <TezosAmount
              color={
                publicKeyHash === selectedAccountHash ? 'white' : 'primary'
              }
              amount={accountBlock.get('balance')}
            />
            <Syncing isReady={ isManagerReady } >
              <span>Syncing</span>
              <Refresh
                style={{
                  fill: isManagerActive ? theme.colors.white : theme.colors.primary,
                  height: ms(2),
                  width: ms(2)
                }}
              />
            </Syncing>
          </AddressSecondLine>
        </Address>

        <AddressLabel>
          <AddressesTitle>
            Add a Delegate
          </AddressesTitle>

          <AddCircle
            style={{
              fill: '#7B91C0',
              height: ms(1),
              width: ms(1),
              cursor: !isManagerReady ? 'not-allowed' : 'pointer'
            }}
            onClick={() => {
              if(isManagerReady) {
                this.openDelegateModal();
              }
            }}
          />
        </AddressLabel>
        {smartAddresses && smartAddresses.toArray().length ?
          smartAddresses.map((smartAddress, index) => {
            const isSmartAddressReady = smartAddress.get('status') === READY;
            const smartAddressId = smartAddress.get('accountId');
            const isSmartActive = smartAddressId === selectedAccountHash;
            const smartAddressBalance = smartAddress.get('balance');

            return (
              <Address
                key={smartAddressId}
                isActive={isSmartActive}
                isReady={ isSmartAddressReady }
                onClick={() =>
                  this.goToAccount(smartAddressId, publicKeyHash)
                }
              >
                <AddressFirstLine isActive={isSmartActive}>
                  <AddressesTitle>
                    <AddressLabelIcon
                      iconName="smart-address"
                      size={ms(0)}
                      color={isSmartActive ? 'white' : 'secondary'}
                    />
                    {`Delegated Address ${index + 1}`}
                  </AddressesTitle>
                </AddressFirstLine>
                <AddressSecondLine isActive={isSmartActive}>
                  <TezosAmount
                    color={isSmartActive ? 'white' : 'primary'}
                    amount={smartAddressBalance}
                  />
                  <Syncing isReady={ isSmartAddressReady } >
                    <span>Syncing</span>
                    <Refresh
                      style={{
                        fill: isSmartActive ? theme.colors.white : theme.colors.primary,
                        height: ms(2),
                        width: ms(2)
                      }}
                    />
                  </Syncing>
                </AddressSecondLine>
              </Address>
            );
          }) : !shouldHideSmartAddressesInfo && (
          <NoSmartAddressesContainer>
            <CloseIcon
              style={{
                position: 'absolute',
                top: ms(0),
                right: ms(0),
                fill: theme.colors.secondary,
                width: ms(0),
                height: ms(0),
                cursor: 'pointer'
              }}
              onClick={this.closeNoSmartAddresses}
            />
            <NoSmartAddressesTitle>
              Delegation Tips
            </NoSmartAddressesTitle>
              {this.renderNoSmartAddressesDescription(noSmartAddressesDescriptionContent)}
            <NoSmartAddressesButton small buttonTheme="secondary" onClick={this.openDelegateModal}>
              Add a Delegate
            </NoSmartAddressesButton>
          </NoSmartAddressesContainer>
          )
        }
        <AddDelegateModal
          selectedParentHash={ publicKeyHash }
          open={isDelegateModalOpen}
          onCloseClick={this.closeDelegateModal}
        />
      </Container>
    );
  }
}

export default withTheme(AddressBlock);
