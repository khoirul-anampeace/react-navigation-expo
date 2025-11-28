import React, { useState } from 'react';
import { View } from 'react-native';
import { RegisterFormData } from '../../types/register';
import RegisterStepOneScreen from './RegisterStepOneScreen';
import RegisterStepTwoScreen from './RegisterStepTwoScreen';
import RegisterSuccessScreen from './RegisterSuccessScreen';

interface Props {
  navigation: any;
}

type Step = 'step1' | 'step2' | 'success';

export default function RegisterScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>('step1');
  const [formData, setFormData] = useState<RegisterFormData | null>(null);

  const handleStepOneComplete = (data: RegisterFormData) => {
    console.log('✅ Step 1 complete:', data);
    setFormData(data);
    setCurrentStep('step2');
  };

  const handleStepTwoBack = () => {
    setCurrentStep('step1');
  };

  const handleRegistrationSuccess = () => {
    setCurrentStep('success');
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
      {currentStep === 'step1' && (
        <RegisterStepOneScreen
          onNext={handleStepOneComplete}
          initialData={formData || undefined}
        />
      )}

      {currentStep === 'step2' && formData && (
        <RegisterStepTwoScreen
          formData={formData}
          onSuccess={handleRegistrationSuccess}
          onBack={handleStepTwoBack}
        />
      )}

      {currentStep === 'success' && (
        <RegisterSuccessScreen onGoToLogin={handleGoToLogin} />
      )}
    </View>
  );
}