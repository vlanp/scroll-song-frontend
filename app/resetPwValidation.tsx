import ScreenContainer from "@/components/ScreenContainer";
import ScreenTitle from "@/components/ScreenTitle";
import { VerifCodeChecker } from "@/components/VerifCodeChecker";
import { IVerifCode } from "@/models/IVerifCode";
import { useLocalSearchParams } from "expo-router";

const ResetPwValidationScreen = () => {
  const { email, validUntil } = useLocalSearchParams<IVerifCode>();
  return (
    <ScreenContainer>
      <ScreenTitle title="Authentification par mail" />
      <VerifCodeChecker
        validUntil={new Date(validUntil)}
        email={email}
        verifType={"PWReset"}
      />
    </ScreenContainer>
  );
};

export default ResetPwValidationScreen;
