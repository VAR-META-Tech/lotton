import React from 'react';

type Props = {
  text: string;
};

const TextWrap = ({ text }: Props) => {
  return (
    <div className="rounded-full flex justify-center text-[1.625rem] text-white font-bold items-center w-9 h-9 bg-gradient-to-br from-[#FFBF00] to-[#ED9BD6]">
      {text}
    </div>
  );
};

export default TextWrap;
