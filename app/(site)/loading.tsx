'use client';

import { Box } from '@/components/Box';

import { Triangle } from 'react-loader-spinner';

const Loading = () => {
  return (
    <Box className="h-full flex items-center justify-content">
      <Triangle
        height="80"
        width="80"
        color="#22c55e"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </Box>
  );
};

export default Loading;
