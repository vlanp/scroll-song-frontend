import ScreenContainer from "../components/ScreenContainer";
import ScreenTitle from "../components/ScreenTitle";
import { VerifCodeChecker } from "../components/VerifCodeChecker";
import { IVerifCode } from "../models/IVerifCode";
import { useLocalSearchParams } from "expo-router";

const EmailValidationScreen = () => {
  const { email, validUntil } = useLocalSearchParams<IVerifCode>();
  return (
    <ScreenContainer>
      <ScreenTitle title="Vérification du mail" />
      <VerifCodeChecker
        validUntil={new Date(validUntil)}
        email={email}
        verifType={"MailCheck"}
      />
    </ScreenContainer>
  );
};

export default EmailValidationScreen;
