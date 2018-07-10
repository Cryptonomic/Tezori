// @flow
import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import { ms } from '../styles/helpers';
import TezosIcon from './TezosIcon/';
import { H3 } from './Heading/';
import Button from './Button/';
import TezosAmount from './TezosAmount/';
import Address from './Address/';
import AddressStatus from './AddressStatus/';
import { READY } from '../constants/StatusTypes';
import { isReady } from '../utils/general';
import AddDelegateModal from './AddDelegateModal/';

const Container = styled.div`
  overflow: hidden;
`;

const AddressLabel = styled.div`
  padding: ${ms(-1)} ${ms(2)};
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  color: ${({ theme: { colors } }) => colors.primary};
  background: ${({ theme: { colors } }) => colors.gray1};
  align-items: center;
  justify-content: space-between;
`;

const AddDelegateLabel = styled(AddressLabel)`
  display: flex;
  flex-direction: row;
  font-size: ${ms(0)}
`

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
`;

const DelegateTitle = styled(AddressesTitle)`
  font-size: ${ms(-0.7)};
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold }
`

const AccountTitle = styled(H3)`
  font-size: ${ms(0.7)};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
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

AddDelegateLabel


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

  refreshAccount = (selectedAccountHash, selectedParentHash) => {
    const { syncAccountOrIdentity } = this.props;
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

    const ready = isReady(accountBlock.get('status'), accountBlock.get('storeTypes'));

    return (
      <Container>
        <AddressLabel>
          <AccountTitle>{`Account ${accountIndex}`}</AccountTitle>
          <TezosAmount
            color={'primary'}
            size={ms(0)}
            amount={balance}
            showTooltip
            format={2}
          />
        </AddressLabel>

        {
          ready
            ?
            (
              <Address
                isManager
                isActive={isManagerActive}
                balance={ accountBlock.get('balance') }
                onClick={() =>
                  this.goToAccount(publicKeyHash, publicKeyHash)
                }
              />
            )
            :
            (
              <AddressStatus
                isManager
                isActive={isManagerActive}
                address={ accountBlock }
                onClick={() =>
                  this.goToAccount(publicKeyHash, publicKeyHash)
                }
              />
            )
        }

        <AddDelegateLabel>
          <DelegateTitle>
            Add a Delegate
          </DelegateTitle>

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
        </AddDelegateLabel>
        {smartAddresses && smartAddresses.toArray().length ?
          smartAddresses.map((smartAddress, index) => {
            const smartAddressId = smartAddress.get('accountId');
            const isSmartActive = smartAddressId === selectedAccountHash;
            const smartAddressReady = isReady(smartAddress.get('status'));

            return smartAddressReady
              ?
              (
                <Address
                  key={ smartAddressId }
                  index={index}
                  isActive={isSmartActive}
                  balance={ smartAddress.get('balance') }
                  onClick={() =>
                  this.goToAccount(smartAddressId, publicKeyHash)
                }
                />
              )
              :
              (
                <AddressStatus
                  key={ smartAddressId }
                  isActive={ isSmartActive }
                  address={ smartAddress }
                  onClick={() =>
                    this.refreshAccount(smartAddressId, publicKeyHash)
                  }
                />
              )
            ;
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
