import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Circle from '@material-ui/icons/PanoramaFishEye';
import Button from '../Button';
import languageLogoIcon from '../../../resources/imgs/Language_Selection_img.svg';
// import { ms } from '../../styles/helpers';
import { wrapComponent } from '../../utils/i18n';
import theme from '../../styles/theme';
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

const RadioGroupContainer = styled(RadioGroup)`
  &&& {
    width: 287.7px;
    height: 200px;
    overflow: auto;
    display: block;
  }  
`;

const FormControlLabelWrapper = styled(FormControlLabel)`
  &&& {
    height: 40px;
    width: 100%;
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

const iconStyles = {
  fill: theme.colors.accent,
  width: 21,
  height: 21
};

type Props = {
  isOpen: boolean,
  onLanguageChange: () => {},
  onContinue: () => {},
  selectedLanguage: string,
  t: () => {}
};

const LanguageSelectModal = (props: Props) => {
  const { isOpen, onLanguageChange, selectedLanguage, onContinue, t } = props;

  return (
    <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container>
        <Title>{t("components.languageSelectModal.choose_language")}</Title>
        <Description>{t("components.languageSelectModal.language_selection_description")}</Description>
        <MainContainer>
          <LanguageLogo src={languageLogoIcon} />
          <RadioGroupContainer
            value={selectedLanguage}
            onChange={(event)=>onLanguageChange(event.target.value)}
          >
            {
              Object.keys(localesMap).map((key) => {
                return (
                  <FormControlLabelWrapper
                    value={key}
                    key={key}
                    control={
                      <CustomRadio                      
                        icon={<Circle style={iconStyles} />}
                        checkedIcon={<CheckCircle style={iconStyles} />}
                      />
                    }
                    label={localesMap[key]}
                  />
                );
              })
            }
          </RadioGroupContainer>          
        </MainContainer>
        <ButtonContainer>
          <Button buttonTheme="primary" onClick={onContinue}>
            {t("general.verbs.continue")}
          </Button>
        </ButtonContainer>        
      </Container>
    </Modal>
  );
};

export default wrapComponent(LanguageSelectModal);
