import { IconType } from 'react-icons';
import { ComponentType } from 'react';

interface IconProps {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}

export default function Icon({ icon: IconComponent, className = '' }: IconProps) {
  return <IconComponent className={className} />;
} 