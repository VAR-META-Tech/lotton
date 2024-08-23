import React from 'react';

import { FAQ_DATA } from '../utils/const';
import FaqItem from './FaqItem';

const FaqContent = () => {
  return (
    <div>
      <h2 className="text-base font-bold border-b border-gray-color py-2 container">FAQ</h2>

      {FAQ_DATA?.map((item, index) => (
        <FaqItem key={index} value={item?.value} title={item?.title} content={item?.content} />
      ))}
    </div>
  );
};

export default FaqContent;
