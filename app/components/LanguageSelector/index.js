// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import i18n from 'i18next';
import RootRef from '@material-ui/core/RootRef';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { wrapComponent } from '../../utils/i18n';
import localesMap from '../../constants/LocalesMap';


const ItemWrapper = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      color: ${({ theme: { colors } }) => colors.primary };
    }
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 300;
    background-color: ${({ type, theme: { colors } }) => type==="addmore"?colors.gray1: colors.white };
  }
`;

const SelectContainer = styled(FormControl)`
  width: 100%;
`;

const LabelWrapper = styled(InputLabel)`
  &&& {
    &[class*='focused'] {    
      color: ${({ theme: { colors } }) => colors.gray3 };
    }
    color: rgba(0, 0, 0, 0.38);
    font-size: 16px;
    transform: translate(0, 1.5px) scale(0.75);
    transform-origin: top left;
    transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
  }
}`;

const SelectWrapper = styled.div`
  width: 100%;
  height: 32px;
  color: #123262;
  font-size: 16px;
  font-weight: 300;
  margin-top: 16px;
  display: inline-flex;
  position: relative;
  border-bottom: solid 1px rgba(0,0,0,0.12);
  &:hover {
    border-bottom: solid 2px #2c7df7;
  }
  &:active {
    border-bottom: solid 2px #2c7df7;
  }
`;

const SelectContent = styled.div`
  width: auto;
  overflow: hidden;
  min-height: 1.1875em;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  user-select: none;
  padding: 0 32px 0 0;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const SelectIcon = styled(ArrowDropDownIcon)`
  top: calc(50% - 12px);
  right: 0;
  color: rgba(0, 0, 0, 0.54);
  position: absolute;
  pointer-events: none;

  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 24px;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  flex-shrink: 0;
`;

const GroupContainerWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const ScrollContainer = styled.div`
  &&& {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: block;
    &::-webkit-scrollbar {
      width: 4px;
    }    
    &::-webkit-scrollbar-track {
      background: ${({ theme: { colors } }) => colors.gray2};
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${({ theme: { colors } }) => colors.accent};
      border-radius: 4px;
    }
  }  
`;

const FadeOut = styled.div`
  position: absolute;
  width: 92%;
  height: 30px;
  pointer-events: none;
  z-index: 100;
`;

const FadeTop = styled(FadeOut)`
  top: 0;
  background-image: linear-gradient(to top, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%);
`;

const FadeBottom = styled(FadeOut)`
  bottom: 0;
  background-image: linear-gradient( rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50% );
`;

type Props = {
  t: () => {},
  locale: string,
  setLocale: () => {}
};

class LanguageSelector extends Component<Props> {

  constructor() {
    super();
    this.domRef = React.createRef();
    this.langScrollEl = null;
  }

  state = {
    open: false,
    isTopFade: false, 
    isBottomFade: false
  }

  componentWillMount = () => {
    const numberOfLocales = Object.keys(localesMap).length;
    if (numberOfLocales < 6) {
      this.setState({ isBottomFade: false, numberOfLocales });
    } else {
      this.setState({ isBottomFade: true, numberOfLocales });
    }
  }

  renderOptions(selectedLang) {
    return Object.keys(localesMap).map((key) => {
      return (
        <ItemWrapper
          key={key}
          value={key}
          selected={selectedLang === key}
          onClick={()=>this.onLanguageChange(key)}
        >
          <div> { localesMap[key] } </div>
        </ItemWrapper>
      );
    });
  }

  setLanguageScrollRef = (element) => {
    this.langScrollEl = element;
    if (this.langScrollEl) {
      const { locale } = this.props;
      const index = Object.keys(localesMap).indexOf(locale);
      if (index>4) {
        this.langScrollEl.scrollTop = 40 * (index - 4);
      }
    }    
  }

  onScrollChange = (event) => {
    const { numberOfLocales } = this.state;
    const pos = event.target.scrollTop;
    const remainCount = numberOfLocales - 5;
    if (pos === 0 ) {
      this.setState({isTopFade : false, isBottomFade: true });
    } else if (pos < remainCount*40) {
      this.setState({isTopFade : true, isBottomFade: true });
    } else {
      this.setState({isTopFade : true, isBottomFade: false });
    }
  }

  handleClose = () => {
    this.setState({open: false});
  }

  onLanguageChange = (key) => {
    const { setLocale } = this.props;
    setLocale(key);
    i18n.changeLanguage(key);
    this.handleClose();

  }

  render() {
    const { locale, t } = this.props;
    const { open, isTopFade, isBottomFade } = this.state;
    return (
      <SelectContainer>
        <LabelWrapper>{t('general.nouns.language')}</LabelWrapper>
        <RootRef rootRef={this.domRef}>
          <SelectWrapper
            onClick={()=> {
              const {open} = this.state;
              this.setState({open: !open});
            }}
          >
            <SelectContent>{localesMap[locale]}</SelectContent>
            <SelectIcon />
          </SelectWrapper>        
        </RootRef>
        
        <Popover
          open={open}
          anchorEl={this.domRef.current}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              width: this.domRef.current?this.domRef.current.clientWidth: 300
            }
          }}
          onClose={this.handleClose}
        >
          <GroupContainerWrapper>
            {isTopFade && <FadeTop />}
            <RootRef rootRef={this.setLanguageScrollRef}>
              <ScrollContainer
                onScroll={this.onScrollChange}
              >
                {this.renderOptions(locale)}
              </ScrollContainer>
            </RootRef>
            
            {isBottomFade && <FadeBottom />}
          </GroupContainerWrapper>
        </Popover>
      </SelectContainer>
    );
  }
}

export default wrapComponent(LanguageSelector);
