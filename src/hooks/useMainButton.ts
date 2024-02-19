import { useMainButton as useMainButtonComponent } from '@tma.js/sdk-react';
import { useMount } from './useMount';
import { useCallback, useMemo } from 'react';

type Props = {
  text: string;
  onClick: () => void;
};

export const useMainButton = ({ text, onClick }: Props) => {
  const mainButton = useMainButtonComponent();

  useMount(() => {
    mainButton.on('click', onClick);
    mainButton.setParams({
      text: text.toUpperCase(),
      backgroundColor: '#0098EA',
      textColor: '#ffffff',
    });
    mainButton.show();
    mainButton.enable();

    return () => {
      mainButton.hide();
      mainButton.off('click', onClick);
      mainButton.disable();
    };
  });
};
