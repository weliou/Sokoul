import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface FocusableButtonProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  focusedClassName?: string;
  focusKey?: string; // NOUVEAU : Accepte une clé personnalisée
}

export function FocusableButton({
  children,
  onPress,
  className = '',
  focusedClassName = 'ring-4 ring-blue-500 scale-105',
  focusKey,
}: FocusableButtonProps) {
  const { ref, focused } = useFocusable({
    onEnterPress: onPress,
    focusKey, // On transmet la clé à la librairie
  });

  return (
    <button
      ref={ref}
      className={clsx(
        'transition-all duration-200 ease-out',
        className,
        focused && focusedClassName
      )}
      onClick={onPress}
    >
      {children}
    </button>
  );
}