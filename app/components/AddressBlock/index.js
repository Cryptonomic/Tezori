// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import AddCircle from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';

import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import { H3 } from '../Heading/';
import Button from '../Button/';
import TezosAmount from '../TezosAmount/';
import Address from '../Address/';
import AddressStatus from '../AddressStatus/';
import { READY, PENDING } from '../../constants/StatusTypes';
import { MNEMONIC } from '../../constants/StoreTypes';
import { isReady } from '../../utils/general';
import AddDelegateModal from '../AddDelegateModal/';
import Tooltip from '../Tooltip';
import NoFundTooltip from "../Tooltips/NoFundTooltip";
import { sortArr } from '../../utils/array';
import { wrapComponent } from '../../utils/i18n';


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
    shouldHideSmartAddressesInfo: false,
    isDelegateModalOpen: false
  };

  openDelegateModal = () => this.setState({ isDelegateModalOpen: true });
  closeDelegateModal = () => this.setState({ isDelegateModalOpen: false });

  goToAccount = (selectedAccountHash, selectedParentHash) => {
    const { history, syncAccountOrIdentity } = this.props;
    history.push(
      `/home/addresses/${selectedAccountHash}/${selectedParentHash}`
    );
    syncAccountOrIdentity(selectedAccountHash, selectedParentHash);
  };

  closeNoSmartAddresses = () => {
    this.setState({
      shouldHideSmartAddressesInfo: true
    });
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
    const { isDelegateModalOpen } = this.state;
    const {
      accountBlock,
      selectedAccountHash,
      accountIndex,
      theme,
      t
    } = this.props;

    const publicKeyHash = accountBlock.get('publicKeyHash');
    const balance = accountBlock.get('balance');
    let smartBalance = 0;
    const { shouldHideSmartAddressesInfo } = this.state;
    const isManagerActive = publicKeyHash === selectedAccountHash;
    const smartAddresses = accountBlock.get('accounts');
    if (smartAddresses && smartAddresses.toArray().length) {
      smartAddresses.forEach((address)=> {
        const addressStatus = address.get('status');
        if(addressStatus === READY || addressStatus === PENDING) {
          smartBalance+=address.get('balance');
        }        
      });
    }

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
            {t('components.addressBlock.account_title', {index: accountIndex})}
          </AccountTitle>
          {ready || storeType === MNEMONIC ? (
            <TezosAmount
              color="primary"
              size={ms(0)}
              amount={balance+smartBalance}
              format={2}
            />
          ) : null}
        </AddressLabel>

        {ready ? (
          <Address
            isManager
            isActive={isManagerActive}
            balance={accountBlock.get('balance')}
            onClick={() => this.goToAccount(publicKeyHash, publicKeyHash)}
          />
        ) : (
          <AddressStatus
            isManager
            isActive={isManagerActive}
            address={accountBlock}
            onClick={() => this.goToAccount(publicKeyHash, publicKeyHash)}
          />
        )}

        <AddDelegateLabel>
          <DelegateTitle>{t('components.addDelegateModal.add_delegate_title')}</DelegateTitle>
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
              position='bottom'
              offset='-24%'
              content={<NoFundTooltip content={t('components.addressBlock.not_ready_tooltip')} />}
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
        {
          smartAddresses && smartAddresses.toArray().length
          ?
            smartAddresses
              .sort(sortArr({ sortOrder: 'asc', sortBy: 'order' }))
              .map((smartAddress, index) => {
                const smartAddressId = smartAddress.get('accountId');
                const isSmartActive = smartAddressId === selectedAccountHash;
                const smartAddressReady = isReady(smartAddress.get('status'));

                return smartAddressReady ? (
                  <Address
                    key={smartAddressId}
                    index={index}
                    isActive={isSmartActive}
                    balance={smartAddress.get('balance')}
                    onClick={() =>
                    this.goToAccount(smartAddressId, publicKeyHash)
                  }
                  />
                ) : (
                  <AddressStatus
                    key={smartAddressId}
                    isActive={isSmartActive}
                    address={smartAddress}
                    onClick={() =>
                    this.goToAccount(smartAddressId, publicKeyHash)
                  }
                  />
                );
              })
          :
            !shouldHideSmartAddressesInfo &&
            (
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
                <NoSmartAddressesTitle>{t('components.addressBlock.delegation_tips')}</NoSmartAddressesTitle>
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
            )
        }
        <AddDelegateModal
          selectedParentHash={publicKeyHash}
          open={isDelegateModalOpen}
          onCloseClick={this.closeDelegateModal}
          managerBalance={balance}
          t={t}
        />
      </Container>
    );
  }
}

export default compose(wrapComponent, withTheme)(AddressBlock);
