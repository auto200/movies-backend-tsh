import React from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

type BasicTooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export const BasicTooltip: React.FC<BasicTooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
