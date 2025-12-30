import React from 'react';
import { SingleTooltipContext } from '@/components/single-tooltip-provider';

export function useTooltip() {
  const tooltipId = React.useId();
  const { openTooltipId, setOpenTooltipId } = React.useContext(SingleTooltipContext);
  return {
    isVisible: tooltipId === openTooltipId,
    displayTooltip: () => setOpenTooltipId(tooltipId),
  };
}
