import Image from 'next/image';
import React, { FC } from 'react';

interface Props {
  width?: number;
  height?: number;
}

const TonImage: FC<Props> = ({ width = 30, height = 30 }) => {
  return <Image src={'/images/tokens/ton_symbol.webp'} width={width} height={height} alt="ton" />;
};

export default TonImage;
