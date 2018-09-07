import React, { Component } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import RootRef from '@material-ui/core/RootRef';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Circle from '@material-ui/icons/PanoramaFishEye';
import Button from '../Button';
import languageLogoIcon from '../../../resources/imgs/Language_Selection_img.svg';
import { wrapComponent } from '../../utils/i18n';
import localesMap from '../../constants/LocalesMap';

const Container = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  width: 508px;
  padding: 36px 0;
`;

const Title = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.normal};
  font-size: 36px;
  line-height: 40px;
  letter-spacing: 0.1px;
`;

const Description = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: 300;
  font-size: 18px;
  letter-spacing: 0.1px;
  margin: 14px 0 23px 0;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LanguageLogo = styled.img`
  width: 155px;
  height: 155px;
`;

const GroupContainerWrapper = styled.div`
  width: 287.7px;
  height: 200px;
  position: relative;
`;

const FadeOut = styled.div`
  position: absolute;
  width: 92%;
  height: 30px;
  pointer-events: none;
`;

const FadeTop = styled(FadeOut)`
  top: 0;
  background-image: linear-gradient(to top, rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50%);
`;

const FadeBottom = styled(FadeOut)`
  bottom: 0;
  background-image: linear-gradient( rgba(255,255,255,0) 0%,rgba(255,255,255,0.8) 50% );
`;

const RadioGroupContainer = styled(RadioGroup)`
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

const FormControlLabelWrapper = styled(FormControlLabel)`
  &&& {
    height: 40px;
    width: 92%;
    border-bottom: solid 1px ${({ theme: { colors } }) => colors.gray11};
    margin: 0px;    
    [class*='MuiFormControlLabel-label'] {
      color: ${({ theme: { colors } }) => colors.primary};
      font-size: 18px;
      letter-spacing: 0.1px;
      font-weight: 300;
    }
  }  
`;

const CustomRadio = styled(Radio)`
  &&& {
    width: 21px;
    height: 21px;
    color: rgba(0, 0, 0, 0.54);
    margin-right: 10px;
  }
`;

const ButtonContainer = styled.div`
  padding-top: 32px;
  display: flex;
  justify-content: flex-end;
`;

const CheckedCircle = styled(CheckCircle)`
  &&& {
    fill: ${({ theme: { colors } }) => colors.accent};
    width: 21px;
    height: 21px;
  }
`;

const NonCheckedCircle = styled(Circle)`
  &&& {
    fill: ${({ theme: { colors } }) => colors.gray12};
    width: 21px;
    height: 21px;
  }
`;

const customStyles = {
  content: {
    alignItems: 'center',
    border: '0',
    borderRadius: '0',
    top: 'auto',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    width: '100%'
  },
  overlay: {
    backgroundColor: 'rgba(155, 155, 155, 0.68)'
  }
};

type Props = {
  isOpen: boolean,
  onLanguageChange: () => {},
  onContinue: () => {},
  selectedLanguage: string,
  t: () => {}
};
class LanguageSelectModal extends Component<Props> {

  constructor(props) {
    super(props);
    this.langScrollEl = null;
  }

  state = {
    isTopFade: false,
    isBottomFade: false,
    numberOfLocales: 0
  };  

  componentWillMount = () => {
    const numberOfLocales = Object.keys(localesMap).length;
    if (numberOfLocales < 6) {
      this.setState({ isBottomFade: false, numberOfLocales });
    } else {
      this.setState({ isBottomFade: true, numberOfLocales });
    }
  }

  setLanguageScrollRef = element => {
    this.langScrollEl = element;
    if (this.langScrollEl) {
      const { selectedLanguage } = this.props;
      const index = Object.keys(localesMap).indexOf(selectedLanguage);
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

  render() {
    const { isOpen, onLanguageChange, selectedLanguage, onContinue, t } = this.props;
    const { isTopFade, isBottomFade } = this.state;
    return (
      <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
        <Container>
          <Title>{t("components.languageSelectModal.choose_language")}</Title>
          <Description>{t("components.languageSelectModal.language_selection_description")}</Description>
          <MainContainer>
            <LanguageLogo src={languageLogoIcon} />
            <GroupContainerWrapper>
              {isTopFade && <FadeTop />}
              <RootRef rootRef={this.setLanguageScrollRef}>
                <RadioGroupContainer
                  value={selectedLanguage}
                  onChange={(event)=>onLanguageChange(event.target.value)}
                  onScroll={this.onScrollChange}
                >
                  {
                    Object.keys(localesMap).map((key) => {
                      return (
                        <FormControlLabelWrapper
                          value={key}
                          key={key}
                          control={
                            <CustomRadio                      
                              icon={<NonCheckedCircle />}
                              checkedIcon={<CheckedCircle />}
                            />
                          }
                          label={localesMap[key]}
                        />
                      );
                    })
                  }
                </RadioGroupContainer>
              </RootRef>
              
              {isBottomFade && <FadeBottom />}
            </GroupContainerWrapper>
                    
          </MainContainer>
          <ButtonContainer>
            <Button buttonTheme="primary" onClick={onContinue}>
              {t("general.verbs.continue")}
            </Button>
          </ButtonContainer>        
        </Container>
      </Modal>
    );
  }
};

export default wrapComponent(LanguageSelectModal);
