// @flow
import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import { StoreType } from 'conseiljs';

import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import { H3 } from '../Heading/';
import Button from '../Button/';
import TezosAmount from '../TezosAmount/';
import Address from '../Address/';
import AddressStatus from '../AddressStatus/';
import { READY, PENDING } from '../../constants/StatusTypes';
import { isReady } from '../../utils/general';
import AddDelegateModal from '../AddDelegateModal/';
import InteractContractModal from '../InteractContractModal';
import SecurityNoticeModal from '../SecurityNoticeModal';
import Tooltip from '../Tooltip';
import NoFundTooltip from '../Tooltips/NoFundTooltip';
import { wrapComponent } from '../../utils/i18n';
import { getNodeUrl } from '../../utils/settings';

import { hideDelegateTooltip } from '../../reduxContent/settings/thunks';
import {
  getDelegateTooltip,
  getTezosSelectedNode,
  getTezosNodes
} from '../../reduxContent/settings/selectors';

const { Mnemonic } = StoreType;

const Container = styled.div`
  overflow: hidden;
`;

const AddressLabel = styled.div`
  padding: ${ms(-1)} ${ms(2)};
  display: flex;
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  color: ${({ theme: { colors } }) => colors.primary};
  background: ${({ theme: { colors } }) => colors.gray1};
  align-items: center;
  justify-content: space-between;
`;

const AddDelegateLabel = styled(AddressLabel)`
  display: flex;
  flex-direction: row;
  font-size: ${ms(0)};
`;

const InteractContractLabel = styled(AddDelegateLabel)``;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
`;

const DelegateTitle = styled(AddressesTitle)`
  font-size: ${ms(-0.7)};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.bold};
`;

const AccountTitle = styled(H3)`
  font-size: ${ms(0.7)};
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  letter-spacing: 0.8px;
  padding: 0 ${ms(-1)} 0 0;
  display: inline-block;
  line-height: 1.5;
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
`;
const NoSmartAddressesTitle = styled.span`
  color: ${({ theme: { colors } }) => colors.gray3};
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  font-size: ${ms(1)};
`;

const NoSmartAddressesDescriptionList = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${ms(1)};
  list-style-type: none;
`;

const NoSmartAddressesDescriptionItem = styled.li`
  display: flex;
  font-weight: ${({ theme: { typo } }) => typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: ${ms(-2)} 0;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.gray2};
`;

const NoSmartAddressesIcon = styled(TezosIcon)`
  padding-top: ${ms(-10)};
  padding-right: ${ms(-2)};
`;

const NoSmartAddressesButton = styled(Button)`
  border: 2px solid ${({ theme: { colors } }) => colors.gray3};
  padding: ${ms(-5)} ${ms(1)};
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  width: 100%;
`;

type Props = {
  hideDelegateTooltip: () => {},
  delegateTooltip: boolean,
  tezosSelectedNode: string,
  tezosNodes: array,
  history: object,
  accountBlock: object, // TODO: type this
  syncAccountOrIdentity: () => {},
  selectedAccountHash: string,
  accountIndex: number,
  theme: object,
  t: () => {}
};

type State = {
  shouldHideSmartAddressesInfo: boolean
};

class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    isDelegateModalOpen: false,
    isInteractModalOpen: false,
    isSecurityModalOpen: false
  };

  openDelegateModal = () => this.setState({ isDelegateModalOpen: true });
  closeDelegateModal = () => this.setState({ isDelegateModalOpen: false });

  openInteractModal = () => this.setState({ isInteractModalOpen: true });

  onCheckInteractModal = () => {
    const { tezosSelectedNode, tezosNodes } = this.props;
    const nodeUrl = getNodeUrl(tezosNodes, tezosSelectedNode);

    const index = nodeUrl.indexOf('localhost');
    const isNotShowMessage = localStorage.getItem('isNotShowMessage');
    if (index >= 0 || isNotShowMessage) {
      this.openInteractModal();
    } else {
      this.setState({ isSecurityModalOpen: true });
    }
  };

  onProceedSecurityModal = () =>
    this.setState({ isInteractModalOpen: true, isSecurityModalOpen: false });
  closeInteractModal = () => this.setState({ isInteractModalOpen: false });
  closeSecurityModal = () => this.setState({ isSecurityModalOpen: false });

  goToAccount = (selectedAccountHash, selectedParentHash, index) => {
    const { history, syncAccountOrIdentity } = this.props;
    history.push(
      `/home/addresses/${selectedAccountHash}/${selectedParentHash}/${index}`
    );
    syncAccountOrIdentity(selectedAccountHash, selectedParentHash);
  };

  getAddresses = addresses => {
    const newAddresses = [];
    const delegatedAddresses = [];
    const smartAddresses = addresses;
    let smartBalance = 0;
    addresses.forEach(address => {
      const { balance, status } = address;
      // const { script, balance, status } = address;
      // if (script) {
      //   smartAddresses.push(address);
      // } else {
      //   const newAddress = {
      //     pkh: address.account_id,
      //     balance
      //   };
      //   newAddresses.push(newAddress);
      //   delegatedAddresses.push(address);
      // }
      if (status === READY || status === PENDING) {
        smartBalance += balance;
      }
    });
    return {
      newAddresses,
      delegatedAddresses: delegatedAddresses.sort((a, b) => a.order - b.order),
      smartAddresses: smartAddresses.sort((a, b) => a.order - b.order),
      smartBalance
    };
  };

  renderNoSmartAddressesDescription = arr => {
    return (
      <NoSmartAddressesDescriptionList>
        {arr.map((item, index) => {
          return (
            <NoSmartAddressesDescriptionItem key={index}>
              <NoSmartAddressesIcon
                iconName="arrow-right"
                size={ms(0)}
                color="gray3"
              />
              <div>{item}</div>
            </NoSmartAddressesDescriptionItem>
          );
        })}
      </NoSmartAddressesDescriptionList>
    );
  };

  render() {
    const {
      isDelegateModalOpen,
      isInteractModalOpen,
      isSecurityModalOpen
    } = this.state;
    const {
      accountBlock,
      selectedAccountHash,
      accountIndex,
      delegateTooltip,
      theme,
      t
    } = this.props;

    const publicKeyHash = accountBlock.get('publicKeyHash');
    const balance = accountBlock.get('balance');
    let regularAddresses = [{ pkh: publicKeyHash, balance }];
    const isManagerActive = publicKeyHash === selectedAccountHash;
    const addresses = accountBlock.get('accounts').toJS();
    const {
      newAddresses,
      delegatedAddresses,
      smartAddresses,
      smartBalance
    } = this.getAddresses(addresses);
    regularAddresses = regularAddresses.concat(newAddresses);

    const isDelegateToolTip =
      delegateTooltip && delegatedAddresses.length && smartAddresses.length;

    const isManagerReady = accountBlock.get('status') === READY;
    const noSmartAddressesDescriptionContent = [
      t('components.addressBlock.descriptions.description1'),
      t('components.addressBlock.descriptions.description2'),
      t('components.addressBlock.descriptions.description3'),
      t('components.addressBlock.descriptions.description4')
    ];

    const storeType = accountBlock.get('storeType');
    const ready = isReady(accountBlock.get('status'), storeType);

    return (
      <Container>
        <AddressLabel>
          <AccountTitle>
            {t('components.addressBlock.account_title', {
              index: accountIndex
            })}
          </AccountTitle>
          {ready || storeType === Mnemonic ? (
            <TezosAmount
              color="primary"
              size={ms(0)}
              amount={balance + smartBalance}
              format={2}
            />
          ) : null}
        </AddressLabel>

        {ready ? (
          <Address
            isManager
            isActive={isManagerActive}
            balance={accountBlock.get('balance')}
            onClick={() => this.goToAccount(publicKeyHash, publicKeyHash, 0)}
          />
        ) : (
          <AddressStatus
            isManager
            isActive={isManagerActive}
            status={accountBlock.get('status')}
            onClick={() => this.goToAccount(publicKeyHash, publicKeyHash, 0)}
          />
        )}

        <AddDelegateLabel>
          <DelegateTitle>
            {t('components.addDelegateModal.add_delegate_title')}
          </DelegateTitle>
          {isManagerReady && (
            <AddCircle
              style={{
                fill: '#7B91C0',
                height: ms(1),
                width: ms(1),
                cursor: 'pointer'
              }}
              onClick={this.openDelegateModal}
            />
          )}
          {!isManagerReady && (
            <Tooltip
              position="bottom"
              offset="-24%"
              content={
                <NoFundTooltip
                  content={t('components.addressBlock.not_ready_tooltip')}
                />
              }
            >
              <Button buttonTheme="plain">
                <AddCircle
                  style={{
                    fill: '#7B91C0',
                    height: ms(1),
                    width: ms(1),
                    opacity: 0.5,
                    cursor: 'default'
                  }}
                />
              </Button>
            </Tooltip>
          )}
        </AddDelegateLabel>
        {delegatedAddresses.map((address, index) => {
          const { status, balance } = address;
          const addressId = address.account_id;
          const isDelegatedActive = addressId === selectedAccountHash;
          const delegatedAddressReady = isReady(status);

          return delegatedAddressReady ? (
            <Address
              key={addressId}
              index={index}
              isActive={isDelegatedActive}
              balance={balance}
              onClick={() =>
                this.goToAccount(addressId, publicKeyHash, index + 1)
              }
            />
          ) : (
            <AddressStatus
              key={addressId}
              isActive={isDelegatedActive}
              status={status}
              onClick={() =>
                this.goToAccount(addressId, publicKeyHash, index + 1)
              }
            />
          );
        })}
        <InteractContractLabel>
          <DelegateTitle>
            {t('components.interactModal.interact_contract')}
          </DelegateTitle>
          {isManagerReady && (
            <AddCircle
              style={{
                fill: '#7B91C0',
                height: ms(1),
                width: ms(1),
                cursor: 'pointer'
              }}
              onClick={this.onCheckInteractModal}
            />
          )}
          {!isManagerReady && (
            <Tooltip
              position="bottom"
              offset="-24%"
              content={
                <NoFundTooltip
                  content={t(
                    'components.addressBlock.not_ready_interact_tooltip'
                  )}
                />
              }
            >
              <Button buttonTheme="plain">
                <AddCircle
                  style={{
                    fill: '#7B91C0',
                    height: ms(1),
                    width: ms(1),
                    opacity: 0.5,
                    cursor: 'default'
                  }}
                />
              </Button>
            </Tooltip>
          )}
        </InteractContractLabel>
        {smartAddresses.map((address, index) => {
          const { status, balance } = address;
          const addressId = address.account_id;
          const isActive = addressId === selectedAccountHash;
          const smartAddressReady = isReady(status);

          return smartAddressReady ? (
            <Address
              key={addressId}
              isContract
              accountId={addressId}
              isActive={isActive}
              balance={balance}
              onClick={() =>
                this.goToAccount(addressId, publicKeyHash, index + 1)
              }
            />
          ) : (
            <AddressStatus
              key={addressId}
              isActive={isActive}
              status={status}
              isContract
              onClick={() =>
                this.goToAccount(addressId, publicKeyHash, index + 1)
              }
            />
          );
        })}
        <InteractContractModal
          selectedParentHash={publicKeyHash}
          open={isInteractModalOpen}
          onCloseClick={this.closeInteractModal}
          addresses={regularAddresses}
          t={t}
        />
        <AddDelegateModal
          selectedParentHash={publicKeyHash}
          open={isDelegateModalOpen}
          onCloseClick={this.closeDelegateModal}
          managerBalance={balance}
          t={t}
        />
        <SecurityNoticeModal
          open={isSecurityModalOpen}
          onClose={this.closeSecurityModal}
          onProceed={this.onProceedSecurityModal}
        />
        {isDelegateToolTip && (
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
              onClick={() => this.props.hideDelegateTooltip('true')}
            />
            <NoSmartAddressesTitle>
              {t('components.addressBlock.delegation_tips')}
            </NoSmartAddressesTitle>
            {this.renderNoSmartAddressesDescription(
              noSmartAddressesDescriptionContent
            )}
            <NoSmartAddressesButton
              small
              buttonTheme="secondary"
              onClick={this.openDelegateModal}
              disabled={!isManagerReady}
            >
              {t('components.addDelegateModal.add_delegate_title')}
            </NoSmartAddressesButton>
          </NoSmartAddressesContainer>
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    delegateTooltip: getDelegateTooltip(state),
    tezosSelectedNode: getTezosSelectedNode(state),
    tezosNodes: getTezosNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideDelegateTooltip
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
)(AddressBlock);
